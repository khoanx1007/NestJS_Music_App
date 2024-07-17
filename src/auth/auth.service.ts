import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto, LoginDto } from '../users/user.dto';
import * as bcrypt from 'bcryptjs';
import * as speakeasy from 'speakeasy';
import { JwtService } from '@nestjs/jwt';
import { Enable2FAType, JwtPayload } from './auth-types';
import { ArtistsService } from 'src/artists/artists.service';
import { UpdateResult } from 'typeorm';
import { User } from 'src/users/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private artistsService: ArtistsService,
    private configService: ConfigService,
  ) { }
  async signup(CreateUserDto: CreateUserDto): Promise<Object> {
    return this.usersService.create(CreateUserDto);
  }

  async signin(LoginDto: LoginDto): Promise<{ accessToken: string } | { validate2FA: string, message: string }> {
    const user = await this.usersService.findOneByEmail(LoginDto.email);
    if (user && await bcrypt.compare(LoginDto.password, user.password)) {
      delete user.password;
      const payload: JwtPayload = { email: user.email, sub: user.id };
      const artist = await this.artistsService.findArtist(user.id);
      if (artist) {
        payload.artistId = artist.id;
      }
      if (user.enable2FA && user.twoFASecret) {
        return {
          validate2FA: 'http://localhost:3000/auth/validate-2fa',
          message: 'Please send the one-time password/token from your Google Authenticator App',
        };
      }
      return { accessToken: this.jwtService.sign(payload) };
    }
    else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
  async enable2FA(userId: number): Promise<Enable2FAType> {
    const user = await this.usersService.findById(userId);
    if (user.enable2FA) {
      return { secret: user.twoFASecret };
    }
    const secret = speakeasy.generateSecret();
    user.twoFASecret = secret.base32;
    await this.usersService.updateSecretKey(user.id, user.twoFASecret);
    return { secret: user.twoFASecret };
  }

  async disable2FA(userId: number): Promise<UpdateResult> {
    return this.usersService.disable2FA(userId);
  }

  async validate2FAToken(userId: number, token: string): Promise<{ verified: boolean }> {
    try {
      const user = await this.usersService.findById(userId);
      const verified = speakeasy.totp.verify({ secret: user.twoFASecret, encoding: 'base32', token });
      return { verified: verified ? true : false };
    } catch (err) {
      throw new UnauthorizedException('Error verify token');
    }
  }

  async validateUserByApiKey(apiKey: string): Promise<User> {
    return this.usersService.findOneByApiKey(apiKey);
  }

  getEnvVariables() {
    return this.configService.get<number>('port')
  }
}
