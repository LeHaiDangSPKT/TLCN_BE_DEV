import { Body, Controller, Post, Query, Req, UseGuards } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { Request } from 'express';
import { Feedback } from './schema/feedback.schema';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { AbilitiesGuard } from 'src/ability/guards/abilities.guard';
import { CheckAbilities, CreateFeedBackAbility } from 'src/ability/decorators/abilities.decorator';
import { CheckRole } from 'src/ability/decorators/role.decorator';
import { RoleName } from 'src/role/schema/role.schema';
import { GetCurrentUserId } from 'src/auth/decorators/get-current-userid.decorator';
import { UserService } from 'src/user/user.service';
import { SuccessResponse } from 'src/core/success.response';

@Controller('feedback')
@ApiTags('FeedBack')
@ApiBearerAuth('Authorization')
export class FeedbackController {
  constructor(
    private readonly feedbackService: FeedbackService,
    private readonly userService: UserService,
  ) { }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new CreateFeedBackAbility())
  @CheckRole(RoleName.USER)
  @ApiQuery({ name: 'productId', type: String, required: true })
  @Post('user')
  async create(
    @Query('productId') productId: string,
    @Body() feedback: CreateFeedbackDto,
    @GetCurrentUserId() userId: string,
  ): Promise<SuccessResponse> {
    const newFeedback = await this.feedbackService.create(userId, productId, feedback)
    await this.userService.updateWallet(userId, 5000, "plus")
    return new SuccessResponse({
      message: "Đánh giá thành công!",
      metadata: { data: newFeedback },
    })
  }

}
