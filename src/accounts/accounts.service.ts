import { Decimal } from '@prisma/client/runtime/library';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { CurrencyService } from 'src/currency/currency.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AccountsService {
  constructor(
    private prisma: PrismaService,
    private readonly currencyService: CurrencyService,
  ) {}

  async createAccount(dto: CreateAccountDto, userId: number) {
    return this.prisma.account.create({
      data: {
        currency: dto.currency.toUpperCase(),
        userId: userId,
      },
    });
  }

  async closeAccount(accountId: string) {
    const account = await this.prisma.account.findUnique({
      where: { id: +accountId },
    });
    if (!account) throw new NotFoundException('Account not found');

    await this.prisma.transaction.deleteMany({
      where: { accountId: +accountId },
    });

    await this.prisma.account.delete({ where: { id: +accountId } });

    return;
  }

  async getBalance(userId: number, currency: string) {
    const account = await this.prisma.account.findFirst({
      where: { userId: userId },
    });

    if (!account) {
      throw new NotFoundException('Рахунок не знайдено');
    }

    let balance = account.balance;

    if (account.currency !== currency) {
      balance = new Prisma.Decimal(
        await this.currencyService.convertAmount(
          balance,
          account.currency,
          currency,
        ),
      );
    }

    return { balance, currency };
  }
}
