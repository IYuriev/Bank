import { Decimal } from '@prisma/client/runtime/library';
import { IsDecimal, Min } from 'class-validator';

export class TransactionDto {
  @IsDecimal({}, { message: 'Amount must be a valid decimal number' })
  @Min(0.01, { message: 'Amount must be greater than zero' })
  amount: Decimal;
}
