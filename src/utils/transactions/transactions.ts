import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { IAccount } from 'src/constants/types/account';
import { CurrencyService } from 'src/currency/currency.service';
import { PrismaService } from 'src/prisma/prisma.service';

export const getAccounts = async (
  prisma: PrismaService,
  userId: number,
  toAccountId: number,
) => {
  const [fromAccount, toAccount] = await Promise.all([
    prisma.account.findFirst({ where: { userId } }),
    prisma.account.findUnique({ where: { id: toAccountId } }),
  ]);

  if (!fromAccount || !toAccount) {
    throw new NotFoundException('One of the accounts was not found.');
  }

  return { fromAccount, toAccount };
};

export async function convertCurrency(
  currencyService: CurrencyService,
  fromAccount: IAccount,
  toAccount: IAccount,
  amount: Decimal,
): Promise<Decimal> {
  if (fromAccount.currency === toAccount.currency) {
    return amount;
  }

  return new Decimal(
    await currencyService.convertAmount(
      amount,
      fromAccount.currency,
      toAccount.currency,
    ),
  );
}
