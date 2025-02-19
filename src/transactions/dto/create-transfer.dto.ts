import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsNotEmpty, Matches } from 'class-validator';
import { AMOUNT } from 'src/constants/amount/amount';
import { CREATE_TRANSFER_DOCS } from 'src/constants/docs/transactions/transaction.dto';

export class TransferDto {
  @ApiProperty(CREATE_TRANSFER_DOCS.amount)
  @IsNotEmpty()
  @Matches(AMOUNT.MATCHES, {
    message: 'Amount must be greater than 0',
  })
  amount: string;

  @ApiProperty(CREATE_TRANSFER_DOCS.toAccountId)
  @IsInt({ message: 'toAccountId must be an integer' })
  @IsPositive({ message: 'toAccountId must be a positive number' })
  toAccountId: number;
}
