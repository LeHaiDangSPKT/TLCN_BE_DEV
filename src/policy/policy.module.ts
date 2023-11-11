import { Module } from '@nestjs/common';
import { PolicyController } from './policy.controller';
import { PolicyService } from './policy.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PolicySchema } from './schema/policy.schema';
import { ConfigModule } from '@nestjs/config';
import { AbilityModule } from 'src/ability/ability.module';
import { RoleModule } from 'src/role/role.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Policy', schema: PolicySchema }]),
    AbilityModule,
    RoleModule,
  ],
  controllers: [PolicyController],
  providers: [PolicyService]
})
export class PolicyModule { }
