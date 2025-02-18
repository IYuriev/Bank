import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionDto } from './dto/transaction.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/decorators/get-user.decorator';
import { TransferDto } from './dto/transfer.dto';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('deposit/:id')
  async deposit(
    @Body() dto: TransactionDto,
    @Param('id') accountId: string,
    @GetUser() userId: number,
  ) {
    return this.transactionsService.deposit(dto, +accountId, userId);
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

  @Get('deposits')
  async getUserDeposits(@GetUser() userId: number) {
    return this.transactionsService.getUserDeposits(userId);
  }
}
