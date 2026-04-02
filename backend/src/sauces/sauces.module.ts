import { Module } from '@nestjs/common';
import { SaucesController } from './sauces.controller';
import { SaucesService } from './sauces.service';

@Module({
  controllers: [SaucesController],
  providers: [SaucesService],
})
export class SaucesModule {}
