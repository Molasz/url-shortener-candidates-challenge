import { customAlphabet } from "nanoid";
import { prisma } from "./db";
import { Prisma } from "./generated/prisma/client";

export type ShortenedUrlRecord = {
  id: string;
  originalUrl: string;
  shortCode: string;
  clickCount: number;
  createdAt: Date;
  deletedAt: Date | null;
};

const ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const CODE_LENGTH = 8;
const MAX_GENERATION_ATTEMPTS = 5;

const nanoId = customAlphabet(ALPHABET, CODE_LENGTH);

export function generateShortCode(): string {
  return nanoId();
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

export async function createShortenedUrl(
  originalUrl: string,
): Promise<ShortenedUrlRecord> {
  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt++) {
    const shortCode = generateShortCode();

    const existing = await prisma.shortenedUrl.findUnique({
      where: { shortCode },
    });
    if (existing) continue;

    try {
      return await prisma.shortenedUrl.create({
        data: { originalUrl, shortCode },
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) continue;
      throw error;
    }
  }

  throw new Error("Could not generate a unique short code. Please try again.");
}

export async function findActiveUrlByCode(
  shortCode: string,
): Promise<ShortenedUrlRecord | null> {
  return prisma.shortenedUrl.findFirst({
    where: {
      shortCode,
      deletedAt: null,
    },
  });
}
