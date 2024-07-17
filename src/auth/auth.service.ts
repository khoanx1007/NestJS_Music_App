import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto, LoginDto } from '../users/user.dto';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/user.entity';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }
  async signup(CreateUserDto: CreateUserDto): Promise<Object> {
    return this.usersService.create(CreateUserDto);
  }

  async signin(LoginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.usersService.findOneByEmail(LoginDto.email);
    if (user && await bcrypt.compare(LoginDto.password, user.password)) {
      delete user.password;
      const payload: JwtPayload = { email: user.email, sub: user.id };
      return { accessToken: this.jwtService.sign(payload) };
    }
    else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
