import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { BillService } from './bill.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { Bill } from './schema/bill.schema';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AbilitiesGuard } from 'src/ability/guards/abilities.guard';
import { CheckAbilities, CreateBillAbility, CreateRoleAbility, ReadBillAbility, UpdateBillAbility } from 'src/ability/decorators/abilities.decorator';
import { Request } from 'express';
import { PaymentService } from './payment/payment.service';
import { GiveGateway, MoMoGateway, PAYMENT_METHOD, VNPayGateway } from './payment/payment.gateway';
import { UserService } from 'src/user/user.service';
import { ProductService } from 'src/product/product.service';
import { GetCurrentUserId } from 'src/auth/decorators/get-current-userid.decorator';
import { CheckRole } from 'src/ability/decorators/role.decorator';
import { RoleName } from 'src/role/schema/role.schema';
import { StoreService } from 'src/store/store.service';

@Controller('bill')
@ApiTags('Bill')
@ApiBearerAuth('Authorization')
export class BillController {
  constructor(
    private readonly billService: BillService,
    private readonly paymentService: PaymentService,
    private readonly userService: UserService,
    private readonly productService: ProductService,
    private readonly storeService: StoreService,
  ) {
    this.paymentService.registerPaymentGateway(PAYMENT_METHOD.VNPAY, new VNPayGateway())
    this.paymentService.registerPaymentGateway(PAYMENT_METHOD.MOMO, new MoMoGateway())
    this.paymentService.registerPaymentGateway(PAYMENT_METHOD.GIVE, new GiveGateway())
  }


  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new CreateBillAbility())
  @CheckRole(RoleName.USER)
  @Post('user')
  async create(
    @Body() bill: CreateBillDto,
    @GetCurrentUserId() userId: string,
  ): Promise<Bill> {
    const user = await this.userService.getById(userId)
    const products = []
    bill.listProductId.map(async (productId) => {
      const product = await this.productService.getById(productId)
      products.push(product)
    })
    const newBill = await this.billService.create(user, products, bill)
    await this.userService.updateWallet(userId, newBill.totalPrice, "plus")
    const result = await this.paymentService.processPayment(bill, bill.paymentMethod)
    console.log(result)
    return newBill
  }


  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadBillAbility())
  @CheckRole(RoleName.USER)
  @Get('user')
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  @ApiQuery({ name: 'status', type: String, required: true })
  async getAllByStatusUser(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('status') status: string,
    @GetCurrentUserId() userId: string,
  ): Promise<{ total: number, bills: Bill[] }> {
    const data = await this.billService.getAllByStatus({ userId: userId }, page, limit, search, status)
    return data
  }


  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadBillAbility())
  @CheckRole(RoleName.SELLER)
  @Get('seller')
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  @ApiQuery({ name: 'status', type: String, required: true })
  async getAllByStatusSeller(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('search') search: string,
    @Query('status') status: string,
    @GetCurrentUserId() userId: string,
  ): Promise<{ total: number, bills: Bill[] }> {
    const store = await this.storeService.getByUserId(userId)
    const data = await this.billService.getAllByStatus({ storeId: store._id }, page, limit, search, status)
    return data
  }


  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadBillAbility())
  @CheckRole(RoleName.USER)
  @Get('user/:id')
  async getDetailById(
    @Param('id') id: string
  ): Promise<Bill> {
    const bill = await this.billService.getDetailById(id)
    return bill
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateBillAbility())
  @CheckRole(RoleName.USER)
  @Put('user/:id')
  async cancelBill(
    @Param('id') id: string,
    @GetCurrentUserId() userId: string,
  ): Promise<boolean> {
    const bill = await this.billService.getDetailById(id)
    const result = await this.billService.update(id, "Đã hủy")
    await this.userService.updateWallet(userId, bill.totalPrice, "sub")
    return result
  }


  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateBillAbility())
  @CheckRole(RoleName.SELLER)
  @Put('seller/:id')
  @ApiQuery({ name: 'status', type: String, required: true })
  async updateStatus(
    @Param('id') id: string,
    @Query('status') status: string,
    @GetCurrentUserId() userId: string,
  ): Promise<boolean> {
    const bill = await this.billService.getDetailById(id)
    const result = await this.billService.update(id, status)
    if (status === "Đã hủy")
      await this.userService.updateWallet(userId, bill.totalPrice, "sub")
    if (status === "Đã hoàn đơn") {
      await this.userService.updateWallet(userId, bill.totalPrice, "sub")
      await this.userService.updateWallet(userId, bill.totalPrice * 5, "plus")
    }
    return result
  }


  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadBillAbility())
  @CheckRole(RoleName.SELLER)
  @Get('seller/statistic')
  @ApiQuery({ name: 'startTime', type: String, required: true })
  @ApiQuery({ name: 'endTime', type: String, required: false })
  @ApiQuery({ name: 'type', type: String, required: true })
  async getStatistic(
    @Query('startTime') startTime: string,
    @Query('endTime') endTime: string,
    @Query('type') type: string,
    @GetCurrentUserId() userId: string,
  ): Promise<Bill[]> {
    const store = await this.storeService.getByUserId(userId)
    const data = await this.billService.getStatistic(store._id, startTime, endTime, type)
    return data
  }
}
