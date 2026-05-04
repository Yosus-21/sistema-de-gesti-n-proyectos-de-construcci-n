import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import type { StringValue } from 'ms';
import {
  assertAuthEnvironmentPolicy,
  getJwtExpiresIn,
  getJwtSecret,
} from '../common';
import { RepositoriesModule } from '../infrastructure';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies';

@Module({
  imports: [
    RepositoriesModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: () => {
        assertAuthEnvironmentPolicy();

        return {
          secret: getJwtSecret(),
          signOptions: {
            expiresIn: getJwtExpiresIn() as StringValue,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, PassportModule, JwtModule],
})
export class AuthModule {}
