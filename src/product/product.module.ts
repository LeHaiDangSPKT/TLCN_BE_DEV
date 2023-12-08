import { Module, forwardRef } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AbilityModule } from 'src/ability/ability.module';
import { RoleModule } from 'src/role/role.module';
import { ProductSchema } from './schema/product.schema';
import { StoreModule } from 'src/store/store.module';
import { EvaluationModule } from 'src/evaluation/evaluation.module';
import { UserModule } from 'src/user/user.module';
import { NotificationModule } from 'src/notification/notification.module';
import { BillModule } from 'src/bill/bill.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    AbilityModule,
    RoleModule,
    StoreModule,
    forwardRef(() => EvaluationModule),
    UserModule,
    NotificationModule,
    forwardRef(() => BillModule),
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService]
})
export class ProductModule {}
