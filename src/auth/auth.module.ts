import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.register({
      secret: 'SECRET_KEY_123',
      signOptions: {
        expiresIn: '1h',
      },
    }),
  ],

  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
