import { Pool } from "pg";

if (process.env.VERCEL_ENV !== "preview") {
  console.log("Skipping Preview-only wallet enum repair outside Vercel Preview.");
  process.exit(0);
}

const connectionString =
  process.env.PRISMA_DATABASE_URL || process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Preview database connection is not configured.");
}

const pool = new Pool({ connectionString, max: 1 });

try {
  await pool.query(
    'ALTER TYPE "TransactionType" ADD VALUE IF NOT EXISTS \'WALLET_DEPOSIT\''
  );
  console.log("Preview database: WALLET_DEPOSIT enum value is available.");
} finally {
  await pool.end();
}
