import { Module, forwardRef } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { EvaluationController } from './evaluation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AbilityModule } from 'src/ability/ability.module';
import { RoleModule } from 'src/role/role.module';
import { EvaluationSchema } from './schema/evaluation.schema';
import { NotificationModule } from 'src/notification/notification.module';
import { ProductModule } from 'src/product/product.module';
import { UserModule } from 'src/user/user.module';
import { StoreModule } from 'src/store/store.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Evaluation', schema: EvaluationSchema }]),
    AbilityModule,
    RoleModule,
    NotificationModule,
    forwardRef(() => ProductModule),
    UserModule,
    StoreModule,
  ],
  controllers: [EvaluationController],
  providers: [EvaluationService],
  exports: [EvaluationService]
})
export class EvaluationModule {}
