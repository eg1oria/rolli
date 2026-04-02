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
import { SaucesService } from './sauces.service';
import { CreateSauceDto } from './dto/create-sauce.dto';
import { UpdateSauceDto } from './dto/update-sauce.dto';
import { JwtAuthGuard } from '../auth/auth.guard';

@ApiTags('Sauces')
@Controller()
export class SaucesController {
  constructor(private readonly saucesService: SaucesService) {}

  @Get('sauces')
  @ApiOperation({ summary: 'Список доступных соусов' })
  @ApiResponse({ status: 200, description: 'Список соусов' })
  findAll() {
    return this.saucesService.findAll();
  }

  @Post('admin/sauces')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать соус' })
  @ApiResponse({ status: 201, description: 'Соус создан' })
  create(@Body() dto: CreateSauceDto) {
    return this.saucesService.create(dto);
  }

  @Put('admin/sauces/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить соус' })
  @ApiResponse({ status: 200, description: 'Соус обновлён' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSauceDto) {
    return this.saucesService.update(id, dto);
  }

  @Delete('admin/sauces/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить соус' })
  @ApiResponse({ status: 200, description: 'Соус удалён' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.saucesService.remove(id);
  }
}
