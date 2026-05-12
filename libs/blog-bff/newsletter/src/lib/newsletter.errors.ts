export type NewsletterErrorKind =
  | 'validation'
  | 'upstream_4xx'
  | 'upstream_5xx'
  | 'network';

export class NewsletterError extends Error {
  constructor(
    readonly kind: NewsletterErrorKind,
    readonly status: number | null,
    message: string,
  ) {
    super(message);
    this.name = 'NewsletterError';
  }
}
