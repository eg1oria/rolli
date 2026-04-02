import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  IsBoolean,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Филадельфия' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '8 шт' })
  @IsString()
  @IsNotEmpty()
  pieces: string;

  @ApiProperty({ example: 'Рис, лосось, сливочный сыр', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 990, description: 'Цена в рублях' })
  @IsInt()
  @Min(0)
  price: number;

  @ApiProperty({ example: '/uploads/products/phila.png', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  categoryId: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isRecommended?: boolean;

  @ApiProperty({ example: 0, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  sortOrder?: number;
}
