import { Controller, Get, HttpStatus, Inject, NotFoundException, Param } from '@nestjs/common';

import type {
  ContentGameName,
  ContentGameResponse,
  ContentGamesResponse,
  ContentThemeLessonsResponse,
  ContentThemeQuestionsResponse,
  ContentThemesResponse,
} from '@playsharp/shared';

import { createApiError } from '../../common/api-error';
import { ContentService } from './content.service';
import { isGameName } from './content.utils';

function requireGameName(game: string): ContentGameName {
  if (!isGameName(game)) {
    throw new NotFoundException(
      createApiError(HttpStatus.NOT_FOUND, 'CONTENT_UNKNOWN_GAME', `Unknown game: ${game}`),
    );
  }

  return game;
}

@Controller('content')
export class ContentController {
  constructor(@Inject(ContentService) private readonly contentService: ContentService) {}

  @Get('games')
  async listGames(): Promise<ContentGamesResponse> {
    const games = await this.contentService.listGameSummaries();
    return { data: { games } };
  }

  @Get('games/:game')
  async getGame(@Param('game') game: string): Promise<ContentGameResponse> {
    const selectedGame = requireGameName(game);
    const catalog = await this.contentService.getGame(selectedGame);

    if (!catalog) {
      throw new NotFoundException(
        createApiError(
          HttpStatus.NOT_FOUND,
          'CONTENT_GAME_NOT_FOUND',
          `Missing content for game: ${game}`,
        ),
      );
    }

    return { data: { game: catalog } };
  }

  @Get('games/:game/themes')
  async listThemes(@Param('game') game: string): Promise<ContentThemesResponse> {
    const selectedGame = requireGameName(game);
    const themes = await this.contentService.getThemes(selectedGame);

    return { data: { game: selectedGame, themes } };
  }

  @Get('games/:game/themes/:themeSlug/lessons')
  async listLessons(
    @Param('game') game: string,
    @Param('themeSlug') themeSlug: string,
  ): Promise<ContentThemeLessonsResponse> {
    const selectedGame = requireGameName(game);
    const theme = await this.contentService.getTheme(selectedGame, themeSlug);

    if (!theme) {
      throw new NotFoundException(
        createApiError(
          HttpStatus.NOT_FOUND,
          'CONTENT_THEME_NOT_FOUND',
          `Unknown theme: ${themeSlug}`,
        ),
      );
    }

    return {
      data: {
        game: selectedGame,
        theme: theme.slug,
        lessons: theme.lessons,
      },
    };
  }

  @Get('games/:game/themes/:themeSlug/questions')
  async listQuestions(
    @Param('game') game: string,
    @Param('themeSlug') themeSlug: string,
  ): Promise<ContentThemeQuestionsResponse> {
    const selectedGame = requireGameName(game);
    const theme = await this.contentService.getTheme(selectedGame, themeSlug);

    if (!theme) {
      throw new NotFoundException(
        createApiError(
          HttpStatus.NOT_FOUND,
          'CONTENT_THEME_NOT_FOUND',
          `Unknown theme: ${themeSlug}`,
        ),
      );
    }

    return {
      data: {
        game: selectedGame,
        theme: theme.slug,
        questions: theme.questions,
      },
    };
  }
}
