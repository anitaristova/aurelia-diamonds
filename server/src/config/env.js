import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.SERVER_PORT) || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/aurelia',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  admin: {
    email: process.env.ADMIN_EMAIL || '',
    password: process.env.ADMIN_PASSWORD || '',
  },
};
