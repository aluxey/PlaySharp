import { Module } from '@nestjs/common';

import { ContentModule } from '../content/content.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [ContentModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
