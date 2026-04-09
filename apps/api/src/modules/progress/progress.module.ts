import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { ContentModule } from '../content/content.module';
import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';

@Module({
  imports: [AuthModule, ContentModule],
  controllers: [ProgressController],
  providers: [ProgressService],
  exports: [ProgressService],
})
export class ProgressModule {}
