import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreSchema } from './schema/store.schema';
import { AbilityModule } from 'src/ability/ability.module';
import { RoleModule } from 'src/role/role.module';
import { UserModule } from 'src/user/user.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Store', schema: StoreSchema }]),
    AbilityModule,
    RoleModule,
    UserModule
  ],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [StoreService]
})
export class StoreModule {}
