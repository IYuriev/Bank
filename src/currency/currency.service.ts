import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class CurrencyService {
  private apiUrl: string;

  constructor(private readonly httpService: HttpService) {
    this.apiUrl = String(process.env.EXCHANGE_RATES_API_URL);
  }

  async getExchangeRate(
    fromCurrency: string,
    toCurrency: string,
  ): Promise<number> {
    const response = await lastValueFrom(
      this.httpService.get(`${this.apiUrl}${fromCurrency}`),
    );
    const rates = response.data.rates;
    return rates[toCurrency] || null;
  }

  async convertAmount(
    amount: Decimal,
    fromCurrency: string,
    toCurrency: string,
  ): Promise<Decimal> {
    if (fromCurrency === toCurrency) {
      return amount;
    }
    const rate = await this.getExchangeRate(fromCurrency, toCurrency);
    if (!rate) {
      throw new Error(
        `Не вдалося знайти курс для ${fromCurrency} -> ${toCurrency}`,
      );
    }
    return amount.mul(rate);
  }
}
