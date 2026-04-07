import { BadRequestException, Controller, Get, NotFoundException, Query } from '@nestjs/common';

import { type ContentGameName } from '@playsharp/shared';

import { QuizService } from './quiz.service';
import { isGameName } from '../content/content.utils';

function parseGameQuery(game: string | undefined): ContentGameName {
  if (game === undefined) {
    return 'poker';
  }

  if (!isGameName(game)) {
    throw new BadRequestException(`Unknown game: ${game}`);
  }

  return game;
}

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get('daily')
  async getDailyQuiz(@Query('game') game?: string) {
    const selectedGame = parseGameQuery(game);
    const quiz = await this.quizService.getDailyQuiz(selectedGame);

    if (!quiz) {
      throw new NotFoundException(`No quiz content available for ${selectedGame}`);
    }

    return quiz;
  }
}
