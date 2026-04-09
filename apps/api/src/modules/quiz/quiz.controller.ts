import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Inject,
  NotFoundException,
  Query,
} from '@nestjs/common';

import { type ContentGameName, type QuizDailyResponse } from '@playsharp/shared';

import { createApiError } from '../../common/api-error';
import { QuizService } from './quiz.service';
import { isGameName } from '../content/content.utils';

function parseGameQuery(game: string | undefined): ContentGameName {
  if (game === undefined) {
    return 'poker';
  }

  if (!isGameName(game)) {
    throw new BadRequestException(
      createApiError(HttpStatus.BAD_REQUEST, 'QUIZ_UNKNOWN_GAME', `Unknown game: ${game}`),
    );
  }

  return game;
}

@Controller('quiz')
export class QuizController {
  constructor(@Inject(QuizService) private readonly quizService: QuizService) {}

  @Get('daily')
  async getDailyQuiz(@Query('game') game?: string): Promise<QuizDailyResponse> {
    const selectedGame = parseGameQuery(game);
    const quiz = await this.quizService.getDailyQuiz(selectedGame);

    if (!quiz) {
      throw new NotFoundException(
        createApiError(
          HttpStatus.NOT_FOUND,
          'QUIZ_DAILY_NOT_FOUND',
          `No quiz content available for ${selectedGame}`,
        ),
      );
    }

    return { data: { quiz } };
  }
}
