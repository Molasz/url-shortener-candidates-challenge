import { PrismaLibSql } from "@prisma/adapter-libsql";
import { config as loadEnv } from "dotenv";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "./generated/prisma/client";

const packageDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(packageDir, "../../..");

loadEnv({ path: resolve(repoRoot, ".env") });

const databaseUrl = process.env.DATABASE_URL ?? "file:./data/dev.db";
const databaseFile = databaseUrl.replace(/^file:/, "");
const databasePath = databaseFile.startsWith("/")
  ? databaseFile
  : resolve(repoRoot, databaseFile);

mkdirSync(dirname(databasePath), { recursive: true });

const adapter = new PrismaLibSql({
  url: `file:${databasePath}`,
});

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
