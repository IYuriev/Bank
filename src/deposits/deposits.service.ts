import { Injectable, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DepositsService {
  constructor(private readonly prisma: PrismaService) {}

  async calculateDepositWithInterest(userId: number): Promise<Object> {
    const deposits = await this.prisma.deposit.findMany({
      where: { userId },
    });

    if (!deposits) {
      throw new NotFoundException('Deposits not found');
    }

    const activeDeposits = deposits.filter(
      (deposit) => deposit.endDate > new Date(),
    );

    if (activeDeposits.length === 0) {
      throw new NotFoundException('No active deposits found');
    }

    const depositsWithPossibleAmount = await Promise.all(
      activeDeposits.map(async (deposit) => {
        if (deposit.endDate > new Date()) {
          const { amount, interest } = deposit;

          const interestAmount = amount.mul(interest).div(new Decimal(100));

          return {
            id: deposit.id,
            amount: deposit.amount.toNumber(),
            interestRate: deposit.interest,
            possibleAmount: amount.add(interestAmount).toNumber(),
          };
        }
      }),
    );

    return depositsWithPossibleAmount;
  }
}
