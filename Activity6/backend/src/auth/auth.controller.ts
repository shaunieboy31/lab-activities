import { Controller, Post, Body, Request, UseGuards, Get, UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './jwt-auth.guard'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: { username: string; password: string }) {
    return this.authService.signup(body.username, body.password)
  }

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(body.username, body.password)
    if (!user) throw new UnauthorizedException('Invalid credentials')
    return this.authService.login(user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Request() req: any) {
    return req.user
  }
}
