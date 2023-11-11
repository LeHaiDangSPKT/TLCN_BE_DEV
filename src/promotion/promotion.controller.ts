import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Put } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { Promotion } from './schema/promotion.schema';
import { AbilitiesGuard } from 'src/ability/guards/abilities.guard';
import { CheckAbilities, CreatePromotionAbility, DeletePromotionAbility, ReadPromotionAbility, UpdatePromotionAbility } from 'src/ability/decorators/abilities.decorator';
import { CheckRole } from 'src/ability/decorators/role.decorator';
import { RoleName } from 'src/role/schema/role.schema';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SuccessResponse } from 'src/core/success.response';
import { NotFoundException } from 'src/core/error.response';

@Controller('promotion')
@ApiTags('Promotion')
@ApiBearerAuth('Authorization')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) { }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new CreatePromotionAbility())
  @CheckRole(RoleName.MANAGER)
  @Post("manager")
  async create(@Body() createPromotionDto: CreatePromotionDto): Promise<SuccessResponse> {
    const data = await this.promotionService.create(createPromotionDto);
    return new SuccessResponse({
      message: "Tạo chương trình khuyến mãi thành công!",
      metadata: { data },
    })
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadPromotionAbility())
  @CheckRole(RoleName.MANAGER)
  @Get('manager')
  @ApiQuery({ name: 'productType', type: String, required: false })
  async findAllByProductType(@Query('productType') productType: string): Promise<SuccessResponse> {
    const data = await this.promotionService.findAllByProductType(productType);
    return new SuccessResponse({
      message: "Lấy danh sách chương trình khuyến mãi thành công!",
      metadata: { data },
    })
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdatePromotionAbility())
  @CheckRole(RoleName.MANAGER)
  @Put('manager/:id')
  async update(@Param('id') id: string, @Body() updatePromotionDto: CreatePromotionDto): Promise<SuccessResponse | NotFoundException> {
    const data = await this.promotionService.update(id, updatePromotionDto)
    if (!data) return new NotFoundException("Không tìm thấy chương trình khuyến mãi này!")
    return new SuccessResponse({
      message: "Cập nhật chương trình khuyến mãi thành công!",
      metadata: { data },
    })
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new DeletePromotionAbility())
  @CheckRole(RoleName.MANAGER)
  @Delete('manager/:id')
  async remove(@Param('id') id: string): Promise<SuccessResponse | NotFoundException> {
    const data = await this.promotionService.remove(id);
    if (!data) return new NotFoundException("Không tìm thấy chương trình khuyến mãi này!")
    return new SuccessResponse({
      message: "Xóa chương trình khuyến mãi thành công!",
      metadata: { data },
    })
  }
}
