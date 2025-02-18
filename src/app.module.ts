import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AccountsModule } from './accounts/accounts.module';
import { AuthModule } from './auth/auth.module';
import { CookieModule } from './cookie/cookie.module';
import { TransactionsModule } from './transactions/transactions.module';
import { CurrencyModule } from './currency/currency.module';
import { HttpModule } from '@nestjs/axios';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
