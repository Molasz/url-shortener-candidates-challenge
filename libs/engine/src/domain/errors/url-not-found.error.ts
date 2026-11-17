import { DomainError } from "./domain-error";

/** Raised when no active shortened URL exists for a short code. */
export class UrlNotFoundError extends DomainError {
  readonly shortCode: string;

  constructor(shortCode: string) {
    super(`No active URL found for short code "${shortCode}"`);
    this.shortCode = shortCode;
  }
}
