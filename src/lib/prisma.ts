import { Environments } from '@/constants/enums';
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const db = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === Environments.DEV ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== Environments.PROD) global.prisma = db;