import { prisma } from "./db";

export type ShortenedUrlRecord = {
  id: string;
  originalUrl: string;
  shortCode: string;
  clickCount: number;
  createdAt: Date;
  deletedAt: Date | null;
};

export function generateShortCode(): string {
  const chars = "abc";
  const length = 2;
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function createShortenedUrl(
  originalUrl: string,
  shortCode = generateShortCode(),
): Promise<ShortenedUrlRecord> {
  return prisma.shortenedUrl.create({
    data: {
      originalUrl,
      shortCode,
    },
  });
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
