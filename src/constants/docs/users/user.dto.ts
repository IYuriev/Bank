export const USER_DTO_DOCS = {
    email: {
      example: 'user@example.com',
      description: 'User email address',
      required: true,
    },
    password: {
      example: 'strongPass123',
      description: 'User password (at least 8 characters long)',
      minLength: 8,
      required: true,
    },
  };
  