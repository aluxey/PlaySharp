import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import type {
  AdminContentExportResponse,
  AdminLessonMutationResponse,
  AdminLessonsResponse,
  AdminOverviewResponse,
  AdminQuestionMutationResponse,
  AdminQuestionsResponse,
  AdminThemesResponse,
} from '@playsharp/shared';

import { AuthGuard } from '../auth/auth.guard';
import { AdminGuard } from './admin.guard';
import { AdminLessonMutationDto, AdminQuestionMutationDto } from './admin.dto';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(AuthGuard, AdminGuard)
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

  @Post('lessons')
  async createLesson(@Body() body: AdminLessonMutationDto): Promise<AdminLessonMutationResponse> {
    const lesson = await this.adminService.createLesson(body);
    return { data: { lesson } };
  }

  @Patch('lessons/:id')
  async updateLesson(
    @Param('id') id: string,
    @Body() body: AdminLessonMutationDto,
  ): Promise<AdminLessonMutationResponse> {
    const lesson = await this.adminService.updateLesson(id, body);
    return { data: { lesson } };
  }

  @Delete('lessons/:id')
  async archiveLesson(@Param('id') id: string): Promise<AdminLessonMutationResponse> {
    const lesson = await this.adminService.archiveLesson(id);
    return { data: { lesson } };
  }

  @Get('questions')
  async getQuestions(): Promise<AdminQuestionsResponse> {
    const questions = await this.adminService.listQuestions();
    return { data: { questions } };
  }

  @Get('export')
  async exportCatalog(): Promise<AdminContentExportResponse> {
    const catalog = await this.adminService.exportCatalog();
    return { data: { catalog } };
  }

  @Post('questions')
  async createQuestion(
    @Body() body: AdminQuestionMutationDto,
  ): Promise<AdminQuestionMutationResponse> {
    const question = await this.adminService.createQuestion(body);
    return { data: { question } };
  }

  @Patch('questions/:id')
  async updateQuestion(
    @Param('id') id: string,
    @Body() body: AdminQuestionMutationDto,
  ): Promise<AdminQuestionMutationResponse> {
    const question = await this.adminService.updateQuestion(id, body);
    return { data: { question } };
  }

  @Delete('questions/:id')
  async archiveQuestion(@Param('id') id: string): Promise<AdminQuestionMutationResponse> {
    const question = await this.adminService.archiveQuestion(id);
    return { data: { question } };
  }
}
