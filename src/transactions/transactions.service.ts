import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionDto } from './dto/transaction.dto';
import { CurrencyService } from 'src/currency/currency.service';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly currencyService: CurrencyService,
  ) {}

  async deposit(dto: TransactionDto, accountId: number, userId: number) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account) throw new NotFoundException('Account not found');

    return this.prisma.$transaction([
      this.prisma.account.update({
        where: { id: accountId },
        data: { balance: { increment: dto.amount } },
      }),
      this.prisma.transaction.create({
        data: {
          type: 'deposit',
          amount: dto.amount,
          accountId: accountId,
          userId: userId,
        },
      }),
    ]);
  }

  async withdraw(dto: TransactionDto, id: number, userId: number) {
    const account = await this.prisma.account.findUnique({
      where: { id: id },
    });

    if (!account) throw new NotFoundException('Account not found');
    if (account.balance < dto.amount)
      throw new BadRequestException('Insufficient funds');

    return this.prisma.$transaction([
      this.prisma.account.update({
        where: { id: id },
        data: { balance: { decrement: dto.amount } },
      }),
      this.prisma.transaction.create({
        data: {
          type: 'withdraw',
          amount: dto.amount,
          accountId: id,
          userId: userId,
        },
      }),
    ]);
  }

  async transferFunds(userId: number, toAccountId: number, amount: number) {
    if (amount <= 0) {
      throw new BadRequestException('Сума переказу має бути більшою за 0');
    }

    const fromAccount = await this.prisma.account.findFirst({
      where: { userId: userId },
    });

    const toAccount = await this.prisma.account.findUnique({
      where: { id: toAccountId },
    });

    if (!fromAccount || !toAccount) {
      throw new NotFoundException('Один із рахунків не знайдено');
    }

    if (fromAccount.balance < amount) {
      throw new BadRequestException('Недостатньо коштів для переказу');
    }

    let finalAmount = amount;

    if (fromAccount.currency !== toAccount.currency) {
      finalAmount = await this.currencyService.convertAmount(
        amount,
        fromAccount.currency,
        toAccount.currency,
      );
    }

    return this.prisma.$transaction([
      this.prisma.account.update({
        where: { id: fromAccount.id },
        data: { balance: { decrement: amount } },
      }),
      this.prisma.account.update({
        where: { id: toAccount.id },
        data: { balance: { increment: finalAmount } },
      }),
      this.prisma.transaction.create({
        data: {
          type: 'transfer',
          amount,
          accountId: toAccount.id,
          userId: fromAccount.userId,
        },
      }),
    ]);
  }

  async getUserDeposits(userId: number) {
    return this.prisma.transaction.findMany({
      where: {
        userId: userId,
        type: 'deposit',
      },
    });
  }
}
