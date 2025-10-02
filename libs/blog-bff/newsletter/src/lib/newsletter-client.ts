import { NewContactDto, SendEmailDto, Template } from './models';

export class NewsletterClient {
  constructor(
    private _baseUrl: string,
    private _apiKey: string,
  ) {}

  createContact(contact: NewContactDto): Promise<void> {
    return this.request(`contacts`, {
      method: 'POST',
      body: contact,
    });
  }

  getContact(email: string): Promise<{ listIds: number[] }> {
    return this.request<{ listIds: number[] }>(
      `contacts/${encodeURIComponent(email)}`,
    );
  }

  updateContact(contact: NewContactDto): Promise<void> {
    return this.request<void>(`contacts/${encodeURIComponent(contact.email)}`, {
      method: 'PUT',
      body: contact,
    });
  }

  private async request<T>(
    url: string,
    options?: { method?: 'GET' | 'POST' | 'PUT'; body?: Record<string, any> },
  ): Promise<T> {
    const res = await fetch(`${this._baseUrl}${url}`, {
      method: options?.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        'api-key': this._apiKey,
      },
      ...(options?.body && { body: JSON.stringify(options.body) }),
    });

    if (!res.ok) {
      const errorBody = await res.json();
      throw new Error(errorBody);
    }

    if (res.status === 204) {
      return {} as T;
    }

    return await res.json();
  }
}
