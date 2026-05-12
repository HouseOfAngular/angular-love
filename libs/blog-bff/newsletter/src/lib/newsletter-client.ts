import {
  ContactInfo,
  DoubleOptInPayload,
  UpdateContactPayload,
} from './models';
import { NewsletterError } from './newsletter.errors';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, unknown>;
  signal?: AbortSignal;
}

const DEFAULT_TIMEOUT_MS = 5_000;

export class NewsletterClient {
  constructor(
    private readonly baseUrl: string,
    private readonly apiKey: string,
    private readonly timeoutMs = DEFAULT_TIMEOUT_MS,
  ) {}

  /**
   * Look up a contact by email or contact_id.
   * Brevo: GET /contacts/{identifier}.
   */
  getContact(identifier: string | number): Promise<ContactInfo> {
    const id =
      typeof identifier === 'number'
        ? String(identifier)
        : encodeURIComponent(identifier);
    return this.request<ContactInfo>(`contacts/${id}`);
  }

  /**
   * Apply targeted changes to an existing contact.
   * Use this when you specifically need to remove from lists (unlinkListIds),
   * change blacklist status, or update attributes without other side effects.
   *
   * Brevo: PUT /contacts/{identifier}.
   */
  async updateContact(id: number, patch: UpdateContactPayload): Promise<void> {
    await this.request<void>(`contacts/${id}`, {
      method: 'PUT',
      body: { ...patch, identifierType: 'contact_id' },
    });
  }

  async requestDoubleOptIn(payload: DoubleOptInPayload): Promise<void> {
    await this.request('contacts/doubleOptinConfirmation', {
      method: 'POST',
      body: payload,
    });
  }

  private async request<T>(
    path: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    let response: Response;
    try {
      console.log(JSON.stringify(options.body));
      response = await fetch(`${this.baseUrl}${path}`, {
        method: options.method ?? 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'api-key': this.apiKey,
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: options.signal ?? controller.signal,
      });
    } catch (cause) {
      throw new NewsletterError(
        'network',
        null,
        cause instanceof Error ? cause.message : 'Network failure',
      );
    } finally {
      clearTimeout(timer);
    }

    if (response.ok) {
      return response.status === 204
        ? ({} as T)
        : ((await response.json()) as T);
    }

    const rawText = await response.text().catch(() => '');
    throw new NewsletterError(
      response.status >= 500 ? 'upstream_5xx' : 'upstream_4xx',
      response.status,
      safeExtractMessage(rawText),
    );
  }
}

function safeExtractMessage(rawText: string): string {
  if (!rawText) return 'Upstream request failed';
  try {
    const parsed = JSON.parse(rawText) as { message?: unknown };
    return typeof parsed.message === 'string'
      ? parsed.message
      : 'Upstream request failed';
  } catch {
    return 'Upstream request failed';
  }
}
