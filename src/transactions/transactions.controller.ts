import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionDto } from './dto/transaction.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/decorators/get-user.decorator';
import { TransferDto } from './dto/transfer.dto';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('contribution/:id')
  async contribution(
    @Body() dto: TransactionDto,
    @Param('id') accountId: string,
    @GetUser() userId: number,
  ) {
    return this.transactionsService.contribution(dto, +accountId, userId);
  }

  @Post('withdraw/:id')
  async withdraw(
    @Body() dto: TransactionDto,
    @Param('id') accountId: string,
    @GetUser() userId: number,
  ) {
    return this.transactionsService.withdraw(dto, +accountId, userId);
  }

  @Post('transfer')
  async transferFunds(@Body() dto: TransferDto, @GetUser() userId: number) {
    const { toAccountId, amount } = dto;
    return this.transactionsService.transferFunds(userId, toAccountId, amount);
  }

  @Get('contributions')
  async getUserContributions(@GetUser() userId: number) {
    return this.transactionsService.getUserContribution(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('deposit')
  async createDeposit(
    @GetUser() userId: number,
    @Body() { amount, interest, duration },
  ) {
    return this.transactionsService.createDeposit(
      userId,
      amount,
      interest,
      duration,
    );
  }
}
