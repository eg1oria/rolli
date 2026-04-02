import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsInt, Min } from 'class-validator';

export class CreatePromotionDto {
  @ApiProperty({ example: 'Скидка 20%', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: '/uploads/promotions/sale-card1.png' })
  @IsString()
  imageUrl: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: 0, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  sortOrder?: number;
}
