import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { BillService } from './bill.service';
import { CreateBillDto } from './dto/create-bill.dto';
import { BILL_STATUS, Bill } from './schema/bill.schema';
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
import { NotFoundException } from 'src/core/error.response';
import { SuccessResponse } from 'src/core/success.response';

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
    @Body() createBillDto: CreateBillDto,
    @GetCurrentUserId() userId: string,
  ): Promise<SuccessResponse | NotFoundException> {

    const user = await this.userService.getById(userId)
    if (!user) return new NotFoundException("Không tìm thấy người dùng này!")

    const newBills = await Promise.all(createBillDto.data.map(async (billDto) => {
      await this.userService.updateWallet(userId, billDto.totalPrice, "plus")
      return this.billService.create(userId, billDto, createBillDto.deliveryMethod, createBillDto.paymentMethod,
        createBillDto.receiverInfo, createBillDto.giveInfo, createBillDto.deliveryFee)
    }))

    return new SuccessResponse({
      message: "Đặt hàng thành công!",
      metadata: { data: newBills },
    })
  }


  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadBillAbility())
  @CheckRole(RoleName.SELLER)
  @ApiQuery({ name: 'year', type: Date, required: false, example: "2023-09-25T08:56:53.481+00:00" })
  @Get('seller/count-total-by-status')
  async countTotalByStatus(
    @Query('year') year: Date,
    @GetCurrentUserId() userId: string,
  ): Promise<SuccessResponse | NotFoundException> {

    const user = await this.userService.getById(userId)
    if (!user) return new NotFoundException("Không tìm thấy người dùng này!")

    const store = await this.storeService.getByUserId(userId)
    if (!store) return new NotFoundException("Không tìm thấy cửa hàng này!")

    const statusData: string[] = BILL_STATUS.split("-").map((item: string) => item.toUpperCase())

    const countTotal = await Promise.all(statusData.map(async (status: string) => {
      return this.billService.countTotalByStatus(store._id, status, year)
    }))

    const transformedData = Object.fromEntries(
      countTotal.map((value, index) => [statusData[index], value])
    )

    return new SuccessResponse({
      message: "Lấy tổng số lượng các đơn theo trạng thái thành công!",
      metadata: { data: transformedData },
    })
  }


  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadBillAbility())
  @CheckRole(RoleName.SELLER)
  @ApiQuery({ name: 'year', type: Number, required: true, example: "2023" })
  @Get('seller/calculate-revenue-by-month')
  async calculateRevenueByMonth(
    @Query('year') year: number,
    @GetCurrentUserId() userId: string,
  ): Promise<SuccessResponse | NotFoundException> {

    const user = await this.userService.getById(userId)
    if (!user) return new NotFoundException("Không tìm thấy người dùng này!")

    const store = await this.storeService.getByUserId(userId)
    if (!store) return new NotFoundException("Không tìm thấy cửa hàng này!")

    const data = await this.billService.calculateRevenueByYear(store._id, year)

    return new SuccessResponse({
      message: "Lấy doanh thu của từng tháng theo năm thành công!",
      metadata: { data },
    })
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
  ): Promise<SuccessResponse> {
    const data = await this.billService.getAllByStatus({ userId: userId }, page, limit, search, status)
    return new SuccessResponse({
      message: "Lấy danh sách đơn hàng thành công!",
      metadata: { data: data },
    })
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
  ): Promise<SuccessResponse | NotFoundException> {
    const store = await this.storeService.getByUserId(userId)
    if (!store) return new NotFoundException("Không tìm thấy cửa hàng này!")
    const data = await this.billService.getAllByStatus({ storeId: store._id }, page, limit, search, status)
    return new SuccessResponse({
      message: "Lấy danh sách đơn hàng thành công!",
      metadata: { data: data },
    })
  }


  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ReadBillAbility())
  @CheckRole(RoleName.USER)
  @Get('user/:id')
  async getDetailById(
    @Param('id') id: string
  ): Promise<SuccessResponse | NotFoundException> {
    const bill = await this.billService.getDetailById(id)
    if (!bill) return new NotFoundException("Không tìm thấy đơn hàng này!")
    return new SuccessResponse({
      message: "Lấy thông tin đơn hàng thành công!",
      metadata: { data: bill },
    })
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new UpdateBillAbility())
  @CheckRole(RoleName.USER)
  @Put('user/:id')
  async cancelBill(
    @Param('id') id: string,
    @GetCurrentUserId() userId: string,
  ): Promise<SuccessResponse | NotFoundException> {
    const bill = await this.billService.getDetailById(id)
    const result = await this.billService.update(id, "Đã hủy")
    if (!result) return new NotFoundException("Không tìm thấy đơn hàng này!")
    await this.userService.updateWallet(userId, bill.totalPrice, "sub")
    return new SuccessResponse({
      message: "Hủy đơn hàng thành công!",
      metadata: { data: result },
    })
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
  ): Promise<SuccessResponse | NotFoundException> {
    const bill = await this.billService.getDetailById(id)
    if (!bill) return new NotFoundException("Không tìm thấy đơn hàng này!")
    const result = await this.billService.update(id, status)
    if (!result) return new NotFoundException("Không tìm thấy đơn hàng này!")
    if (status === "Đã hủy")
      await this.userService.updateWallet(userId, bill.totalPrice, "sub")
    if (status === "Đã hoàn đơn") {
      await this.userService.updateWallet(userId, bill.totalPrice, "sub")
      await this.userService.updateWallet(userId, bill.totalPrice * 5, "plus")
    }
    return new SuccessResponse({
      message: "Cập nhật trạng thái đơn hàng thành công!",
      metadata: { data: result },
    })
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
  ): Promise<SuccessResponse | NotFoundException> {
    const store = await this.storeService.getByUserId(userId)
    if (!store) return new NotFoundException("Không tìm thấy cửa hàng này!")
    const data = await this.billService.getStatistic(store._id, startTime, endTime, type)
    return new SuccessResponse({
      message: "Lấy thống kê thành công!",
      metadata: { data: data },
    })
  }
}
