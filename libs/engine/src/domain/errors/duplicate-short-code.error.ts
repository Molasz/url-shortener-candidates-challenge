import { DomainError } from "./domain-error";

/**
 * Raised by a repository when a short code is already taken.
 *
 * It keeps the application layer independent from infrastructure details
 * (e.g. Prisma's unique-constraint error code): the repository translates
 * the storage-specific failure into this domain-level signal.
 */
export class DuplicateShortCodeError extends DomainError {
  readonly shortCode: string;

  constructor(shortCode: string) {
    super(`Short code "${shortCode}" is already in use`);
    this.shortCode = shortCode;
  }
}
