import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  UseGuards,
  Param,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CookieService } from 'src/cookie/cookie.service';
import { Response } from 'express';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Decimal } from '@prisma/client/runtime/library';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cookieService: CookieService,
  ) {}

  @Post('registration')
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const token = await this.usersService.create(createUserDto);
    this.cookieService.setUserCookie(res, token);
    return res.send({ message: 'Registration completed successfully' });
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  getAllUsers() {
    return this.usersService.findAll();
  }

  @Get('history/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  getcCnontributionHistory(@Param('id') userId: string) {
    return this.usersService.getHistory(+userId);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id/block')
  async blockUser(@Param('id') userId: string) {
    return this.usersService.blockUser(+userId);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id/unblock')
  async unblockUser(@Param('id') userId: string) {
    return this.usersService.unblockUser(+userId);
  }
}
