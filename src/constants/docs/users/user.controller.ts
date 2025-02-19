import { Role } from '@prisma/client';

export const USER_CONTROLLER_DOCS = {
  registration: {
    summary: 'Register a new user',
    status: 201,
    description: 'User registered successfully',
  },
  getAllUsers: {
    summary: 'Get all users',
    status: 200,
    description: 'Returns a list of all users',
    authRequired: true,
    role: Role.ADMIN,
  },
  getContributionHistory: {
    summary: 'Get contribution history of a user',
    status: 200,
    description: 'Returns the contribution history of the specified user',
    authRequired: true,
    role: Role.ADMIN,
  },
  blockUser: {
    summary: 'Block user',
    status: 200,
    description: 'User status updated',
    authRequired: true,
    role: Role.ADMIN,
  },
  unblockUser: {
    summary: 'Unblock user',
    status: 200,
    description: 'User status updated',
    authRequired: true,
    role: Role.ADMIN,
  },
};
