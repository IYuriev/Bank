import { IsEnum, IsNotEmpty } from 'class-validator';
import { Currency } from 'src/constants/enums/currency';

export class CreateAccountDto {
  @IsNotEmpty({ message: 'Currency is required' })
  @IsEnum(Currency, { message: 'Invalid currency type' })
  currency: Currency;
}
