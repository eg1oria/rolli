import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateSauceDto {
  @ApiProperty({ example: 'Унаги' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 0, description: 'Цена в копейках', required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiProperty({ example: 0, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  sortOrder?: number;
}
