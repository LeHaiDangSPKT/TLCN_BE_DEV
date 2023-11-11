import { Module } from '@nestjs/common';
import { UsertokenService } from './usertoken.service';
import { UsertokenController } from './usertoken.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserTokenSchema } from './schema/usertoken.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'UserToken', schema: UserTokenSchema }]),
  ],
  controllers: [UsertokenController],
  providers: [UsertokenService],
  exports: [UsertokenService],
})
export class UsertokenModule {}
