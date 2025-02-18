import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { GetUser } from 'src/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post('open')
  async openAccount(
    @Body() createAccountDto: CreateAccountDto,
    @GetUser() userId: number,
  ) {
    return this.accountsService.createAccount(createAccountDto, userId);
  }

  @Delete('close/:id')
  async deleteAccount(@Param('id') accountId: string, @Res() res: Response) {
    await this.accountsService.closeAccount(accountId);
    return res.send({ message: 'Deleted successfully' });
  }

  @Get('balance')
  async getBalance(
    @Query('currency') currency: string,
    @GetUser() userId: number,
  ) {
    return this.accountsService.getBalance(userId, currency);
  }
}
