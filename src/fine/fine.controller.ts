import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { FineService } from './fine.service';
import { CreateFineDto } from './dto/create-fine.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AbilitiesGuard } from 'src/ability/guards/abilities.guard';
import { CheckAbilities, CreateFineAbility, CreatePromotionAbility, DeleteFineAbility, ReadFineAbility, UpdateFineAbility } from 'src/ability/decorators/abilities.decorator';
import { CheckRole } from 'src/ability/decorators/role.decorator';
import { RoleName } from 'src/role/schema/role.schema';
import { SuccessResponse } from 'src/core/success.response';
import { NotFoundException } from 'src/core/error.response';

@Controller('fine')
@ApiTags('Fine')
@ApiBearerAuth('Authorization')
export class FineController {
  constructor(private readonly fineService: FineService) { }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new CreateFineAbility())
  @CheckRole(RoleName.ADMIN)
  @Post("admin")
  async create(@Body() createFineDto: CreateFineDto): Promise<SuccessResponse> {
    const data = await this.fineService.create(createFineDto)
    return new SuccessResponse({
      message: "Tạo chính sách thành công!",
      metadata: { data },
    })
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadFineAbility())
  @CheckRole(RoleName.ADMIN)
  @Get("admin")
  async findAll(): Promise<SuccessResponse> {
    const data = await this.fineService.findAll();
    return new SuccessResponse({
      message: "Lấy danh sách chính sách thành công!",
      metadata: { data },
    })
  }


  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateFineAbility())
  @CheckRole(RoleName.ADMIN)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateFineDto: CreateFineDto): Promise<SuccessResponse | NotFoundException> {
    const result = await this.fineService.update(id, updateFineDto)
    if(!result) return new NotFoundException("Không tìm thấy chính sách này!")
    return new SuccessResponse({
      message: "Cập nhật chính sách thành công!",
      metadata: { data: result },
    })
  }


  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new DeleteFineAbility())
  @CheckRole(RoleName.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<SuccessResponse | NotFoundException> {
    const result = await this.fineService.remove(id)
    if(!result) return new NotFoundException("Không tìm thấy chính sách này!")
    return new SuccessResponse({
      message: "Xóa chính sách thành công!",
      metadata: { data: result },
    })
  }
}
