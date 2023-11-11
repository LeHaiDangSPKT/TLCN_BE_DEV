import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { UserotpService } from './userotp.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserotpDto } from './dto/create-userotp.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { CheckUserotpDto } from './dto/check-userotp.dto';
import { UserService } from 'src/user/user.service';
import { ConflicException, NotFoundException } from 'src/core/error.response';
import { SuccessResponse } from 'src/core/success.response';

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
  async sendOtp(@Body() req: CreateUserotpDto): Promise<SuccessResponse | NotFoundException | ConflicException> {
    const user = await this.userService.getByEmail(req.email)
    if (user) {
      return new ConflicException("Email đã tồn tại!")
    }
    const otp = await this.userotpService.sendotp(req.email);
    const userotp = await this.userotpService.findUserotpByEmail(req.email);
    if (userotp?.email) {
      const data = await this.userotpService.update(req.email, otp);
      if(!data) return new NotFoundException("Không tìm thấy người dùng này!")
      return new SuccessResponse({
        message: "Gửi mã OTP thành công!",
        metadata: { data },
      })
    } else {
      const data = await this.userotpService.create(req.email, otp);
      return new SuccessResponse({
        message: "Gửi mã OTP thành công!",
        metadata: { data },
      })
    }
  }

  @Public()
  @Post('user/checkotp')
  async checkOtp(@Body() req: CheckUserotpDto): Promise<SuccessResponse | NotFoundException> {
    const result = await this.userotpService.checkotp(req.otp, req.email);
    if (result) {
      return new SuccessResponse({
        message: "Xác thực thành công!",
        metadata: { data: result },
      })
    }
    return new NotFoundException("Mã OTP không đúng!")
  }

  @Public()
  @Post('user/sendotp-forget')
  async sendOtpForget(@Body() req: CreateUserotpDto): Promise<SuccessResponse | NotFoundException> {
    const user = await this.userService.getByEmail(req.email);
    if (user) {
      const otp = await this.userotpService.sendotp(req.email);
      const userotp = await this.userotpService.findUserotpByEmail(req.email);
      if (userotp) {
        const result = await this.userotpService.update(req.email, otp)
        return new SuccessResponse({
          message: "Gửi mã OTP thành công!",
          metadata: { data: result },
        })
      } else {
        const result = await this.userotpService.create(req.email, otp)
        return new SuccessResponse({
          message: "Gửi mã OTP thành công!",
          metadata: { data: result },
        })
      }
    } else {
      return new NotFoundException("Không tìm thấy người dùng này!")
    }
  }
}
