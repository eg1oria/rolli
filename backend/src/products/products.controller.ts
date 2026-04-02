import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/auth.guard';

@ApiTags('Products')
@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('products')
  @ApiOperation({ summary: 'Список товаров с пагинацией и фильтром' })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Список товаров' })
  findAll(
    @Query('categoryId') categoryId?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.productsService.findAll({
      categoryId: categoryId ? parseInt(categoryId, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    });
  }

  @Get('products/recommended')
  @ApiOperation({ summary: 'Рекомендуемые товары' })
  @ApiResponse({ status: 200, description: 'Список рекомендуемых товаров' })
  findRecommended() {
    return this.productsService.findRecommended();
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Получить товар по ID' })
  @ApiResponse({ status: 200, description: 'Товар' })
  @ApiResponse({ status: 404, description: 'Товар не найден' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Post('admin/products')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать товар' })
  @ApiResponse({ status: 201, description: 'Товар создан' })
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Put('admin/products/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить товар' })
  @ApiResponse({ status: 200, description: 'Товар обновлён' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, dto);
  }

  @Delete('admin/products/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить товар' })
  @ApiResponse({ status: 200, description: 'Товар удалён' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  @Patch('admin/products/:id/availability')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Переключить доступность товара' })
  @ApiResponse({ status: 200, description: 'Доступность изменена' })
  toggleAvailability(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.toggleAvailability(id);
  }

  @Patch('admin/products/:id/recommended')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Переключить рекомендацию товара' })
  @ApiResponse({ status: 200, description: 'Рекомендация изменена' })
  toggleRecommended(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.toggleRecommended(id);
  }
}
