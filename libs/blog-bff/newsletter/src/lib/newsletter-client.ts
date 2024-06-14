import { NewContactDto, SendEmailDto, Template } from './models';

export class NewsletterClient {
  constructor(
    private _baseUrl: string,
    private _apiKey: string,
  ) {}

  getTemplate(templateId: number): Promise<Template> {
    return this.request<Template>(`smtp/templates/${templateId}`);
  }

  sendEmail(dto: SendEmailDto): Promise<void> {
    return this.request<void>(`smtp/email`, {
      method: 'POST',
      body: dto,
    });
  }

  createContact(contact: NewContactDto): Promise<void> {
    return this.request(`contacts`, {
      method: 'POST',
      body: contact,
    });
  }

  private async request<T>(
    url: string,
    options?: { method?: 'GET' | 'POST'; body?: Record<string, any> },
  ): Promise<T> {
    const res = await fetch(`${this._baseUrl}${url}`, {
      method: options?.method ?? 'GET',
      headers: {
        'Content-Type': 'application/json',
        'api-key': this._apiKey,
      },
      ...(options?.body && { body: JSON.stringify(options.body) }),
    });
    return await res.json();
  }
}
