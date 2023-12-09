import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AbilitiesGuard } from 'src/ability/guards/abilities.guard';
import { CheckAbilities, CreateProductAbility, DeleteProductAbility, ReadProductAbility, UpdateProductAbility } from 'src/ability/decorators/abilities.decorator';
import { CreateProductDto } from './dto/create-product.dto';
import { StoreService } from 'src/store/store.service';
import { EvaluationService } from 'src/evaluation/evaluation.service';
import { CheckRole } from 'src/ability/decorators/role.decorator';
import { RoleName } from 'src/role/schema/role.schema';
import { GetCurrentUserId } from 'src/auth/decorators/get-current-userid.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { UpdateProductDto } from './dto/update-product.dto';
import { NotFoundException } from 'src/core/error.response';
import { SuccessResponse } from 'src/core/success.response';
import { UserService } from 'src/user/user.service';
import { NotificationService } from 'src/notification/notification.service';
import { Notification } from 'src/notification/schema/notification.schema';
import { ProductDto } from './dto/product.dto';
import { Product } from './schema/product.schema';
import { clearGlobalAppDefaultCred } from 'firebase-admin/lib/app/credential-factory';
import { BillService } from 'src/bill/bill.service';
import { PRODUCT_TYPE } from 'src/bill/schema/bill.schema';


@Controller('product')
@ApiTags('Product')
@ApiBearerAuth('Authorization')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly storeService: StoreService,
    private readonly evaluationService: EvaluationService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    private readonly billService: BillService,
  ) { }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new CreateProductAbility())
  @CheckRole(RoleName.SELLER)
  @Post('seller')
  async create(
    @Body() product: CreateProductDto,
    @GetCurrentUserId() userId: string,
  ): Promise<SuccessResponse | NotFoundException> {

    const store = await this.storeService.getByUserId(userId)
    if (!store) return new NotFoundException("Không tìm thấy cửa hàng này!")

    const newProduct = await this.productService.create(store, product)

    await this.evaluationService.create(newProduct._id)

    const userHasFollowStores = await this.userService.getFollowStoresByStoreId(store._id)

    const notificationPromises: Promise<Notification>[] = [];

    for (const user of userHasFollowStores) {
      if (userId === user._id) continue
  
      const notificationPromise = this.notificationService.create({
        userIdFrom: userId,
        userIdTo: user._id,
        content: `đã đăng sản phẩm mới. ${newProduct.productName}`,
        type: "Thêm sản phẩm",
        sub: {
          fullName: store.name,
          avatar: store.avatar,
          productId: newProduct._id.toString(),
        },
      })
  
      notificationPromises.push(notificationPromise)
    }
    await Promise.all(notificationPromises)

    return new SuccessResponse({
      message: "Tạo sản phẩm thành công!",
      metadata: { data: newProduct },
    })

  }

  // để tạo nhiều data một lúc (để test)
  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new CreateProductAbility())
  @CheckRole(RoleName.SELLER)
  @Post('sellerCreateMultiple')
  async sellerCreateMultiple(
    @Body() products: CreateProductDto[],
    @GetCurrentUserId() userId: string,
  ): Promise<void | NotFoundException> {
    const store = await this.storeService.getByUserId(userId)
    if (!store) return new NotFoundException("Không tìm thấy cửa hàng này!")
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
  @ApiQuery({ name: 'sortType', type: String, required: false })
  @ApiQuery({ name: 'sortValue', type: String, required: false })
  async getAllBySearch(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('sortType') sortType: string,
    @Query('sortValue') sortValue: string,
    @GetCurrentUserId() userId: string,
  ): Promise<SuccessResponse | NotFoundException> {

    const store = await this.storeService.getByUserId(userId)
    if (!store) return new NotFoundException("Không tìm thấy cửa hàng này!")

    const products = await this.productService.getAllBySearch(store._id, page, limit, search, sortType, sortValue)

    const fullInfoProducts: ProductDto[] = await Promise.all(products.products.map(async (product: Product) => {

      let quantitySold: number = await this.billService.countProductDelivered(product._id, PRODUCT_TYPE.SELL, 'DELIVERED');
      let quantityGive: number = await this.billService.countProductDelivered(product._id, PRODUCT_TYPE.GIVE, 'DELIVERED');
      let revenue: number = quantitySold * product.price;
      let isPurchased: boolean = await this.billService.checkProductPurchased(product._id);

      return {
        ...product.toObject(),
        storeName: store.name,
        quantitySold,
        quantityGive,
        revenue,
        isPurchased,
      }
    }));

    return new SuccessResponse({
      message: "Lấy danh sách sản phẩm thành công!",
      metadata: { data: {total: products.total, products: fullInfoProducts} },
    })

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
  ): Promise<SuccessResponse> {
    const products = await this.productService.getAllBySearch(null, page, limit, search)
    return new SuccessResponse({
      message: "Lấy danh sách sản phẩm thành công!",
      metadata: { data: products },
    })
  }


  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateProductAbility())
  @CheckRole(RoleName.SELLER)
  @Patch('seller/:id')
  async update(
    @Param('id') id: string,
    @Body() product: UpdateProductDto,
  ): Promise<SuccessResponse | NotFoundException> {
    const newProduct = await this.productService.update(id, product)
    if (!newProduct) return new NotFoundException("Không tìm thấy sản phẩm này!")
    return new SuccessResponse({
      message: "Cập nhật sản phẩm thành công!",
      metadata: { data: newProduct },
    })
  }


  @Public()
  @Get('/listProductLasted')
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async getlistProductLasted(
    @Query('limit') limit: number,
  ): Promise<SuccessResponse> {
    const products = await this.productService.getListProductLasted(limit)
    return new SuccessResponse({
      message: "Lấy danh sách sản phẩm thành công!",
      metadata: { data: products },
    })
  }

  @Public()
  @Get('/mostProductsInStore')
  @ApiQuery({ name: 'limit', type: Number, required: false })
  async mostProductsInStore(
    @Query('limit') limit: number,
  ): Promise<SuccessResponse> {

    const products = await this.productService.mostProductsInStore(limit)

    return new SuccessResponse({
      message: "Lấy danh sách sản phẩm thành công!",
      metadata: { data: products },
    })
  }

  @Public()
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @Get('/random')
  async getRandom(
    @Query('limit') limit: number,
  ): Promise<SuccessResponse | NotFoundException> {
    const products: Product[] = await this.productService.getRandomProducts(limit)
    if (!products) return new NotFoundException("Không tìm thấy sản phẩm!")
    return new SuccessResponse({
      message: "Lấy thông tin sản phẩm thành công!",
      metadata: { data: products },
    })
  }


  @Public()
  @Get('/:id')
  async getById(
    @Param('id') id: string
  ): Promise<SuccessResponse | NotFoundException> {
    const product = await this.productService.getById(id)
    if (!product) return new NotFoundException("Không tìm thấy sản phẩm này!")
    return new SuccessResponse({
      message: "Lấy thông tin sản phẩm thành công!",
      metadata: { data: product },
    })
  }


  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new DeleteProductAbility())
  @CheckRole(RoleName.MANAGER)
  @Delete('manager/deleteProduct/:id')
  async deleteProduct(@Param('id') id: string): Promise<SuccessResponse | NotFoundException> {
    const store = await this.productService.deleteProduct(id);
    if (!store) return new NotFoundException("Không tìm thấy sản phẩm này!")
    return new SuccessResponse({
      message: "Xóa sản phẩm thành công!",
      metadata: { data: store },
    })
  }

}
