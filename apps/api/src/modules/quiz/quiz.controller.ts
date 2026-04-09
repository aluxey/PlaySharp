import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  NotFoundException,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  type ContentGameName,
  type QuizDailyResponse,
  type QuizAttemptSubmitResponse,
} from '@playsharp/shared';

import { createApiError } from '../../common/api-error';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthenticatedUser } from '../auth/auth.types';
import { QuizService } from './quiz.service';
import { isGameName } from '../content/content.utils';
import { SubmitQuizAttemptDto } from './quiz.dto';

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

  @UseGuards(AuthGuard)
  @Post('attempts')
  async submitAttempt(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: SubmitQuizAttemptDto,
  ): Promise<QuizAttemptSubmitResponse> {
    const attempt = await this.quizService.submitAttempt(user.id, body);

    if (!attempt) {
      throw new BadRequestException(
        createApiError(
          HttpStatus.BAD_REQUEST,
          'QUIZ_INVALID_ATTEMPT',
          'Could not evaluate the submitted quiz attempt.',
        ),
      );
    }

    return { data: { attempt } };
  }
}
