import { IsInt, IsPositive, IsNotEmpty, Matches } from 'class-validator';
import { AMOUNT } from 'src/constants/amount/amount';

export class TransferDto {
  @IsNotEmpty()
  @Matches(AMOUNT.MATCHES, {
    message: 'Amount must be greater than 0',
  })
  amount: string;

  @IsInt({ message: 'toAccountId must be an integer' })
  @IsPositive({ message: 'toAccountId must be a positive number' })
  toAccountId: number;
}
