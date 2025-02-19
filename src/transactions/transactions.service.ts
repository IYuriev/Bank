import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionDto } from './dto/transaction.dto';
import { CurrencyService } from 'src/currency/currency.service';
import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly currencyService: CurrencyService,
  ) {}

  async contribution(dto: TransactionDto, accountId: number, userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new NotFoundException('Користувача не знайдено');
    if (user.isBlocked) throw new ForbiddenException('Ваш акаунт заблоковано');

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
          type: 'contribution',
          amount: dto.amount,
          accountId: accountId,
          userId: userId,
        },
      }),
    ]);
  }

  async withdraw(dto: TransactionDto, id: number, userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new NotFoundException('Користувача не знайдено');
    if (user.isBlocked) throw new ForbiddenException('Ваш акаунт заблоковано');

    const account = await this.prisma.account.findUnique({
      where: { id: id },
    });

    if (!account) throw new NotFoundException('Account not found');
    if (+account.balance < +dto.amount)
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

  async transferFunds(userId: number, toAccountId: number, amount: Decimal) {
    if (amount.toNumber() <= 0) {
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

    let finalAmount = new Prisma.Decimal(amount);

    if (fromAccount.currency !== toAccount.currency) {
      finalAmount = new Prisma.Decimal(
        await this.currencyService.convertAmount(
          amount,
          fromAccount.currency,
          toAccount.currency,
        ),
      );
    }

    return this.prisma.$transaction([
      this.prisma.account.update({
        where: { id: fromAccount.id },
        data: { balance: { decrement: +finalAmount } },
      }),
      this.prisma.account.update({
        where: { id: toAccount.id },
        data: { balance: { increment: +finalAmount } },
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

  async getUserContribution(userId: number) {
    return this.prisma.transaction.findMany({
      where: {
        userId: userId,
        type: 'contribution',
      },
    });
  }

  @Cron('0 0 * * *')
  async checkMaturedDeposits() {
    const today = new Date();

    const maturedDeposits = await this.prisma.deposit.findMany({
      where: { endDate: { lte: today } },
    });

    for (const deposit of maturedDeposits) {
      const interestAmount = deposit.amount.mul(deposit.interest).div(100);

      await this.prisma.$transaction([
        this.prisma.account.update({
          where: { id: deposit.accountId },
          data: { balance: { increment: deposit.amount.add(interestAmount) } },
        }),

        this.prisma.deposit.delete({
          where: { id: deposit.id },
        }),

        this.prisma.transaction.create({
          data: {
            type: 'deposit_interest',
            amount: interestAmount,
            accountId: deposit.accountId,
            userId: deposit.userId,
          },
        }),
      ]);
    }
  }
}
