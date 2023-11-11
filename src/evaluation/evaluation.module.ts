import { Module } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { EvaluationController } from './evaluation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AbilityModule } from 'src/ability/ability.module';
import { RoleModule } from 'src/role/role.module';
import { EvaluationSchema } from './schema/evaluation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Evaluation', schema: EvaluationSchema }]),
    AbilityModule,
    RoleModule,
  ],
  controllers: [EvaluationController],
  providers: [EvaluationService],
  exports: [EvaluationService]
})
export class EvaluationModule {}
