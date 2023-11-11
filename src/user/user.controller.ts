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
  async findOne(@Param('id') id: string): Promise<User> {
    const user = await this.userService.getById(id);
    return user
  }

  // Update user
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateUserAbility())
  @CheckRole(RoleName.USER, RoleName.ADMIN)
  @Put('user/:id')
  async update(@Param('id') id: string, @Body() UpdateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userService.update(id, UpdateUserDto);
    return user
  }

  // Delete user
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new DeleteUserAbility())
  @CheckRole(RoleName.USER, RoleName.ADMIN)
  @Delete('user/:id')
  async delete(@Param('id') id: string): Promise<User> {
    const user = await this.userService.delete(id);
    return user
  }

  // Add userId to listFriends
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateUserAbility())
  @CheckRole(RoleName.USER)
  @Post('user/addFriend/:id')
  async addFriend(@Param('id') id: string, @Body() req: AddIdDto): Promise<User> {
    const me = await this.userService.addFriend(id, req.id);
    const myfriend = await this.userService.addFriend(req.id, id);
    return me
  }

  // Remove userId from listFriends
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateUserAbility())
  @CheckRole(RoleName.USER)
  @Post('user/unFriend/:id')
  async unFriend(@Param('id') id: string, @Body() req: AddIdDto): Promise<User> {
    const me = await this.userService.unFriend(id, req.id);
    const myfriend = await this.userService.unFriend(req.id, id);
    return me
  }

  //Add storeId to listStore
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateUserAbility())
  @CheckRole(RoleName.USER)
  @Post('user/followStore/:id')
  async addStore(@Param('id') id: string, @Body() req: AddIdDto): Promise<User> {
    const user = await this.userService.followStore(id, req.id);
    return user
  }

  //Remove storeId from listStore
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateUserAbility())
  @CheckRole(RoleName.USER)
  @Post('user/unFollowStore/:id')
  async unFollowStore(@Param('id') id: string, @Body() req: AddIdDto): Promise<User> {
    const user = await this.userService.unFollowStore(id, req.id);
    return user
  }

  //Add warningCount for user by id
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateUserAbility())
  @CheckRole(RoleName.MANAGER)
  @Put('manager/warningcount/:id')
  async updateWarningCount(@Param('id') id: string, @Param("action") action: string): Promise<User> {
    const user = await this.userService.updateWarningCount(id, action);
    return user
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
  ): Promise<{ total: number, users: User[] }> {
    const data = await this.userService.getAll(page, limit, search)
    return data
  }


}
