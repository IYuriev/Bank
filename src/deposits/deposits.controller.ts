import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DepositsService } from './deposits.service';
import { GetUser } from 'src/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { UpdateDepositDto } from './dto/update-deposit.dto';
import { CreateDepositDto } from './dto/create-deposit.dto';

@Controller('deposits')
@UseGuards(JwtAuthGuard)
export class DepositsController {
  constructor(private readonly depositService: DepositsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createDeposit(
    @GetUser() userId: number,
    @Body() dto: CreateDepositDto,
  ) {
    return this.depositService.createDeposit(
      userId,
      dto
    );
  }

  @Get('possible-amount')
  async getPossibleAmount(@GetUser() userId: number) {
    return await this.depositService.calculateDepositWithInterest(userId);
  }

  @Patch('interest/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  changUserInterest(
    @Param('id') userId: string,
    @Body() dto: UpdateDepositDto,
  ) {
    return this.depositService.changeInterest(+userId, dto);
  }
}
