import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateDepositDto } from './dto/update-deposit.dto';
import { CreateDepositDto } from './dto/create-deposit.dto';
import { TransactionType } from 'src/constants/enums/transactionType';
import { calculatePossibleDepositAmount } from 'src/utils/deposits/deposits';

@Injectable()
export class DepositsService {
  constructor(private readonly prisma: PrismaService) {}

  async createDeposit(userId: number, dto: CreateDepositDto) {
    const { amount, duration, interest } = dto;
    const account = await this.prisma.account.findFirst({
      where: { userId: userId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (+account.balance < +amount) {
      throw new BadRequestException('Insufficient funds to open a deposit');
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
          type: TransactionType.DEPOSIT_CREATION,
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

    return calculatePossibleDepositAmount(deposits);
  }

  async changeInterest(depositId: number, dto: UpdateDepositDto) {
    return this.prisma.deposit.update({
      where: { id: depositId },
      data: dto,
    });
  }
}
