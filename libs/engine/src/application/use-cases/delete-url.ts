import { UrlNotFoundError } from "../../domain/errors/url-not-found.error";
import type { UrlRepository } from "../../domain/repositories/url-repository";

/**
 * Soft-deletes a shortened URL: the row is kept, but marked with deletedAt so
 * it disappears from listings and stops redirecting.
 *
 * @throws {UrlNotFoundError} when there is no active URL with that code.
 */
export class DeleteUrlUseCase {
  constructor(private readonly urls: UrlRepository) {}

  async execute(shortCode: string): Promise<void> {
    const deleted = await this.urls.softDeleteByCode(shortCode);
    if (!deleted) {
      throw new UrlNotFoundError(shortCode);
    }
  }
}
