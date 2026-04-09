import { Controller, Get, Inject, UseGuards } from '@nestjs/common';

import type { ProgressOverviewResponse } from '@playsharp/shared';

import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/auth.types';
import { ProgressService } from './progress.service';

@Controller('stats')
export class ProgressController {
  constructor(@Inject(ProgressService) private readonly progressService: ProgressService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  async getMyStats(@CurrentUser() user: AuthenticatedUser): Promise<ProgressOverviewResponse> {
    const overview = await this.progressService.getOverview(user.id);
    return { data: { overview } };
  }
}
