import { Controller, Get, Inject } from '@nestjs/common';

import type { ProfileOverviewResponse } from '@playsharp/shared';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(@Inject(UsersService) private readonly usersService: UsersService) {}

  @Get('me/profile')
  async getMyProfile(): Promise<ProfileOverviewResponse> {
    const profile = await this.usersService.getProfileOverview();
    return { data: { profile } };
  }
}
