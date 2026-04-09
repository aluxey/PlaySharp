import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { supportedGames } from '@playsharp/shared';

export class SubmitQuizAnswerDto {
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  themeSlug!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(120)
  questionSlug!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(240)
  selectedChoiceLabel!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  responseTimeMs?: number;
}

export class SubmitQuizAttemptDto {
  @IsIn(supportedGames)
  game!: (typeof supportedGames)[number];

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SubmitQuizAnswerDto)
  answers!: ReadonlyArray<SubmitQuizAnswerDto>;
}
