import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CurrencyService } from 'src/currency/currency.service';
import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Cron } from '@nestjs/schedule';
import { TransactionType } from 'src/constants/enums/transactionType';
import {
  convertCurrency,
  getAccounts,
} from 'src/utils/transactions/transactions';
import { TransactionDto } from './dto/transaction.dto';
import { TransferDto } from './dto/create-transfer.dto';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly currencyService: CurrencyService,
  ) {}

  async contribution(dto: TransactionDto, accountId: number, userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new NotFoundException('User not found');
    if (user.isBlocked)
      throw new ForbiddenException('Your account has been blocked.');

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
          type: TransactionType.CONTRUBUTION,
          amount: dto.amount,
          accountId: accountId,
          userId: userId,
        },
      }),
    ]);
  }

  async withdraw(dto: TransactionDto, id: number, userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.isBlocked)
      throw new ForbiddenException('Your account has been blocked');

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
          type: TransactionType.WITHDRAW,
          amount: dto.amount,
          accountId: id,
          userId: userId,
        },
      }),
    ]);
  }

  async transferFunds(userId: number, dto: TransferDto) {
    const { fromAccount, toAccount } = await getAccounts(
      this.prisma,
      userId,
      dto.toAccountId,
    );
    const decimalAmount = new Decimal(dto.amount);

    if (fromAccount.balance.lt(decimalAmount)) {
      throw new BadRequestException('Insufficient funds for transfer');
    }

    const finalAmount = await convertCurrency(
      this.currencyService,
      fromAccount,
      toAccount,
      decimalAmount,
    );

    return this.prisma.$transaction([
      this.prisma.account.update({
        where: { id: fromAccount.id },
        data: { balance: { decrement: decimalAmount } },
      }),
      this.prisma.account.update({
        where: { id: toAccount.id },
        data: { balance: { increment: finalAmount } },
      }),
      this.prisma.transaction.create({
        data: {
          type: TransactionType.TRANSFER,
          amount: finalAmount,
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
        type: TransactionType.CONTRUBUTION,
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
            type: TransactionType.DEPOSIT_INTEREST,
            amount: interestAmount,
            accountId: deposit.accountId,
            userId: deposit.userId,
          },
        }),
      ]);
    }
  }
}
