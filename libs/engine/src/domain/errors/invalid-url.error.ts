import { DomainError } from "./domain-error";

/** Raised when the URL submitted for shortening is not valid. */
export class InvalidUrlError extends DomainError {
  /** Every validation message, most relevant first. */
  readonly issues: readonly string[];

  constructor(message: string, issues: readonly string[] = []) {
    super(message);
    this.issues = issues;
  }
}
