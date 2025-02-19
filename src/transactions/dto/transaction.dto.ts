import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';
import { TRANSFACTION_DTO_DOCS } from 'src/constants/docs/transactions/transaction.dto';

export class TransactionDto {
  @ApiProperty(TRANSFACTION_DTO_DOCS.amount)
  @IsNumber({}, { message: 'Amount must be a number' })
  @Min(0.01, { message: 'Amount must be greater than zero' })
  amount: number;
}
