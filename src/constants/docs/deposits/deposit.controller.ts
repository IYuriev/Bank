import { Role } from '@prisma/client';

export const DEPOSIT_CONTROLLER_DOCS = {
  createDeposit: {
    summary: 'Create a new deposit for the user',
    status: 201,
    description: 'Deposit successfully created',
    authRequired: true,
  },
  getPossibleAmount: {
    summary: 'Get the possible deposit amount with interest',
    status: 200,
    description: 'Returns the possible deposit amount that can be created',
    authRequired: true,
  },
  changeUserInterest: {
    summary: 'Change the interest rate for a deposit',
    status: 200,
    description: 'Interest rate successfully updated',
    authRequired: true,
    role: Role.ADMIN,
  },
};
