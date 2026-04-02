import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGiftPromotionDto } from './dto/create-gift-promotion.dto';
import { UpdateGiftPromotionDto } from './dto/update-gift-promotion.dto';

@Injectable()
export class GiftPromotionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findActive() {
    return this.prisma.giftPromotion.findFirst({
      where: { isActive: true },
    });
  }

  async findOne(id: number) {
    const promo = await this.prisma.giftPromotion.findUnique({ where: { id } });
    if (!promo) {
      throw new NotFoundException(`Подарочная акция #${id} не найдена`);
    }
    return promo;
  }

  async create(dto: CreateGiftPromotionDto) {
    return this.prisma.giftPromotion.create({ data: dto });
  }

  async update(id: number, dto: UpdateGiftPromotionDto) {
    await this.findOne(id);
    return this.prisma.giftPromotion.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.giftPromotion.delete({ where: { id } });
  }
}
