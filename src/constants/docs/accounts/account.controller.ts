export const ACCOUNT_CONTROLLER_DOCS = {
  openAccount: {
    summary: 'Open a new account for the user',
    status: 201,
    description: 'Account successfully created',
    authRequired: true,
  },
  deleteAccount: {
    summary: 'Close an existing account',
    status: 200,
    description: 'Account successfully deleted',
    authRequired: true,
  },
  getBalance: {
    summary: 'Get account balance',
    status: 200,
    description: 'Returns the balance of the specified account',
    authRequired: true,
  },
};
