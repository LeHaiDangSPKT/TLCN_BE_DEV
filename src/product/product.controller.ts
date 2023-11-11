import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AbilitiesGuard } from 'src/ability/guards/abilities.guard';
import { CheckAbilities, CreateProductAbility, DeleteProductAbility, ReadProductAbility, UpdateProductAbility } from 'src/ability/decorators/abilities.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './schema/product.schema';
import { StoreService } from 'src/store/store.service';
import { EvaluationService } from 'src/evaluation/evaluation.service';
import { CheckRole } from 'src/ability/decorators/role.decorator';
import { RoleName } from 'src/role/schema/role.schema';
import { GetCurrentUserId } from 'src/auth/decorators/get-current-userid.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { UpdateProductDto } from './dto/update-product.dto';


@Controller('product')
@ApiTags('Product')
@ApiBearerAuth('Authorization')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly storeService: StoreService,
    private readonly evaluationService: EvaluationService,
  ) { }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new CreateProductAbility())
  @CheckRole(RoleName.SELLER)
  @Post('seller')
  async create(
    @Body() product: CreateProductDto,
    @GetCurrentUserId() userId: string,
  ): Promise<Product> {
    const store = await this.storeService.getByUserId(userId)
    const newProduct = await this.productService.create(store, product)
    await this.evaluationService.create(newProduct._id)
    return newProduct
  }
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new CreateProductAbility())
  @CheckRole(RoleName.SELLER)
  @Post('sellerCreateMultiple')
  async sellerCreateMultiple(
    @Body() products: CreateProductDto[],
    @GetCurrentUserId() userId: string,
  ): Promise<void> {
    const store = await this.storeService.getByUserId(userId)
    products.forEach(async product => {
      const newProduct = await this.productService.create(store, product)
      await this.evaluationService.create(newProduct._id)
    })
  }
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadProductAbility())
  @CheckRole(RoleName.SELLER)
  @Get('seller')
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  async getAllBySearch(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @GetCurrentUserId() userId: string,
  ) {
    const store = await this.storeService.getByUserId(userId)
    const products = await this.productService.getAllBySearch(store._id, page, limit, search)
    return products
  }


  @Public()
  @Get()
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  async getAllBySearchPublic(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
  ) {
    const products = await this.productService.getAllBySearch(null, page, limit, search)
    return products
  }


  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateProductAbility())
  @CheckRole(RoleName.SELLER)
  @Put('seller/:id')
  async update(
    @Param('id') id: string,
    @Body() product: UpdateProductDto,
  ): Promise<Product> {
    const newProduct = await this.productService.update(id, product)
    return newProduct
  }


  @Public()
  @Get('/listProductLasted')
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async getlistProductLasted(
    @Query('limit') limit: number,
  ): Promise<Product[]> {
    const products = await this.productService.getlistProductLasted(limit)
    return products
  }

  @Public()
  @Get('/mostProductsInStore')
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async mostProductsInStore(
    @Query('limit') limit: number,
  ): Promise<Product[]> {
    const products = await this.productService.mostProductsInStore(limit)
    return products
  }

  @Public()
  @Get('/:id')
  async getById(
    @Param('id') id: string
  ): Promise<Product> {
    const product = await this.productService.getById(id)
    return product
  }


  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new DeleteProductAbility())
  @CheckRole(RoleName.MANAGER)
  @Put('manager/deleteProduct/:id')
  async deleteProduct(@Param('id') id: string): Promise<Product> {
    const store = await this.productService.deleteProduct(id);
    return store
  }
}
