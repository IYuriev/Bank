import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new NotFoundException('User not found');
    if (user.isBlocked)
      throw new ForbiddenException('Your account has been blocked');

    const existingAccount = await this.prisma.account.findFirst({
      where: { userId },
    });

    if (existingAccount) {
      throw new BadRequestException(
        'You already have an account. You cannot create another one',
      );
    }

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

    return this.prisma.account.delete({ where: { id: +accountId } });
  }

  async getBalance(accountId: string, currency: string) {
    const account = await this.prisma.account.findUnique({
      where: { id: +accountId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.currency === currency.toUpperCase()) {
      return { balance: account.balance, currency };
    }

    const convertedBalance = await this.currencyService.convertAmount(
      account.balance,
      account.currency,
      currency.toUpperCase(),
    );

    return { balance: new Prisma.Decimal(convertedBalance), currency };
  }
}
