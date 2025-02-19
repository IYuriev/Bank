import { Decimal } from '@prisma/client/runtime/library';

export interface IAccount {
  id: number;
  currency: string;
  balance: Decimal;
}
