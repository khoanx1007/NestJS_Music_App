import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './user.dto';
import * as bcrypt from 'bcryptjs';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) { }

  async create(createUserDto: CreateUserDto): Promise<Object> {
    const salt = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
    const user = this.usersRepository.create({ ...createUserDto, apiKey: uuid4() });
    try {
      await this.usersRepository.save(user);
      delete user.password;
      return {
        message: "User created",
        data: user,
        status: HttpStatus.CREATED,
      }
    } catch (error) {
      throw new HttpException("Email already exists", HttpStatus.BAD_REQUEST);
    }

  }

  async updateSecretKey(id: number, twoFASecret: string) {
    return this.usersRepository.update({ id }, { twoFASecret, enable2FA: true });
  }

  async disable2FA(id: number): Promise<UpdateResult> {
    return this.usersRepository.update({ id }, { enable2FA: false, twoFASecret: null });
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOneBy({ email });
  }

  async findById(id: number): Promise<User> {
    return await this.usersRepository.findOneBy({ id });
  }

  async findOneByApiKey(apiKey: string): Promise<User> {
    return await this.usersRepository.findOneBy({ apiKey });
  }
}
