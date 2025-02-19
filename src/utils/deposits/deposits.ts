import { Decimal } from '@prisma/client/runtime/library';
import { Deposit } from 'src/constants/types/deposit';

export function calculatePossibleDepositAmount(deposits: Deposit[]) {
  return deposits
    .map((deposit) => {
      if (deposit.endDate > new Date()) {
        const { amount, interest } = deposit;

        const interestAmount = amount.mul(interest).div(new Decimal(100));

        return {
          id: deposit.id,
          amount: deposit.amount.toNumber(),
          interest: deposit.interest,
          possibleAmount: amount.add(interestAmount).toNumber(),
        };
      }
    })
    .filter(Boolean);
}
