import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserotpSchema } from './schema/userotp.schema';
import { AbilityModule } from 'src/ability/ability.module';
import { RoleModule } from 'src/role/role.module';
import { UserotpService } from './userotp.service';
import { UserotpController } from './userotp.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Userotp', schema: UserotpSchema }]),
    AbilityModule,
    RoleModule,
    UserModule,
  ],
  controllers: [UserotpController],
  providers: [UserotpService],
  exports: [UserotpService],
})
export class UserotpModule { }