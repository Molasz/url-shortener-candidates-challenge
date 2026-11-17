import type { ShortenedUrl } from "../../domain/entities/shortened-url";
import { UrlNotFoundError } from "../../domain/errors/url-not-found.error";
import type { UrlRepository } from "../../domain/repositories/url-repository";

/**
 * Resolves a short code to its active URL and records the visit.
 *
 * @throws {UrlNotFoundError} when the code does not exist or was soft-deleted.
 */
export class RedirectUrlUseCase {
  constructor(private readonly urls: UrlRepository) {}

  async execute(shortCode: string): Promise<ShortenedUrl> {
    const shortenedUrl = await this.urls.findActiveByCode(shortCode);
    if (!shortenedUrl) {
      throw new UrlNotFoundError(shortCode);
    }

    await this.urls.incrementClickCount(shortenedUrl.id);

    return {
      ...shortenedUrl,
      clickCount: shortenedUrl.clickCount + 1,
    };
  }
}
