import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ContentModule } from '../content/content.module';
import { PrismaModule } from '../prisma/prisma.module';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';

@Module({
  imports: [AuthModule, ContentModule, PrismaModule],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}
