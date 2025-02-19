import { Decimal } from '@prisma/client/runtime/library';
import { IsDecimal, IsNumber, Min } from 'class-validator';

export class CreateDepositDto {
  @IsDecimal({}, { message: 'Amount must be a valid decimal number' })
  @Min(0.01, { message: 'Amount must be greater than 0' })
  amount: Decimal;

  @IsNumber({}, { message: 'Interest must be a valid number' })
  @Min(0, { message: 'Interest rate must be 0 or higher' })
  interest: number;

  @IsNumber({}, { message: 'Duration must be a valid number' })
  @Min(1, { message: 'Duration must be at least 1 day' })
  duration: number;
}
