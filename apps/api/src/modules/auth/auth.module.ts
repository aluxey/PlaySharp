import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AuthTokenService } from './auth-token.service';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, AuthTokenService, AuthGuard],
  exports: [AuthGuard, AuthService, AuthTokenService],
})
export class AuthModule {}
