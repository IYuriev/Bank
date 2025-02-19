import { PartialType } from '@nestjs/mapped-types';
import { CreateDepositDto } from './create-deposit.dto';
import { IsNumber, Min, IsOptional } from 'class-validator';

export class UpdateDepositDto extends PartialType(CreateDepositDto) {
  @IsOptional()
  @IsNumber({}, { message: 'Interest must be a valid number' })
  @Min(0, { message: 'Interest rate must be 0 or higher' })
  interest?: number;
}
