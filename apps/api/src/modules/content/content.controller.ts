import { Controller, Get, NotFoundException, Param } from '@nestjs/common';

import { type ContentGameName } from '@playsharp/shared';

import { ContentService } from './content.service';
import { isGameName } from './content.utils';

function requireGameName(game: string): ContentGameName {
  if (!isGameName(game)) {
    throw new NotFoundException(`Unknown game: ${game}`);
  }

  return game;
}

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('games')
  async listGames() {
    const games = await this.contentService.listGameSummaries();
    return { games };
  }

  @Get('games/:game')
  async getGame(@Param('game') game: string) {
    const selectedGame = requireGameName(game);
    const catalog = await this.contentService.getGame(selectedGame);

    if (!catalog) {
      throw new NotFoundException(`Missing content for game: ${game}`);
    }

    return catalog;
  }

  @Get('games/:game/themes')
  async listThemes(@Param('game') game: string) {
    const selectedGame = requireGameName(game);
    const themes = await this.contentService.getThemes(selectedGame);

    return { game: selectedGame, themes };
  }

  @Get('games/:game/themes/:themeSlug/lessons')
  async listLessons(@Param('game') game: string, @Param('themeSlug') themeSlug: string) {
    const selectedGame = requireGameName(game);
    const theme = await this.contentService.getTheme(selectedGame, themeSlug);

    if (!theme) {
      throw new NotFoundException(`Unknown theme: ${themeSlug}`);
    }

    return { game: selectedGame, theme: theme.slug, lessons: theme.lessons };
  }

  @Get('games/:game/themes/:themeSlug/questions')
  async listQuestions(@Param('game') game: string, @Param('themeSlug') themeSlug: string) {
    const selectedGame = requireGameName(game);
    const theme = await this.contentService.getTheme(selectedGame, themeSlug);

    if (!theme) {
      throw new NotFoundException(`Unknown theme: ${themeSlug}`);
    }

    return { game: selectedGame, theme: theme.slug, questions: theme.questions };
  }
}
