import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { User } from 'src/user/schema/user.schema';
import { LoginDto } from './dto/login.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleService } from 'src/role/role.service';
import { RoleName } from 'src/role/schema/role.schema';
import { AbilitiesGuard } from 'src/ability/guards/abilities.guard';
import { CheckAbilities, CreateUserAbility, ManageUserTokenAbility, ReadRoleAbility } from 'src/ability/decorators/abilities.decorator';
import { Request } from 'express';
import { JwtRTAuthGuard } from './guards/jwt-rt-auth.guard';
import { Public } from './decorators/public.decorator';
import { UsertokenService } from 'src/usertoken/usertoken.service';
import { UserService } from 'src/user/user.service';
import { UserWithoutPassDto } from '../user/dto/user-without-pass.dto';
import { CheckRole } from 'src/ability/decorators/role.decorator';
import { UserDto } from './dto/user.dto';
import { TokensDto } from './dto/tokens.dto';
import FreedomCustom from 'src/exceptions/FreedomCustom.exception';
import { BadRequestExceptionCustom } from 'src/exceptions/BadRequestExceptionCustom.exception';

@Controller('auth')
@ApiTags('Auth')
@ApiBearerAuth('Authorization')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly roleService: RoleService,
    private readonly userService: UserService,
    private readonly userTokenService: UsertokenService,
  ) { }

  @Public()
  @Post('signup')
  async signUp(
    @Body()
    signUpDto: SignUpDto,
  ): Promise<UserWithoutPassDto> {
    const hashedPassword = await this.authService.hashData(signUpDto.password)
    signUpDto.password = hashedPassword
    const newUser = await this.userService.create(signUpDto)
    const payload = { userId: newUser._id }
    const tokens = await this.authService.getTokens(payload)
    await this.userTokenService.createUserToken(newUser._id, tokens.refreshToken)
    await this.roleService.addUserToRole(newUser._id, { name: RoleName.USER })
    return newUser
  }

  @Public()
  @Post('login')
  async login(
    @Body()
    loginDto: LoginDto,
  ): Promise<UserDto> {
    const user = await this.userService.getByEmail(loginDto.email)
    if (!user) throw new BadRequestExceptionCustom("Email hoặc mật khẩu không chính xác!")
    const { password, ...userWithoutPass } = user['_doc']
    const isMatch = await this.authService.compareData(loginDto.password, password)
    if (!isMatch) throw new BadRequestExceptionCustom("Email hoặc mật khẩu không chính xác!")
    const payload = { userId: user._id }
    const tokens = await this.authService.getTokens(payload)
    const userToken = await this.userTokenService.getUserTokenById(user._id)
    userToken ? await this.userTokenService.updateUserToken(user._id, tokens.refreshToken)
      : await this.userTokenService.createUserToken(user._id, tokens.refreshToken)
    return {providerData: [userWithoutPass], stsTokenManager: tokens}
  }

  @Public()
  @Post('forgetPassword')
  async forgetPassword(
    @Body()
    loginDto: LoginDto,
  ): Promise<string> {
    const { email, password } = loginDto
    const hashedPassword = await this.authService.hashData(password)
    const user = await this.userService.updatePassword(email, hashedPassword);
    return user.email
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new ManageUserTokenAbility())
  @Delete('logout')
  async logout(
    @Req() req: Request
  ): Promise<boolean> {
    const userId = req.user['userId']
    return await this.userTokenService.deleteUserToken(userId)
  }

  @Public()
  @UseGuards(JwtRTAuthGuard, AbilitiesGuard)
  @CheckAbilities(new ManageUserTokenAbility())
  @Post('refresh')
  async refreshToken(
    @Req() req: Request
  ): Promise<TokensDto> {
    const userId = req.user['userId']
    const refreshToken = req.user['refreshToken']
    const userToken = await this.userTokenService.getUserTokenById(userId)
    await this.authService.compareData(refreshToken, userToken.hashedRefreshToken)
    const payload = { userId: userToken.userId }
    const tokens = await this.authService.getTokens(payload)
    await this.userTokenService.updateUserToken(userToken.userId, tokens.refreshToken)
    return tokens
  }

  @UseGuards(AbilitiesGuard)
  @CheckAbilities(new CreateUserAbility())
  @CheckRole(RoleName.ADMIN)
  @Post('createUser')
  async createUser(
    @Body()
    signUpDto: SignUpDto,
  ): Promise<UserWithoutPassDto> {
    const hashedPassword = await this.authService.hashData(signUpDto.password)
    signUpDto.password = hashedPassword
    const newUser = await this.userService.create(signUpDto)
    const payload = { userId: newUser._id }
    const tokens = await this.authService.getTokens(payload)
    await this.userTokenService.createUserToken(newUser._id, tokens.refreshToken)
    return newUser
  }
}
