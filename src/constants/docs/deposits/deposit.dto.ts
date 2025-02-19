export const CREATE_DEPOSIT_DOCS = {
    amount: {
      example: '5000.00',
      description: 'Amount to deposit into the account',
    },
    interest: {
      example: 5,
      description: 'Interest rate on the deposit, must be 0 or higher',
    },
    duration: {
      example: 365,
      description: 'Duration of the deposit in months, must be at least 1 day',
    },
  };
  
  export const UPDATE_DEPOSIT_DOCS = {
    interest: {
      example: 10,
      description: 'Interest rate on the deposit, optional field to update',
    },
  };
  