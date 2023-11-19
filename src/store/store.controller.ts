import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { StoreService } from './store.service';
import { Store } from './schema/store.schema';
import { Request } from 'express';
import { ApiBearerAuth, ApiConsumes, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
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
import { BadRequestException, ConflicException, NotFoundException } from 'src/core/error.response';
import { SuccessResponse } from 'src/core/success.response';
import { Public } from 'src/auth/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

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
  ): Promise<SuccessResponse | NotFoundException | ConflicException | BadRequestException> {
    const user = await this.userService.getById(userId)
    if (!user) return new NotFoundException("Không tìm thấy người dùng này!")

    const hasStore = await this.storeService.getByUserId(userId)
    if (hasStore) return new ConflicException("Người dùng này đã có cửa hàng!")

    const newStore = await this.storeService.create(userId, store)
    if (!newStore) return new BadRequestException("Tạo cửa hàng thất bại!")

    const resultAddRole = await this.roleService.addUserToRole(userId, { name: RoleName.SELLER })
    if (!resultAddRole) return new BadRequestException("Thêm quyền thất bại!")

    return new SuccessResponse({
      message: "Tạo cửa hàng thành công!",
      metadata: { data: newStore },
    })
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadStoreAbility())
  @CheckRole(RoleName.USER)
  @Get('user/:id')
  async getById(
    @Param('id') id: string
  ): Promise<SuccessResponse | NotFoundException> {
    const store = await this.storeService.getById(id)
    if (!store) return new NotFoundException("Không tìm thấy cửa hàng này!")
    return new SuccessResponse({
      message: "Lấy thông tin cửa hàng thành công!",
      metadata: { data: store },
    })
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadStoreAbility())
  @CheckRole(RoleName.SELLER)
  @Get('seller')
  async getMyStore(
    @GetCurrentUserId() userId: string,
  ): Promise<SuccessResponse | NotFoundException> {
    const store = await this.storeService.getByUserId(userId)
    if (!store) return new NotFoundException("Không tìm thấy cửa hàng này!")
    return new SuccessResponse({
      message: "Lấy thông tin cửa hàng thành công!",
      metadata: { data: store },
    })
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateStoreAbility())
  @CheckRole(RoleName.SELLER)
  @Put('seller')
  async update(
    @Body() store: UpdateStoreDto,
    @GetCurrentUserId() userId: string,
  ): Promise<SuccessResponse | NotFoundException> {
    const newStore = await this.storeService.update(userId, store)
    if (!newStore) return new NotFoundException("Không tìm thấy cửa hàng này!")
    return new SuccessResponse({
      message: "Cập nhật thông tin cửa hàng thành công!",
      metadata: { data: newStore },
    })
  }


  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new DeleteStoreAbility())
  @CheckRole(RoleName.SELLER)
  @Delete('seller')
  async delete(
    @GetCurrentUserId() userId: string,
  ): Promise<SuccessResponse | NotFoundException | BadRequestException> {
    const result = await this.storeService.delete(userId)
    if (!result) return new NotFoundException("Không tìm thấy cửa hàng này!")
    const isDeleted = await this.roleService.removeUserRole(userId, RoleName.SELLER)
    if (!isDeleted) return new BadRequestException("Xóa quyền thất bại!")
    return new SuccessResponse({
      message: "Xóa cửa hàng thành công!",
      metadata: { data: result },
    })
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateStoreAbility())
  @CheckRole(RoleName.MANAGER)
  @Put('manager/warningcount/:id')
  async updateWarningCount(@Param('id') id: string, @Param("action") action: string): Promise<SuccessResponse | NotFoundException> {
    const store = await this.storeService.updateWarningCount(id, action);
    if (!store) throw new NotFoundException("Không tìm thấy cửa hàng này!")
    return new SuccessResponse({
      message: "Cập nhật cảnh báo thành công!",
      metadata: { data: store },
    })
  }

}



