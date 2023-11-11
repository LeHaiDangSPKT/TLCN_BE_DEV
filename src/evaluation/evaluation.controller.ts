import { Body, Controller, Get, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AbilitiesGuard } from 'src/ability/guards/abilities.guard';
import { CheckAbilities, UpdateEvaluationAbility } from 'src/ability/decorators/abilities.decorator';
import { Request } from 'express';
import { BodyDto } from './dto/body.dto';
import { CheckRole } from 'src/ability/decorators/role.decorator';
import { RoleName } from 'src/role/schema/role.schema';
import { GetCurrentUserId } from 'src/auth/decorators/get-current-userid.decorator';
import { Evaluation } from './schema/evaluation.schema';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('evaluation')
@ApiTags('Evaluation')
@ApiBearerAuth('Authorization')
export class EvaluationController {
  constructor(
    private readonly evaluationService: EvaluationService
  ) { }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateEvaluationAbility())
  @CheckRole(RoleName.USER)
  @ApiQuery({ name: 'productId', type: String, required: true })
  @Put('user')
  async create(
    @Query('productId') productId: string,
    @Body() body: BodyDto,
    @GetCurrentUserId() userId: string,
  ): Promise<boolean> {
    const result = this.evaluationService.update(userId, productId, body.body)
    return result
  }


  @Public()
  @ApiQuery({ name: 'productId', type: String, required: true })
  @Get()
  async getByProductId(
    @Query('productId') productId: string,
  ): Promise<Evaluation> {
    const evaluation = await this.evaluationService.getByProductId(productId)
    return evaluation
  }
}
