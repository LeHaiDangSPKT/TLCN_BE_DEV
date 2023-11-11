import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';
import { AbilityModule } from 'src/ability/ability.module';
import { RoleModule } from 'src/role/role.module';
import { HasPermitRoleMiddleware } from 'src/user/middleware/HasPermitRole.middleware';
import { HasSameRoleUserMiddleware } from './middleware/HasSameRoleUser.middleware';
import FreedomCustom from 'src/exceptions/FreedomCustom.exception';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]), AbilityModule, RoleModule],
  controllers: [UserController],
  providers: [UserService, FreedomCustom],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HasPermitRoleMiddleware)
      .forRoutes({ path: 'user/user/:id', method: RequestMethod.GET }, { path: 'user/user/:id', method: RequestMethod.PUT }, { path: 'user/user/:id', method: RequestMethod.DELETE })
    consumer
      .apply(HasSameRoleUserMiddleware)
      .forRoutes({ path: 'user/user/addFriend/:id', method: RequestMethod.POST }, { path: 'user/user/unFriend/:id', method: RequestMethod.POST })
  }
}