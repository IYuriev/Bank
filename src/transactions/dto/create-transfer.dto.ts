import { Decimal } from '@prisma/client/runtime/library';
import { IsDecimal, Min, IsInt, IsPositive } from 'class-validator';

export class TransferDto {
  @IsDecimal({}, { message: 'Amount must be a valid decimal number' })
  @Min(0.01, { message: 'Amount must be greater than zero' })
  amount: Decimal;

  @IsInt({ message: 'toAccountId must be an integer' })
  @IsPositive({ message: 'toAccountId must be a positive number' })
  toAccountId: number;
}
