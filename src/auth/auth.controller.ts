import { Controller, Get, Post, Body, HttpCode, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Public } from 'src/common/public.decorator';
import { jwtAuth } from './jwt-auth.grard'


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  //注册
  @Public()
  @HttpCode(200)
  @Post("/signup")
  signup(@Body() signupData: CreateAuthDto) {
    return this.authService.signup(signupData)
  }

  //登录
  @Public()
  @HttpCode(200)
  @Post("/login")
  login(@Body() loginData: CreateAuthDto) {
    return this.authService.login(loginData)
  }

  //  解析token获取user信息(使用Jwt策略)
  @UseGuards(jwtAuth)
  @Get('profile')
  getProfile(@Request() req) {
    return this.authService.getUserInfo(req.user)
  }

    //计算：已使用空间
    @Get('space')
    geSpacerofile(@Request() req) {
      return this.authService.aspace(req)
    }
}
