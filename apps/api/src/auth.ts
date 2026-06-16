import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma/clients.js';

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!googleClientId) {
  throw new Error('GOOGLE_CLIENT_ID is not defined');
}

if (!googleClientSecret) {
  throw new Error('GOOGLE_CLIENT_SECRET is not defined');
}

export const auth = betterAuth({
  basePath: '/api/auth',

  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,

  trustedOrigins: [process.env.WEB_ORIGIN ?? 'http://localhost:3000'],

  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google'],
    },
  },

  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      allowDangerousEmailAccountLinking: true,
    },
  },
});
