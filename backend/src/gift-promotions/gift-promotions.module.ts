import { Module } from '@nestjs/common';
import { GiftPromotionsController } from './gift-promotions.controller';
import { GiftPromotionsService } from './gift-promotions.service';

@Module({
  controllers: [GiftPromotionsController],
  providers: [GiftPromotionsService],
})
export class GiftPromotionsModule {}
