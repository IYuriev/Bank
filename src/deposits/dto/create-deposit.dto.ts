import { Decimal } from '@prisma/client/runtime/library';

export class CreateDepositDto {
  amount: Decimal;
  interest: number;
  duration: number;
}
