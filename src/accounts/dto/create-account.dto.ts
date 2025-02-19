import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { CREATE_ACCOUNT_DOCS } from 'src/constants/docs/accounts/account.dto';
import { Currency } from 'src/constants/enums/currency';

export class CreateAccountDto {
  @ApiProperty(CREATE_ACCOUNT_DOCS.currency)
  @IsNotEmpty({ message: 'Currency is required' })
  @IsEnum(Currency, { message: 'Invalid currency type' })
  currency: Currency;
}
