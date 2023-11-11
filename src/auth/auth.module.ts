import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { RoleModule } from 'src/role/role.module';
import { JwtATStrategy } from './strategies/jwt-at.strategy';
import { JwtRTStrategy } from './strategies/jwt-rt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { UserTokenSchema } from '../usertoken/schema/usertoken.schema';
import { AbilityModule } from 'src/ability/ability.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtATAuthGuard } from './guards/jwt-at-auth.guard';
import { UsertokenModule } from 'src/usertoken/usertoken.module';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [
    JwtModule.register({}),
    UserModule,
    PassportModule,
    RoleModule,
    AbilityModule,
    UsertokenModule,
    FirebaseModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtATStrategy,
    JwtRTStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtATAuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule { }