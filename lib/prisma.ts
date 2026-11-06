import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { setDefaultResultOrder } from "node:dns";

if (process.platform === "win32") {
  setDefaultResultOrder("ipv4first");
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured for Prisma.");
}

// Make the current certificate-verification behavior explicit. This avoids
// relying on legacy pg-connection-string aliases such as "require" or "prefer".
const secureDatabaseUrl = new URL(connectionString);
secureDatabaseUrl.searchParams.set("sslmode", "verify-full");

const adapter = new PrismaPg({
  connectionString: secureDatabaseUrl.toString(),
  connectionTimeoutMillis: 30_000,
  idleTimeoutMillis: 10_000,
  max: 10,
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
