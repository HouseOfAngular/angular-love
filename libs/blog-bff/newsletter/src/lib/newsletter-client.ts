import { NewContactDto } from './models';

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

  getContact(email: string): Promise<{ listIds: number[]; id: number }> {
    return this.request<{ listIds: number[]; id: number }>(
      `contacts/${encodeURIComponent(email)}`,
    );
  }

  updateContact(id: number, contact: NewContactDto): Promise<void> {
    return this.request<void>(`contacts/${id}`, {
      method: 'PUT',
      body: { ...contact, identifierType: 'contact_id' },
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
      const error = new Error(errorBody.message || 'API request failed');
      Object.assign(error, errorBody);
      throw error;
    }

    if (res.status === 204) {
      return {} as T;
    }

    return await res.json();
  }
}
