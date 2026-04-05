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

import { randomUUID } from 'crypto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telegramService: TelegramService,
  ) {}

  async create(dto: CreateOrderDto) {
    // TODO: Включить проверку рабочих часов при деплое
    // Check working hours (9:00–22:00 Orenburg time) - DISABLED FOR DEVELOPMENT
    // const now = new Date();
    // const orenburgTime = new Date(
    //   now.toLocaleString('en-US', { timeZone: 'Asia/Yekaterinburg' }),
    // );
    // const hour = orenburgTime.getHours();
    // if (hour < 9 || hour >= 22) {
    //   throw new BadRequestException(
    //     'Заказы принимаются с 9:00 до 22:00 по оренбургскому времени. Попробуйте позже.',
    //   );
    // }

    if (dto.items.length === 0) {
      throw new BadRequestException(
        'Заказ должен содержать хотя бы один товар',
      );
    }

    // Merge duplicate productIds
    const mergedItemsMap = new Map<number, number>();
    for (const item of dto.items) {
      mergedItemsMap.set(
        item.productId,
        (mergedItemsMap.get(item.productId) || 0) + item.quantity,
      );
    }
    const mergedItems = Array.from(mergedItemsMap, ([productId, quantity]) => ({
      productId,
      quantity,
    }));

    if (dto.type === OrderType.DELIVERY && !dto.address) {
      throw new BadRequestException('Адрес обязателен для доставки');
    }

    const productIds = mergedItems.map((item) => item.productId);
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
    const orderItems = mergedItems.map((item) => {
      const product = productMap.get(item.productId)!;
      const itemTotal = product.price * item.quantity;
      totalPrice += itemTotal;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    });

    // Add sauce prices to total
    if (dto.sauces) {
      const sauceNames = dto.sauces
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (sauceNames.length > 0) {
        const sauces = await this.prisma.sauce.findMany({
          where: { name: { in: sauceNames }, isAvailable: true },
        });
        for (const sauce of sauces) {
          totalPrice += sauce.price;
        }
      }
    }

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
    const yekaterinburgTime = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Yekaterinburg' }),
    );
    const checkHour = yekaterinburgTime.getHours();
    if (checkHour < 12 || checkHour >= 22) {
      outsideWorkingHours = true;
    }

    // Send Telegram notification (fire and forget, but with proper error handling)
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
        gift: dto.gift || '',
        totalPrice: order.totalPrice,
      })
      .catch((err) => {
        console.error('Failed to send Telegram notification:', err);
      });

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
    const id = randomUUID().replace(/-/g, '').substring(0, 8).toUpperCase();
    return `ORD-${id}`;
  }
}
