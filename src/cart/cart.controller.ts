import { Body, Controller, Delete, Get, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiBearerAuth, ApiTags, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AbilitiesGuard } from 'src/ability/guards/abilities.guard';
import { CheckAbilities, CreateCartAbility, ReadCartAbility, UpdateCartAbility } from 'src/ability/decorators/abilities.decorator';
import { Request } from 'express';
import { ProductService } from 'src/product/product.service';
import { CheckRole } from 'src/ability/decorators/role.decorator';
import { RoleName } from 'src/role/schema/role.schema';
import { GetCurrentUserId } from 'src/auth/decorators/get-current-userid.decorator';
import { SuccessResponse } from 'src/core/success.response';
import { BadRequestException, ConflicException, InternalServerErrorException, NotFoundException } from 'src/core/error.response';
import { StoreService } from 'src/store/store.service';

@Controller('cart/user')
@ApiTags('Cart')
@ApiBearerAuth('Authorization')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly productService: ProductService,
    private readonly storeService: StoreService,
  ) { }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new CreateCartAbility())
  @CheckRole(RoleName.USER)
  @Post()
  @ApiQuery({ name: 'productId', type: String, required: true })
  async processCart(
    @Query('productId') productId: string,
    @GetCurrentUserId() userId: string,
  ): Promise<SuccessResponse | ConflicException> {

    const product = await this.productService.getById(productId)
    if (!product) return new NotFoundException("Không tìm thấy sản phẩm này!")

    const store = await this.storeService.getById(product.storeId)
    if (!store) return new NotFoundException("Không tìm thấy cửa hàng này!")

    const result = await this.cartService.addProductIntoCart(userId, store, product)
    if (!result) return new InternalServerErrorException("Không thêm sản phẩm vào giỏ hàng được!")

    return new SuccessResponse({
      message: "Thêm sản phẩm vào giỏ hàng thành công!",
      metadata: { data: result },
    })
  }


  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadCartAbility())
  @CheckRole(RoleName.USER)
  @Get()
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  async getByUserId(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @GetCurrentUserId() userId: string,
  ): Promise<SuccessResponse> {
    const data = await this.cartService.getByUserId(userId, page, limit, search)
    return new SuccessResponse({
      message: "Lấy danh sách giỏ hàng thành công!",
      metadata: { data },
    })
  }


  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadCartAbility())
  @CheckRole(RoleName.USER)
  @Get('/get-all')
  async getAllByUserId(
    @GetCurrentUserId() userId: string,
  ): Promise<SuccessResponse> {
    const data = await this.cartService.getAllByUserId(userId)
    return new SuccessResponse({
      message: "Lấy danh sách giỏ hàng thành công!",
      metadata: { data },
    })
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateCartAbility())
  @CheckRole(RoleName.USER)
  @ApiQuery({ name: 'productId', type: String, required: true })
  @Delete()
  async removeProductInCart (
    @Query('productId') productId: string,
    @GetCurrentUserId() userId: string,
  ): Promise<SuccessResponse | NotFoundException> {

    const product = await this.productService.getById(productId)
    if (!product) return new NotFoundException("Không tìm thấy sản phẩm này!")

    const store = await this.storeService.getById(product.storeId)
    if (!store) return new NotFoundException("Không tìm thấy cửa hàng này!")

    await this.cartService.removeProductInCart(userId, productId, store._id)

    return new SuccessResponse({
      message: "Xóa sản phẩm khỏi giỏ hàng thành công!",
      metadata: { },
    })
  }

}
