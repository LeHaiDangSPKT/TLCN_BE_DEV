import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { FineService } from './fine.service';
import { CreateFineDto } from './dto/create-fine.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Fine } from './schema/fine.shema';
import { AbilitiesGuard } from 'src/ability/guards/abilities.guard';
import { CheckAbilities, CreateFineAbility, CreatePromotionAbility, DeleteFineAbility, ReadFineAbility, UpdateFineAbility } from 'src/ability/decorators/abilities.decorator';
import { CheckRole } from 'src/ability/decorators/role.decorator';
import { RoleName } from 'src/role/schema/role.schema';

@Controller('fine')
@ApiTags('Fine')
@ApiBearerAuth('Authorization')
export class FineController {
  constructor(private readonly fineService: FineService) { }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new CreateFineAbility())
  @CheckRole(RoleName.ADMIN)
  @Post("admin")
  create(@Body() createFineDto: CreateFineDto): Promise<Fine> {
    return this.fineService.create(createFineDto);
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadFineAbility())
  @CheckRole(RoleName.ADMIN)
  @Get("admin")
  findAll(): Promise<Fine[]> {
    return this.fineService.findAll();
  }
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateFineAbility())
  @CheckRole(RoleName.ADMIN)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateFineDto: CreateFineDto): Promise<Fine> {
    return this.fineService.update(id, updateFineDto);
  }
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new DeleteFineAbility())
  @CheckRole(RoleName.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<Fine> {
    return this.fineService.remove(id);
  }
}
