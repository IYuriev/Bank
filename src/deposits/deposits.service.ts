import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateDepositDto } from './dto/update-deposit.dto';
import { CreateDepositDto } from './dto/create-deposit.dto';

@Injectable()
export class DepositsService {
  constructor(private readonly prisma: PrismaService) {}

  async createDeposit(userId: number, dto: CreateDepositDto) {
    const { amount, duration, interest } = dto;
    const account = await this.prisma.account.findFirst({
      where: { userId: userId },
    });

    if (!account) {
      throw new NotFoundException('Рахунок не знайдено');
    }

    if (account.balance < amount) {
      throw new BadRequestException(
        'Недостатньо коштів для відкриття депозиту',
      );
    }

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + duration);

    return this.prisma.$transaction([
      this.prisma.account.update({
        where: { id: account.id },
        data: { balance: { decrement: amount } },
      }),

      this.prisma.deposit.create({
        data: {
          amount,
          interest,
          duration,
          startDate: new Date(),
          endDate,
          userId,
          accountId: account.id,
        },
      }),

      this.prisma.transaction.create({
        data: {
          type: 'deposit_creation',
          amount,
          accountId: account.id,
          userId,
        },
      }),
    ]);
  }

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

  async changeInterest(depositId: number, dto: UpdateDepositDto) {
    return this.prisma.deposit.update({
      where: { id: depositId },
      data: dto,
    });
  }
}
