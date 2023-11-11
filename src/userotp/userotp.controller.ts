import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { UserotpService } from './userotp.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserotpDto } from './dto/create-userotp.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { CheckUserotpDto } from './dto/check-userotp.dto';
import { UserService } from 'src/user/user.service';

@Controller('userotp')
@ApiTags('Userotp')
@ApiBearerAuth('Authorization')
export class UserotpController {
  constructor(
    private readonly userotpService: UserotpService,
    private readonly userService: UserService
  ) { }

  @Public()
  @Post('user/sendotp')
  async sendOtp(@Body() req: CreateUserotpDto): Promise<any> {
    const user = await this.userService.getByEmail(req.email);
    if (user) {
      return { data: null, message: 'Email đã tồn tại', status: 400 }
    }
    const otp = await this.userotpService.sendotp(req.email);

    const userotp = await this.userotpService.findUserotpByEmail(req.email);
    if (userotp?.email) {
      await this.userotpService.update(req.email, otp);
    } else {
      await this.userotpService.create(req.email, otp);
    }
  }

  @Public()
  @Post('user/checkotp')
  async checkOtp(@Body() req: CheckUserotpDto): Promise<void> {
    const otp = await this.userotpService.checkotp(req.otp, req.email);
    if (otp.message) {
      return otp;
    } else {
      return await this.userotpService.deleteotp(req.email);
    }
  }

  @Public()
  @Post('user/sendotp-forget')
  async sendOtpForget(@Body() req: CreateUserotpDto): Promise<any> {
    const user = await this.userService.getByEmail(req.email);
    if (user) {
      const otp = await this.userotpService.sendotp(req.email);

      const userotp = await this.userotpService.findUserotpByEmail(req.email);
      if (userotp?.email) {
        await this.userotpService.update(req.email, otp);
      } else {
        await this.userotpService.create(req.email, otp);
      }
    } else {
      return { data: null, message: 'Email không tồn tại', status: 400 }
    }
  }
}
