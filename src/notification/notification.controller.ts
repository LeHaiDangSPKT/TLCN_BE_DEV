import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Notification } from './schema/notification.schema';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CheckAbilities, ReadNotificationAbility, UpdateNotificationAbility } from 'src/ability/decorators/abilities.decorator';
import { CheckRole } from 'src/ability/decorators/role.decorator';
import { AbilitiesGuard } from 'src/ability/guards/abilities.guard';
import { RoleName } from 'src/role/schema/role.schema';
import { GetCurrentUserId } from 'src/auth/decorators/get-current-userid.decorator';
import { UserService } from 'src/user/user.service';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { SuccessResponse } from 'src/core/success.response';
import { NotFoundException } from 'src/core/error.response';

@Controller('notification')
@ApiTags('Notification')
@ApiBearerAuth('Authorization')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly userService: UserService,
  ) { }

  @Public()
  @Post()
  async create(
    @Body() notification: CreateNotificationDto
  ): Promise<SuccessResponse> {
    const newNotification = await this.notificationService.create(notification)
    return new SuccessResponse({
      message: "Tạo thông báo thành công!",
      metadata: { data: newNotification },
    })
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadNotificationAbility())
  @CheckRole(RoleName.SELLER, RoleName.USER)
  @Get()
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async getAllByUserId(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @GetCurrentUserId() userId: string,
  ): Promise<SuccessResponse> {
    const data = await this.notificationService.getAllByUserId(userId, page, limit)
    return new SuccessResponse({
      message: "Lấy danh sách thông báo thành công!",
      metadata: { data },
    })
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateNotificationAbility())
  @CheckRole(RoleName.SELLER, RoleName.USER)
  @Put('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateNoti: UpdateNotificationDto
  ): Promise<SuccessResponse | NotFoundException> {
    const result = await this.notificationService.update(id, updateNoti)
    if(!result) return new NotFoundException("Không tìm thấy thông báo này!")
    return new SuccessResponse({
      message: "Cập nhật thông báo thành công!",
      metadata: { data: result },
    })
  }
}
