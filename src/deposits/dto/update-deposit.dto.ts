import { PartialType } from '@nestjs/mapped-types';
import { CreateDepositDto } from './create-deposit.dto';
import { IsNumber, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UPDATE_DEPOSIT_DOCS } from 'src/constants/docs/deposits/deposit.dto';

export class UpdateDepositDto extends PartialType(CreateDepositDto) {
  @ApiProperty(UPDATE_DEPOSIT_DOCS.interest)
  @IsOptional()
  @IsNumber({}, { message: 'Interest must be a valid number' })
  @Min(0, { message: 'Interest rate must be 0 or higher' })
  interest?: number;
}
