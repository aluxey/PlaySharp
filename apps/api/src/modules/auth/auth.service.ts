import {
  ConflictException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import type { AuthSession } from '@playsharp/shared';

import { createApiError } from '../../common/api-error';
import { PrismaService } from '../prisma/prisma.service';
import { hashPassword, verifyPassword } from './auth-password';
import { AuthTokenService } from './auth-token.service';
import type { LoginRequestDto, RegisterRequestDto } from './auth.dto';
import type { AuthenticatedUser } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(AuthTokenService) private readonly authTokenService: AuthTokenService,
  ) {}

  async register(input: RegisterRequestDto): Promise<AuthSession> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: input.email },
      select: { id: true },
    });

    if (existingUser) {
      throw new ConflictException(
        createApiError(
          HttpStatus.CONFLICT,
          'AUTH_EMAIL_TAKEN',
          `An account already exists for ${input.email}.`,
        ),
      );
    }

    const passwordHash = await hashPassword(input.password);
    const user = await this.prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        plan: true,
      },
    });

    return this.authTokenService.createSession(this.toAuthenticatedUser(user));
  }

  async login(input: LoginRequestDto): Promise<AuthSession> {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        plan: true,
        passwordHash: true,
      },
    });

    if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
      throw new UnauthorizedException(
        createApiError(
          HttpStatus.UNAUTHORIZED,
          'AUTH_INVALID_CREDENTIALS',
          'Invalid email or password.',
        ),
      );
    }

    return this.authTokenService.createSession(this.toAuthenticatedUser(user));
  }

  private toAuthenticatedUser(user: {
    id: string;
    email: string;
    role: string;
    plan: string;
    name: string;
  }): AuthenticatedUser {
    return {
      id: user.id,
      email: user.email,
      role: user.role === 'ADMIN' ? 'admin' : 'user',
      plan: user.plan === 'PREMIUM' ? 'premium' : 'free',
    };
  }
}
