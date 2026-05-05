import { Transform } from 'class-transformer';
import { IsIn, IsString, Matches, MaxLength, MinLength } from 'class-validator';

import { supportedGames } from '@playsharp/shared';

function normalizeSlug(value: unknown) {
  return typeof value === 'string' ? value.trim().toLowerCase() : value;
}

export class LessonCompletionDto {
  @Transform(({ value }) => normalizeSlug(value))
  @IsIn(supportedGames)
  game!: (typeof supportedGames)[number];

  @Transform(({ value }) => normalizeSlug(value))
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  themeSlug!: string;

  @Transform(({ value }) => normalizeSlug(value))
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  lessonSlug!: string;
}
