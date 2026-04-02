import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramService } from '../telegram/telegram.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderType, OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telegramService: TelegramService,
  ) {}

  async create(dto: CreateOrderDto) {
    if (dto.items.length === 0) {
      throw new BadRequestException('Заказ должен содержать хотя бы один товар');
    }

    if (dto.type === OrderType.DELIVERY && !dto.address) {
      throw new BadRequestException('Адрес обязателен для доставки');
    }

    const productIds = dto.items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds }, isAvailable: true },
    });

    if (products.length !== productIds.length) {
      const foundIds = new Set(products.map((p) => p.id));
      const missingIds = productIds.filter((id) => !foundIds.has(id));
      throw new BadRequestException(
        `Товары недоступны или не найдены: ${missingIds.join(', ')}`,
      );
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    let totalPrice = 0;
    const orderItems = dto.items.map((item) => {
      const product = productMap.get(item.productId)!;
      const itemTotal = product.price * item.quantity;
      totalPrice += itemTotal;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    });

    const orderNumber = this.generateOrderNumber();

    const address =
      dto.type === OrderType.PICKUP
        ? 'Пр. Дзержинского 27/2'
        : dto.address || null;

    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        type: dto.type,
        customerName: dto.customerName,
        customerPhone: dto.customerPhone,
        address,
        comment: dto.comment || '',
        sauces: dto.sauces || '',
        totalPrice,
        status: OrderStatus.NEW,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    // Check working hours (12:00–22:00 Yekaterinburg time)
    let outsideWorkingHours = false;
    const now = new Date();
    const yekaterinburgTime = new Date(
      now.toLocaleString('en-US', { timeZone: 'Asia/Yekaterinburg' }),
    );
    const hour = yekaterinburgTime.getHours();
    if (hour < 12 || hour >= 22) {
      outsideWorkingHours = true;
    }

    // Send Telegram notification
    this.telegramService
      .sendOrderNotification({
        orderNumber: order.orderNumber,
        type: order.type,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        address: order.address,
        items: order.items.map((item) => ({
          name: item.product.name,
          pieces: item.product.pieces,
          quantity: item.quantity,
          price: item.price,
        })),
        sauces: order.sauces,
        comment: order.comment,
        totalPrice: order.totalPrice,
      })
      .catch(() => {});

    return {
      ...order,
      warning: outsideWorkingHours
        ? 'Заказ принят вне рабочих часов (12:00–22:00). Он будет обработан в рабочее время.'
        : undefined,
    };
  }

  async findByOrderNumber(orderNumber: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
    if (!order) {
      throw new NotFoundException(`Заказ #${orderNumber} не найден`);
    }
    return order;
  }

  async findAll(params: {
    status?: OrderStatus;
    limit?: number;
    offset?: number;
  }) {
    const { status, limit = 50, offset = 0 } = params;
    const where = status ? { status } : {};

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          items: {
            include: { product: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.order.count({ where }),
    ]);

    return { data, total, limit, offset };
  }

  async updateStatus(id: number, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Заказ #${id} не найден`);
    }
    return this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
      include: {
        items: {
          include: { product: true },
        },
      },
    });
  }

  private generateOrderNumber(): string {
    const now = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${now}-${random}`;
  }
}
