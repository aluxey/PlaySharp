import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { supportedGames, type ContentDifficulty } from '@playsharp/shared';

const supportedDifficulties = ['beginner', 'intermediate', 'advanced'] as const;

function trimString(value: unknown) {
  return typeof value === 'string' ? value.trim() : value;
}

function normalizeSlug(value: unknown) {
  return typeof value === 'string' ? value.trim().toLowerCase() : value;
}

export class AdminLessonMutationDto {
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

  @Transform(({ value }) => trimString(value))
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  title!: string;

  @Transform(({ value }) => trimString(value))
  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  content!: string;

  @IsIn(supportedDifficulties)
  level!: ContentDifficulty;
}

export class AdminQuestionChoiceMutationDto {
  @Transform(({ value }) => trimString(value))
  @IsString()
  @MinLength(1)
  @MaxLength(240)
  label!: string;

  @IsBoolean()
  isCorrect!: boolean;

  @IsOptional()
  @Transform(({ value }) => (value === null ? null : trimString(value)))
  @IsString()
  @MaxLength(500)
  explanation?: string | null;
}

export class AdminQuestionMutationDto {
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
  questionSlug!: string;

  @Transform(({ value }) => trimString(value))
  @IsString()
  @MinLength(2)
  @MaxLength(180)
  title!: string;

  @IsOptional()
  @Transform(({ value }) => (value === null ? null : trimString(value)))
  @IsString()
  @MaxLength(1000)
  scenario?: string | null;

  @IsIn(supportedDifficulties)
  difficulty!: ContentDifficulty;

  @Transform(({ value }) => trimString(value))
  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  explanation!: string;

  @IsBoolean()
  isPremium!: boolean;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(8)
  @ValidateNested({ each: true })
  @Type(() => AdminQuestionChoiceMutationDto)
  choices!: ReadonlyArray<AdminQuestionChoiceMutationDto>;
}
