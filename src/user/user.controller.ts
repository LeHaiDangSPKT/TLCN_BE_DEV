import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CheckAbilities, DeleteUserAbility, ReadUserAbility, UpdateUserAbility } from 'src/ability/decorators/abilities.decorator';
import { AbilitiesGuard } from 'src/ability/guards/abilities.guard';
import { User } from './schema/user.schema';
import { RoleService } from 'src/role/role.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AddIdDto } from './dto/add-friend-store.dto';
import { CheckRole } from 'src/ability/decorators/role.decorator';
import { RoleName } from 'src/role/schema/role.schema';
import { BadRequestException, ForbiddenException, NotFoundException } from 'src/core/error.response';
import { SuccessResponse } from 'src/core/success.response';
import { GetCurrentUserId } from 'src/auth/decorators/get-current-userid.decorator';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth('Authorization')
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly roleService: RoleService) { }


  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadUserAbility())
  @CheckRole(RoleName.USER, RoleName.ADMIN)
  @Get('user/:id')
  async findOne(@Param('id') id: string): Promise<SuccessResponse | NotFoundException> {
    const user = await this.userService.getById(id);
    if (!user) return new NotFoundException("Không tìm thấy người dùng này!")
    return new SuccessResponse({
      message: "Lấy thông tin người dùng thành công!",
      metadata: { data: user },
    })
  }

  // Update user
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateUserAbility())
  @CheckRole(RoleName.USER, RoleName.ADMIN)
  @Patch('user/:id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetCurrentUserId() userId: string)
    : Promise<SuccessResponse | NotFoundException> {

    const currentUserRole = await this.roleService.getRoleNameByUserId(userId)

    if (currentUserRole.includes(RoleName.USER) && id !== userId) {
      return new ForbiddenException("Bạn không có quyền cập nhật thông tin người dùng khác!")
    }

    const updatedUser = await this.userService.update(id, updateUserDto)

    return new SuccessResponse({
      message: "Cập nhật thông tin người dùng thành công!",
      metadata: { data: updatedUser },
    })

  }

  // Delete user
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new DeleteUserAbility())
  @CheckRole(RoleName.USER, RoleName.ADMIN)
  @Delete('user/:id')
  async delete(@Param('id') id: string): Promise<SuccessResponse | NotFoundException> {
    const user = await this.userService.delete(id);
    if (!user) return new NotFoundException("Không tìm thấy người dùng này!")
    return new SuccessResponse({
      message: "Xóa người dùng thành công!",
      metadata: { data: user },
    })
  }

  // Add userId to listFriends
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateUserAbility())
  @CheckRole(RoleName.USER)
  @Post('user/addFriend/:id')
  async addFriend(@Param('id') id: string, @Body() req: AddIdDto): Promise<SuccessResponse | BadRequestException> {
    const me = await this.userService.addFriend(id, req.id);
    const myfriend = await this.userService.addFriend(req.id, id);
    if (!me || !myfriend) return new BadRequestException("Không thể kết bạn!")
    return new SuccessResponse({
      message: "Kết bạn thành công!",
      metadata: { data: me },
    })
  }

  // Remove userId from listFriends
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateUserAbility())
  @CheckRole(RoleName.USER)
  @Post('user/unFriend/:id')
  async unFriend(@Param('id') id: string, @Body() req: AddIdDto): Promise<SuccessResponse | BadRequestException> {
    const me = await this.userService.unFriend(id, req.id);
    const myfriend = await this.userService.unFriend(req.id, id);
    if (!me || !myfriend) return new BadRequestException("Không thể hủy kết bạn!")
    return new SuccessResponse({
      message: "Hủy kết bạn thành công!",
      metadata: { data: me },
    })
  }

  //Add storeId to listStore
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateUserAbility())
  @CheckRole(RoleName.USER)
  @Post('user/followStore/:id')
  async addStore(@Param('id') id: string, @Body() req: AddIdDto): Promise<SuccessResponse | BadRequestException> {
    const user = await this.userService.followStore(id, req.id);
    if (!user) return new BadRequestException("Không thể theo dõi cửa hàng!")
    return new SuccessResponse({
      message: "Theo dõi cửa hàng thành công!",
      metadata: { data: user },
    })
  }

  //Remove storeId from listStore
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateUserAbility())
  @CheckRole(RoleName.USER)
  @Post('user/unFollowStore/:id')
  async unFollowStore(@Param('id') id: string, @Body() req: AddIdDto): Promise<SuccessResponse | BadRequestException> {
    const user = await this.userService.unFollowStore(id, req.id);
    if (!user) return new BadRequestException("Không thể bỏ theo dõi cửa hàng!")
    return new SuccessResponse({
      message: "Bỏ theo dõi cửa hàng thành công!",
      metadata: { data: user },
    })
  }

  //Add warningCount for user by id
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateUserAbility())
  @CheckRole(RoleName.MANAGER)
  @Put('manager/warningcount/:id')
  async updateWarningCount(@Param('id') id: string, @Param("action") action: string): Promise<SuccessResponse | BadRequestException> {
    const user = await this.userService.updateWarningCount(id, action);
    if (!user) return new BadRequestException("Không thể cập nhật số lần vi phạm!")
    return new SuccessResponse({
      message: "Cập nhật số lần vi phạm thành công!",
      metadata: { data: user },
    })
  }

  // api/user/admin?page=1&limit=1&search=(Họ tên, email)
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadUserAbility())
  @CheckRole(RoleName.ADMIN)
  @Get('admin')
  async getAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
  ): Promise<SuccessResponse> {
    const data = await this.userService.getAll(page, limit, search)
    return new SuccessResponse({
      message: "Lấy danh sách người dùng thành công!",
      metadata: { data },
    })
  }
}
