import { IsNotEmpty, IsNumber, Matches, Min } from 'class-validator';
import { AMOUNT } from 'src/constants/amount/amount';

export class CreateDepositDto {
  @IsNotEmpty()
  @Matches(AMOUNT.MATCHES, {
    message: 'Amount must be greater than 0',
  })
  amount: string;

  @IsNumber({}, { message: 'Interest must be a valid number' })
  @Min(0, { message: 'Interest rate must be 0 or higher' })
  interest: number;

  @IsNumber({}, { message: 'Duration must be a valid number' })
  @Min(1, { message: 'Duration must be at least 1 day' })
  duration: number;
}
