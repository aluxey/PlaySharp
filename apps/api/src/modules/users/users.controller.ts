import { Controller, Get, Inject, UseGuards } from '@nestjs/common';

import type { ProfileOverviewResponse } from '@playsharp/shared';

import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/auth.types';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(@Inject(UsersService) private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('me/profile')
  async getMyProfile(@CurrentUser() user: AuthenticatedUser): Promise<ProfileOverviewResponse> {
    const profile = await this.usersService.getProfileOverview(user.id);
    return { data: { profile } };
  }
}
