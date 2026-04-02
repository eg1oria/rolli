import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@Injectable()
export class PromotionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllActive() {
    return this.prisma.promotion.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findAllAdmin() {
    return this.prisma.promotion.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: number) {
    const promotion = await this.prisma.promotion.findUnique({ where: { id } });
    if (!promotion) {
      throw new NotFoundException(`Акция #${id} не найдена`);
    }
    return promotion;
  }

  async create(dto: CreatePromotionDto) {
    return this.prisma.promotion.create({ data: dto });
  }

  async update(id: number, dto: UpdatePromotionDto) {
    await this.findOne(id);
    return this.prisma.promotion.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.promotion.delete({ where: { id } });
  }
}
