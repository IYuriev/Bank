import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/auth/jwt-auth.guard';
import { AccountOwnerGuard } from 'src/common/guards/account/account.guard';
import { ApiTags } from '@nestjs/swagger';
import { ApiDocFor } from 'src/common/decorators/api-doc.decorator';
import { ACCOUNT_CONTROLLER_DOCS } from 'src/constants/docs/accounts/account.controller';

@ApiTags('Accounts')
@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post('open')
  @ApiDocFor(ACCOUNT_CONTROLLER_DOCS.openAccount)
  async openAccount(
    @Body() createAccountDto: CreateAccountDto,
    @GetUser() userId: number,
  ) {
    return this.accountsService.createAccount(createAccountDto, userId);
  }

  @Delete(':accountId/close')
  @UseGuards(AccountOwnerGuard)
  @ApiDocFor(ACCOUNT_CONTROLLER_DOCS.deleteAccount)
  async deleteAccount(
    @Param('accountId') accountId: string,
    @Res() res: Response,
  ) {
    await this.accountsService.closeAccount(accountId);
    return res.send({ message: 'Deleted successfully' });
  }

  @Get(':accountId/balance')
  @UseGuards(AccountOwnerGuard)
  @ApiDocFor(ACCOUNT_CONTROLLER_DOCS.getBalance)
  async getBalance(
    @Query('currency') currency: string,
    @Param('accountId') accountId: string,
  ) {
    return this.accountsService.getBalance(accountId, currency);
  }
}
