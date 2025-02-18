import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { DepositsService } from './deposits.service';
import { GetUser } from 'src/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('deposits')
@UseGuards(JwtAuthGuard)
export class DepositsController {
  constructor(private readonly depositService: DepositsService) {}

  @Get('possible-amount')
  async getPossibleAmount(@GetUser() userId: number) {
    return await this.depositService.calculateDepositWithInterest(userId);
  }
}
