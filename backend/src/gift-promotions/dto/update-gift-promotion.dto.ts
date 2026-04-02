import { PartialType } from '@nestjs/swagger';
import { CreateGiftPromotionDto } from './create-gift-promotion.dto';

export class UpdateGiftPromotionDto extends PartialType(CreateGiftPromotionDto) {}
