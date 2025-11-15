import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto'; // ensure this path is correct

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto); // returns { user, token }
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto); // returns { user, token }
  }
}