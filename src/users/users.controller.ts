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
import { AdminGuard } from 'src/common/guards/admin/admin.guard';
import { JwtAuthGuard } from 'src/common/guards/auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { ApiDocFor } from 'src/common/decorators/api-doc.decorator';
import { USER_CONTROLLER_DOCS } from 'src/constants/docs/users/user.controller';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cookieService: CookieService,
  ) {}

  @Post('registration')
  @ApiDocFor(USER_CONTROLLER_DOCS.registration)
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const token = await this.usersService.create(createUserDto);
    this.cookieService.setUserCookie(res, token);
    return res.send({ message: 'Registration completed successfully' });
  }

  @Get()
  @ApiDocFor(USER_CONTROLLER_DOCS.getAllUsers)
  @UseGuards(JwtAuthGuard, AdminGuard)
  getAllUsers() {
    return this.usersService.findAll();
  }

  @Get(':id/history')
  @ApiDocFor(USER_CONTROLLER_DOCS.getContributionHistory)
  @UseGuards(JwtAuthGuard, AdminGuard)
  getContributionHistory(@Param('id') userId: string) {
    return this.usersService.getHistory(+userId);
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id/block')
  @ApiDocFor(USER_CONTROLLER_DOCS.blockUser)
  async blockUser(@Param('id') userId: string, @Res() res: Response) {
    this.usersService.blockUser(+userId);
    return res.send({ message: 'User was blocked successfully' });
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id/unblock')
  @ApiDocFor(USER_CONTROLLER_DOCS.unblockUser)
  async unblockUser(@Param('id') userId: string, @Res() res: Response) {
    this.usersService.unblockUser(+userId);
    return res.send({ message: 'User was unblocked successfully' });
  }
}
