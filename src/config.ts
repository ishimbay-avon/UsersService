import dotenv from 'dotenv';

dotenv.config();

export const {
  PORT = 3000,
  DB_ADDRESS = 'mongodb://127.0.0.1:27017/UsersService',
  AUTH_ACCESS_TOKEN_SECRET = 'super-secret-access-key',
  AUTH_REFRESH_TOKEN_SECRET = 'super-secret-refresh-key',
} = process.env;
