import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsOptional, Min } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Роллы' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'rolls' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 0, required: false })
  @IsInt()
  @Min(0)
  @IsOptional()
  sortOrder?: number;
}
