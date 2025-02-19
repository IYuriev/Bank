import {
  Body,
  Controller,
  Post,
  Response,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CookieService } from 'src/cookie/cookie.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @Post('login')
  async login(@Body() dto: CreateUserDto, @Response() res) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = await this.authService.login(user);
    this.cookieService.setUserCookie(res, token);
    return res.send({ message: 'Logged in successfully' });
  }
}
