import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AccountsModule } from './accounts/accounts.module';
import { AuthModule } from './auth/auth.module';
import { CookieModule } from './cookie/cookie.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CurrencyModule } from './currency/currency.module';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { DepositsModule } from './deposits/deposits.module';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    AccountsModule,
    AuthModule,
    CookieModule,
    TransactionsModule,
    CurrencyModule,
    HttpModule,
    ScheduleModule.forRoot(),
    DepositsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
