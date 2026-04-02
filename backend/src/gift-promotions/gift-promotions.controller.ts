import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GiftPromotionsService } from './gift-promotions.service';
import { CreateGiftPromotionDto } from './dto/create-gift-promotion.dto';
import { UpdateGiftPromotionDto } from './dto/update-gift-promotion.dto';
import { JwtAuthGuard } from '../auth/auth.guard';

@ApiTags('Gift Promotions')
@Controller()
export class GiftPromotionsController {
  constructor(private readonly giftPromotionsService: GiftPromotionsService) {}

  @Get('gift-promotions/active')
  @ApiOperation({ summary: 'Активная подарочная акция' })
  @ApiResponse({ status: 200, description: 'Подарочная акция' })
  findActive() {
    return this.giftPromotionsService.findActive();
  }

  @Post('admin/gift-promotions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать подарочную акцию' })
  @ApiResponse({ status: 201, description: 'Акция создана' })
  create(@Body() dto: CreateGiftPromotionDto) {
    return this.giftPromotionsService.create(dto);
  }

  @Put('admin/gift-promotions/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить подарочную акцию' })
  @ApiResponse({ status: 200, description: 'Акция обновлена' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGiftPromotionDto) {
    return this.giftPromotionsService.update(id, dto);
  }

  @Delete('admin/gift-promotions/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить подарочную акцию' })
  @ApiResponse({ status: 200, description: 'Акция удалена' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.giftPromotionsService.remove(id);
  }
}
