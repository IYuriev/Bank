import { Decimal } from "@prisma/client/runtime/library";

export class TransferDto {
  amount: Decimal;
  toAccountId: number;
}
