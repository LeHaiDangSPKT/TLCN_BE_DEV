import {  Module, forwardRef } from '@nestjs/common';
import { BillService } from './bill.service';
import { BillController } from './bill.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BillSchema } from './schema/bill.schema';
import { AbilityModule } from 'src/ability/ability.module';
import { RoleModule } from 'src/role/role.module';
import { PaymentModule } from './payment/payment.module';
import { UserModule } from 'src/user/user.module';
import { StoreModule } from 'src/store/store.module';
import { ProductModule } from 'src/product/product.module';
import { FirebaseService } from 'src/firebase/firebase.service';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { CartModule } from 'src/cart/cart.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Bill', schema: BillSchema }]),
    AbilityModule,
    RoleModule,
    PaymentModule,
    UserModule,
    StoreModule,
    CartModule,
    forwardRef(() => ProductModule),
  ],
  controllers: [BillController],
  providers: [BillService],
  exports: [BillService],
})
export class BillModule {}
