import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { AuthService } from './auth.service';

@Injectable()
export class ApiKeyStragegy extends PassportStrategy(Strategy, 'apikey') {
  constructor(private authService: AuthService) {
    super();
  }
  async validate(apiKey: string): Promise<any> {
    const user = this.authService.validateUserByApiKey(apiKey);
    if (!user) {
      throw new UnauthorizedException('Invalid api key');
    }
    else {
      return user;
    }
  }
}
