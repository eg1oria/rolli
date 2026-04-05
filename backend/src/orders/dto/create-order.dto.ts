import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderType } from '@prisma/client';

export class OrderItemDto {
  @ApiProperty({ example: 1, description: 'ID товара' })
  @IsInt()
  productId: number;

  @ApiProperty({ example: 2, description: 'Количество' })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ enum: OrderType, example: 'DELIVERY' })
  @IsEnum(OrderType)
  type: OrderType;

  @ApiProperty({ example: 'Иван Иванов' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ example: '+79123434412' })
  @IsString()
  @IsNotEmpty()
  customerPhone: string;

  @ApiProperty({ example: 'ул. Ленина 15, кв. 42', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 'Без васаби', required: false })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({ example: 'Унаги, Соевый', required: false })
  @IsString()
  @IsOptional()
  sauces?: string;

  @ApiProperty({ example: 'Филадельфия 10шт', required: false })
  @IsString()
  @IsOptional()
  gift?: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
