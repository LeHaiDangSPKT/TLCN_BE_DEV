import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { StoreService } from './store.service';
import { Store } from './schema/store.schema';
import { Request } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AbilitiesGuard } from 'src/ability/guards/abilities.guard';
import { CheckAbilities, CreateBillAbility, CreateStoreAbility, DeleteStoreAbility, ReadStoreAbility, UpdateStoreAbility } from 'src/ability/decorators/abilities.decorator';
import { Types } from 'mongoose';
import { CreateStoreDto } from './dto/create-store.dto';
import { UserService } from 'src/user/user.service';
import { RoleService } from 'src/role/role.service';
import { RoleName } from 'src/role/schema/role.schema';
import { CheckRole } from 'src/ability/decorators/role.decorator';
import { GetCurrentUserId } from 'src/auth/decorators/get-current-userid.decorator';
import { UpdateStoreDto } from './dto/update-store.dto';

@Controller('store')
@ApiTags('Store')
@ApiBearerAuth('Authorization')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) { }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new CreateStoreAbility())
  @CheckRole(RoleName.USER)
  @Post('user')
  async create(
    @Body() store: CreateStoreDto,
    @GetCurrentUserId() userId: string,
  ): Promise<Store> {
    const user = await this.userService.getById(userId)
    const newStore = await this.storeService.create(user, store)
    await this.roleService.addUserToRole(userId, { name: RoleName.SELLER })
    return newStore
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadStoreAbility())
  @CheckRole(RoleName.USER)
  @Get('user/:id')
  async getById(
    @Param('id') id: string
  ): Promise<Store> {
    const store = await this.storeService.getById(id)
    return store
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadStoreAbility())
  @CheckRole(RoleName.SELLER)
  @Get('seller')
  async getMyStore(
    @GetCurrentUserId() userId: string,
  ): Promise<Store> {
    const store = await this.storeService.getByUserId(userId)
    return store
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateStoreAbility())
  @CheckRole(RoleName.SELLER)
  @Put('seller')
  async update(
    @Body() store: UpdateStoreDto,
    @GetCurrentUserId() userId: string,
  ): Promise<Store> {
    const newStore = await this.storeService.update(userId, store)
    return newStore
  }


  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new DeleteStoreAbility())
  @CheckRole(RoleName.SELLER)
  @Delete('seller')
  async delete(
    @GetCurrentUserId() userId: string,
  ): Promise<boolean> {
    await this.storeService.delete(userId)
    const isDeleted = await this.roleService.removeUserRole(userId, RoleName.SELLER)
    return isDeleted
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateStoreAbility())
  @CheckRole(RoleName.MANAGER)
  @Put('manager/warningcount/:id')
  async updateWarningCount(@Param('id') id: string, @Param("action") action: string): Promise<Store> {
    const store = await this.storeService.updateWarningCount(id, action);
    return store
  }

}



