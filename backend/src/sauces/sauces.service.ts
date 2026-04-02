import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSauceDto } from './dto/create-sauce.dto';
import { UpdateSauceDto } from './dto/update-sauce.dto';

@Injectable()
export class SaucesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.sauce.findMany({
      where: { isAvailable: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findAllAdmin() {
    return this.prisma.sauce.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findOne(id: number) {
    const sauce = await this.prisma.sauce.findUnique({ where: { id } });
    if (!sauce) {
      throw new NotFoundException(`Соус #${id} не найден`);
    }
    return sauce;
  }

  async create(dto: CreateSauceDto) {
    return this.prisma.sauce.create({ data: dto });
  }

  async update(id: number, dto: UpdateSauceDto) {
    await this.findOne(id);
    return this.prisma.sauce.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.sauce.delete({ where: { id } });
  }
}
