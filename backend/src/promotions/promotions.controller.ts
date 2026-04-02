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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PromotionsService } from './promotions.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { JwtAuthGuard } from '../auth/auth.guard';

@ApiTags('Promotions')
@Controller()
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get('promotions')
  @ApiOperation({ summary: 'Активные акции' })
  @ApiResponse({ status: 200, description: 'Список акций' })
  findAllActive() {
    return this.promotionsService.findAllActive();
  }

  @Get('admin/promotions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Все акции для админки' })
  @ApiResponse({ status: 200, description: 'Список всех акций' })
  findAllAdmin() {
    return this.promotionsService.findAllAdmin();
  }

  @Post('admin/promotions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать акцию' })
  @ApiResponse({ status: 201, description: 'Акция создана' })
  create(@Body() dto: CreatePromotionDto) {
    return this.promotionsService.create(dto);
  }

  @Put('admin/promotions/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить акцию' })
  @ApiResponse({ status: 200, description: 'Акция обновлена' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePromotionDto,
  ) {
    return this.promotionsService.update(id, dto);
  }

  @Delete('admin/promotions/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить акцию' })
  @ApiResponse({ status: 200, description: 'Акция удалена' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.promotionsService.remove(id);
  }
}
