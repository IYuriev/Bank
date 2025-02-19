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
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/auth/jwt-auth.guard';
import { AdminGuard } from 'src/common/guards/admin/admin.guard';
import { UpdateDepositDto } from './dto/update-deposit.dto';
import { CreateDepositDto } from './dto/create-deposit.dto';

@Controller('deposits')
@UseGuards(JwtAuthGuard)
export class DepositsController {
  constructor(private readonly depositService: DepositsService) {}

  @Post('create')
  async createDeposit(
    @GetUser() userId: number,
    @Body() dto: CreateDepositDto,
  ) {
    return this.depositService.createDeposit(userId, dto);
  }

  @Get('possible-amount')
  async getPossibleAmount(@GetUser() userId: number) {
    return await this.depositService.calculateDepositWithInterest(userId);
  }

  @Patch(':id/interest')
  @UseGuards(AdminGuard)
  changeUserInterest(
    @Param('id') userId: string,
    @Body() dto: UpdateDepositDto,
  ) {
    return this.depositService.changeInterest(+userId, dto);
  }
}
