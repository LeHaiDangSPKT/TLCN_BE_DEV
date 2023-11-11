import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CheckAbilities, CreateCategoryAbility, ReadCategoryAbility } from "src/ability/decorators/abilities.decorator";
import { CheckRole } from "src/ability/decorators/role.decorator";
import { AbilitiesGuard } from "src/ability/guards/abilities.guard";
import { RoleName } from "src/role/schema/role.schema";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { CategoryService } from "./category.service";
import { Category } from "./schema/category.schema";
import { Public } from "src/auth/decorators/public.decorator";

@Controller('category')
@ApiTags('Category')
@ApiBearerAuth('Authorization')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new CreateCategoryAbility())
  @CheckRole(RoleName.MANAGER)
  // @Public()
  @Post("manager")
  create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(createCategoryDto);
  }

  @Public()
  @Get('')
  @ApiQuery({ name: 'id', required: false })
  @ApiQuery({ name: 'status', required: false })
  findAllByCategoryName(@Query('id') id: string, @Query('status') status: string): Promise<Category[]> {
    return this.categoryService.findAllByCategoryName(id, status);
  }
}
