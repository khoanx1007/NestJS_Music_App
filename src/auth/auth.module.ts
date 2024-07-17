import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt-strategy';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: 'mySecretKey',
      signOptions: { expiresIn: '2h' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule { }
