import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Matches, Min } from 'class-validator';
import { AMOUNT } from 'src/constants/amount/amount';
import { CREATE_DEPOSIT_DOCS } from 'src/constants/docs/deposits/deposit.dto';

export class CreateDepositDto {
  @ApiProperty(CREATE_DEPOSIT_DOCS.amount)
  @IsNotEmpty()
  @Matches(AMOUNT.MATCHES, {
    message: 'Amount must be greater than 0',
  })
  amount: string;

  @ApiProperty(CREATE_DEPOSIT_DOCS.interest)
  @IsNumber({}, { message: 'Interest must be a valid number' })
  @Min(0, { message: 'Interest rate must be 0 or higher' })
  interest: number;

  @ApiProperty(CREATE_DEPOSIT_DOCS.duration)
  @IsNumber({}, { message: 'Duration must be a valid number' })
  @Min(1, { message: 'Duration must be at least 1 day' })
  duration: number;
}
