import { Module } from '@nestjs/common';
import { ContentModule } from '../content/content.module';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';

@Module({
  imports: [ContentModule],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}
