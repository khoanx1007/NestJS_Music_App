import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto } from 'src/users/user.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Enable2FAType } from './auth-types';
import { ValidateTokenDto } from './auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('signup')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({
    status: 201,
    description: 'It will return the user in the response',
  })
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: 200,
    description: 'It will return the access_token in the response',
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.signin(loginDto);
  }

  @Post('enable-2fa')
  @UseGuards(JwtAuthGuard)
  enable2FA(@Request() req): Promise<Enable2FAType> {
    return this.authService.enable2FA(req.user.userId);
  }

  @Post('disable-2fa')
  @UseGuards(JwtAuthGuard)
  disable2FA(@Request() req) {
    return this.authService.disable2FA(req.user.userId);
  }

  @Post('validate-2fa')
  @UseGuards(JwtAuthGuard)
  validate2FAToken(@Request() req, @Body() validateTokenDto: ValidateTokenDto): Promise<{ verified: boolean }> {
    return this.authService.validate2FAToken(req.user.userId, validateTokenDto.token);
  }

  @Get('profile')
  @UseGuards(AuthGuard('apikey'))
  getProfile(@Request() req) {
    delete req.user.password;
    return {
      msg: 'authenticated with api key',
      user: req.user
    }
  }

  @Get('test')
  testEnv() {
    return this.authService.getEnvVariables();
  }
}
