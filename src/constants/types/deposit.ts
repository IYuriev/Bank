import { Decimal } from '@prisma/client/runtime/library';

export interface Deposit {
  id: number;
  amount: Decimal;
  interest: Decimal;
  duration: number;
  startDate: Date;
  endDate: Date;
}
