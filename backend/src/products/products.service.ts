import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: {
    categoryId?: number;
    limit?: number;
    offset?: number;
    includeUnavailable?: boolean;
  }) {
    const {
      categoryId,
      limit = 50,
      offset = 0,
      includeUnavailable = false,
    } = params;
    const where = {
      ...(categoryId ? { categoryId } : {}),
      ...(!includeUnavailable ? { isAvailable: true } : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { sortOrder: 'asc' },
        take: limit,
        skip: offset,
      }),
      this.prisma.product.count({ where }),
    ]);

    return { data, total, limit, offset };
  }

  async findRecommended() {
    return this.prisma.product.findMany({
      where: { isRecommended: true, isAvailable: true },
      include: { category: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!product) {
      throw new NotFoundException(`Товар #${id} не найден`);
    }
    return product;
  }

  async create(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: dto,
      include: { category: true },
    });
  }

  async update(id: number, dto: UpdateProductDto) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: dto,
      include: { category: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    const orderItemCount = await this.prisma.orderItem.count({ where: { productId: id } });
    if (orderItemCount > 0) {
      throw new BadRequestException(
        'Нельзя удалить товар, он присутствует в заказах. Отключите его вместо удаления.',
      );
    }
    return this.prisma.product.delete({ where: { id } });
  }

  async toggleAvailability(id: number) {
    const product = await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: { isAvailable: !product.isAvailable },
    });
  }

  async toggleRecommended(id: number) {
    const product = await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: { isRecommended: !product.isRecommended },
    });
  }
}
