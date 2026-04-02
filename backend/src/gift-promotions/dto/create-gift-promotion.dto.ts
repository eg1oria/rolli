import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateGiftPromotionDto {
  @ApiProperty({ example: 350000, description: 'Сумма порога в копейках' })
  @IsInt()
  @Min(0)
  thresholdAmount: number;

  @ApiProperty({ example: 'Филадельфия 10шт' })
  @IsString()
  giftDescription: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
