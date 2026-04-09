import { Controller, Get, Inject } from '@nestjs/common';

import type { ProgressOverviewResponse } from '@playsharp/shared';

import { ProgressService } from './progress.service';

@Controller('stats')
export class ProgressController {
  constructor(@Inject(ProgressService) private readonly progressService: ProgressService) {}

  @Get('me')
  async getMyStats(): Promise<ProgressOverviewResponse> {
    const overview = await this.progressService.getOverview();
    return { data: { overview } };
  }
}
