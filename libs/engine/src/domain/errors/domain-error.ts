/**
 * Base class for expected business failures.
 *
 * Domain errors describe *what* went wrong; translating them into HTTP status
 * codes is the responsibility of the route layer, so no HTTP concern leaks
 * into the domain.
 */
export abstract class DomainError extends Error {
  protected constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}
