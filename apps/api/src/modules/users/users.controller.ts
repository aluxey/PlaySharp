import { Body, Controller, Get, Inject, Post, Query, UseGuards } from '@nestjs/common';

import type { LessonCompletionResponse, ProfileOverviewResponse } from '@playsharp/shared';

import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/auth.types';
import { LessonCompletionDto } from './users.dto';
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

  @UseGuards(AuthGuard)
  @Get('me/lesson-completion')
  async getMyLessonCompletion(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: LessonCompletionDto,
  ): Promise<LessonCompletionResponse> {
    const completion = await this.usersService.getLessonCompletionStatus(user.id, query);
    return { data: { completion } };
  }

  @UseGuards(AuthGuard)
  @Post('me/lesson-completions')
  async completeMyLesson(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: LessonCompletionDto,
  ): Promise<LessonCompletionResponse> {
    const completion = await this.usersService.completeLesson(user.id, body);
    return { data: { completion } };
  }
}
