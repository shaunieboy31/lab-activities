import { Controller, Post, Body, Request, UseGuards, Get, UnauthorizedException } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './jwt-auth.guard'
import { SignupDto, LoginDto, AuthResponseDto, UserResponseDto } from '../dtos/auth.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Create a new user account' })
  @ApiResponse({ status: 201, description: 'User created', type: UserResponseDto })
  signup(@Body() body: SignupDto) {
    return this.authService.signup(body.username, body.password)
  }

  @Post('login')
  @ApiOperation({ summary: 'Login and get JWT token' })
  @ApiResponse({ status: 200, description: 'Login successful', type: AuthResponseDto })
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.username, body.password)
    if (!user) throw new UnauthorizedException('Invalid credentials')
    return this.authService.login(user)
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get current user info (requires auth)' })
  @ApiResponse({ status: 200, description: 'Current user', type: UserResponseDto })
  me(@Request() req: any) {
    return req.user
  }
}
