import { Injectable } from '@nestjs/common';

import { type ContentGameName, type DailyQuiz } from '@playsharp/shared';

import { ContentService } from '../content/content.service';

@Injectable()
export class QuizService {
  constructor(private readonly contentService: ContentService) {}

  async getDailyQuiz(game: ContentGameName): Promise<DailyQuiz | null> {
    return this.contentService.getDailyQuiz(game);
  }
}
