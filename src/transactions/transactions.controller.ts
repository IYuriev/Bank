import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';

import { JwtAuthGuard } from 'src/common/guards/auth/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { TransferDto } from './dto/create-transfer.dto';
import { AccountOwnerGuard } from 'src/common/guards/account/account.guard';
import { TransactionDto } from './dto/transaction.dto';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post(':accountId/contribution')
  async contribution(
    @Body() dto: TransactionDto,
    @Param('accountId') accountId: string,
    @GetUser() userId: number,
  ) {
    return this.transactionsService.contribution(dto, +accountId, userId);
  }

  @Post(':accountId/withdraw')
  @UseGuards(AccountOwnerGuard)
  async withdraw(
    @Body() dto: TransactionDto,
    @Param('accountId') accountId: string,
    @GetUser() userId: number,
  ) {
    return this.transactionsService.withdraw(dto, +accountId, userId);
  }

  @Post('transfer')
  async transferFunds(@Body() dto: TransferDto, @GetUser() userId: number) {
    return this.transactionsService.transferFunds(userId, dto);
  }

  @Get('contributions')
  async getUserContributions(@GetUser() userId: number) {
    return this.transactionsService.getUserContribution(userId);
  }
}
