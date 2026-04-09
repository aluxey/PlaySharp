import { Body, Controller, Inject, Post } from '@nestjs/common';

import type { AuthSessionResponse } from '@playsharp/shared';

import { LoginRequestDto, RegisterRequestDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterRequestDto): Promise<AuthSessionResponse> {
    const session = await this.authService.register(body);
    return { data: { session } };
  }

  @Post('login')
  async login(@Body() body: LoginRequestDto): Promise<AuthSessionResponse> {
    const session = await this.authService.login(body);
    return { data: { session } };
  }
}
