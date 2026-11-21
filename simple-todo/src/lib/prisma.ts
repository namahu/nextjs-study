import "dotenv/config";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { PrismaClient } from "../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
}

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString && process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) {
    throw new Error("DATABASE_URLが未設定です。")
  }
  const adapter = new PrismaPg({ 
    connectionString,
    max: 3,
    idleTimeoutMillis: 20000,
    connectionTimeoutMillis: 10000
  });
  return new PrismaClient({ adapter });
};


export const prisma = globalForPrisma.prisma ?? createPrismaClient();
globalForPrisma.prisma = prisma;
