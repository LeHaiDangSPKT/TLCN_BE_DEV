import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Put } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { Promotion } from './schema/promotion.schema';
import { AbilitiesGuard } from 'src/ability/guards/abilities.guard';
import { CheckAbilities, CreatePromotionAbility, DeletePromotionAbility, ReadPromotionAbility, UpdatePromotionAbility } from 'src/ability/decorators/abilities.decorator';
import { CheckRole } from 'src/ability/decorators/role.decorator';
import { RoleName } from 'src/role/schema/role.schema';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

@Controller('promotion')
@ApiTags('Promotion')
@ApiBearerAuth('Authorization')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) { }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new CreatePromotionAbility())
  @CheckRole(RoleName.MANAGER)
  @Post("manager")
  create(@Body() createPromotionDto: CreatePromotionDto): Promise<Promotion> {
    return this.promotionService.create(createPromotionDto);
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadPromotionAbility())
  @CheckRole(RoleName.MANAGER)
  @Get('manager')
  @ApiQuery({ name: 'productType', type: String, required: false })
  findAllByProductType(@Query('productType') productType: string): Promise<Promotion[]> {
    return this.promotionService.findAllByProductType(productType);
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdatePromotionAbility())
  @CheckRole(RoleName.MANAGER)
  @Put('manager/:id')
  update(@Param('id') id: string, @Body() updatePromotionDto: CreatePromotionDto): Promise<Promotion> {
    return this.promotionService.update(id, updatePromotionDto);
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new DeletePromotionAbility())
  @CheckRole(RoleName.MANAGER)
  @Delete('manager/:id')
  remove(@Param('id') id: string): Promise<Promotion> {
    return this.promotionService.remove(id);
  }
}
