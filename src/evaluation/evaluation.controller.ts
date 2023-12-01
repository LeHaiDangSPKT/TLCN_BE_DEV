import { Body, Controller, Get, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AbilitiesGuard } from 'src/ability/guards/abilities.guard';
import { CheckAbilities, UpdateEvaluationAbility } from 'src/ability/decorators/abilities.decorator';
import { BodyDto } from './dto/body.dto';
import { CheckRole } from 'src/ability/decorators/role.decorator';
import { RoleName } from 'src/role/schema/role.schema';
import { GetCurrentUserId } from 'src/auth/decorators/get-current-userid.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { NotFoundException } from 'src/core/error.response';
import { SuccessResponse } from 'src/core/success.response';
import { NotificationService } from 'src/notification/notification.service';
import { ProductService } from 'src/product/product.service';
import { UserService } from 'src/user/user.service';
import { CreateNotificationDto } from 'src/notification/dto/create-notification.dto';
import { StoreService } from 'src/store/store.service';

@Controller('evaluation')
@ApiTags('Evaluation')
@ApiBearerAuth('Authorization')
export class EvaluationController {
  constructor(
    private readonly evaluationService: EvaluationService,
    private readonly notificationService: NotificationService,
    private readonly productService: ProductService,
    private readonly userService: UserService,
    private readonly storeService: StoreService,
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
  ): Promise<SuccessResponse | NotFoundException> {

    const user = await this.userService.getById(userId)
    if (!user) return new NotFoundException("Không tìm thấy người dùng này!")

    const product = await this.productService.getById(productId)
    if (!product) return new NotFoundException("Không tìm thấy sản phẩm này!")

    const store = await this.storeService.getById(product.storeId)
    if (!store) return new NotFoundException("Không tìm thấy cửa hàng này!")

    const hadEvaluation = await this.evaluationService.checkEvaluationByUserIdAndProductId(userId, productId)

    const result = await this.evaluationService.update(userId, productId, body.body)
    if (!result) return new NotFoundException("Không tìm thấy sản phẩm này!")

    if (userId !== store.userId && !hadEvaluation) {
      const createNotiData: CreateNotificationDto  = {
        userIdFrom: userId,
        userIdTo: store.userId,
        content: "đã bày tỏ cảm xúc về sản phẩm của bạn!",
        type: body.body,
        sub: {
          fullName: user.fullName,
          avatar: user.avatar,
          productId: productId.toString(),
        }
      }
      await this.notificationService.create(createNotiData)
    }

    return new SuccessResponse({
      message: "Đánh giá thành công!",
      metadata: { data: result },
    })
  }


  @Public()
  @ApiQuery({ name: 'productId', type: String, required: true })
  @Get()
  async getByProductId(
    @Query('productId') productId: string,
  ): Promise<SuccessResponse | NotFoundException> {
    const evaluation = await this.evaluationService.getByProductId(productId)
    if (!evaluation) return new NotFoundException("Không tìm thấy sản phẩm này!")
    return new SuccessResponse({
      message: "Lấy danh sách đánh giá thành công!",
      metadata: { data: evaluation },
    })
  }
}
