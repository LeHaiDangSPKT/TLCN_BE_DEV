import { Module } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { PromotionSchema } from './schema/promotion.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AbilityModule } from 'src/ability/ability.module';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Promotion', schema: PromotionSchema }]),
    AbilityModule,
    RoleModule,
  ],
  controllers: [PromotionController],
  providers: [PromotionService],
})
export class PromotionModule { }
