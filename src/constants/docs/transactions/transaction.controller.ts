import { Role } from '@prisma/client';

export const TRANSACTION_CONTROLLER_DOCS = {
  contribution: {
    summary: 'Make a contribution to the account',
    status: 200,
    description: 'Contribution successfully added',
    authRequired: true,
    role: Role.USER,
  },
  withdraw: {
    summary: 'Withdraw funds from the account',
    status: 200,
    description: 'Withdrawal successfully completed',
    authRequired: true,
    role: Role.USER,
  },
  transfer: {
    summary: 'Transfer funds between accounts',
    status: 200,
    description: 'Funds successfully transferred',
    authRequired: true,
    role: Role.USER,
  },
  getUserContributions: {
    summary: 'Get the user’s contribution history',
    status: 200,
    description: 'Returns the user’s contribution history',
    authRequired: true,
    role: Role.USER,
  },
};
