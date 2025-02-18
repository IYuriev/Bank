import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { CurrencyService } from 'src/currency/currency.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, PrismaService, CurrencyService],
})
export class TransactionsModule {}
