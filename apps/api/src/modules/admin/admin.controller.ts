import { Controller, Get, Inject } from '@nestjs/common';

import type {
  AdminLessonsResponse,
  AdminOverviewResponse,
  AdminQuestionsResponse,
  AdminThemesResponse,
} from '@playsharp/shared';

import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(@Inject(AdminService) private readonly adminService: AdminService) {}

  @Get('overview')
  async getOverview(): Promise<AdminOverviewResponse> {
    const overview = await this.adminService.getOverview();
    return { data: { overview } };
  }

  @Get('themes')
  async getThemes(): Promise<AdminThemesResponse> {
    const themes = await this.adminService.listThemes();
    return { data: { themes } };
  }

  @Get('lessons')
  async getLessons(): Promise<AdminLessonsResponse> {
    const lessons = await this.adminService.listLessons();
    return { data: { lessons } };
  }

  @Get('questions')
  async getQuestions(): Promise<AdminQuestionsResponse> {
    const questions = await this.adminService.listQuestions();
    return { data: { questions } };
  }
}
