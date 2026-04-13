import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';

import type { AuthCurrentUserResponse, AuthSessionResponse } from '@playsharp/shared';

import { CurrentUser } from './current-user.decorator';
import { AuthGuard } from './auth.guard';
import { LoginRequestDto, RegisterRequestDto } from './auth.dto';
import { AuthService } from './auth.service';
import type { AuthenticatedUser } from './auth.types';

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

  @Get('me')
  @UseGuards(AuthGuard)
  async getCurrentUser(@CurrentUser() user: AuthenticatedUser): Promise<AuthCurrentUserResponse> {
    return {
      data: {
        user,
      },
    };
  }
}
