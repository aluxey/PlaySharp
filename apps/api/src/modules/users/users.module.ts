import { Module } from '@nestjs/common';

import { ContentModule } from '../content/content.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [ContentModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
