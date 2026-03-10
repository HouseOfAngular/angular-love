import { createError, defineEventHandler, readRawBody } from 'h3';
import { useRuntimeConfig } from 'nitropack/runtime';
import * as v from 'valibot';

import { getLang } from '../../../utils/lang';

// NewsletterList and NewsletterClient are internal to the BFF newsletter lib
// and not exported from its public index. Values/logic are inlined here.

// Inlined from `libs/blog-bff/newsletter/src/lib/models.ts`
const NewsletterList = {
  PL: 15,
  EN: 16,
  PLNew: 18,
} as const;

interface NewContactDto {
  email: string;
  listIds: number[];
  emailBlacklisted: boolean;
  smsBlacklisted: boolean;
}

// Inlined from `libs/blog-bff/newsletter/src/lib/newsletter-client.ts`
class NewsletterClient {
  constructor(
    private _baseUrl: string,
    private _apiKey: string,
  ) {}

  createContact(contact: NewContactDto): Promise<void> {
    return this._request(`contacts`, { method: 'POST', body: contact });
  }

  getContact(email: string): Promise<{ listIds: number[] }> {
    return this._request<{ listIds: number[] }>(
      `contacts/${encodeURIComponent(email)}`,
    );
  }

  updateContact(contact: NewContactDto): Promise<void> {
    return this._request<void>(
      `contacts/${encodeURIComponent(contact.email)}`,
      { method: 'PUT', body: contact },
    );
  }

  private async _request<T>(
    url: string,
    options?: { method?: 'GET' | 'POST' | 'PUT'; body?: Record<string, unknown> },
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

const EmailSchema = v.pipe(
  v.string(),
  v.nonEmpty('Please enter your email.'),
  v.email('Invalid email address'),
  v.maxLength(254, 'Your email is too long.'),
);

export default defineEventHandler(async (event) => {
  // CSRF middleware (hono/csrf) is intentionally dropped: the Analog app
  // serves both frontend and API from the same origin, so same-origin
  // requests are safe by default.

  // Lang is required for newsletter (throwOnInvalid = true), matching langMw(true)
  const lang = getLang(event, true);
  const config = useRuntimeConfig(event);
  const BREVO_API_KEY = config['BREVO_API_KEY'] as string;
  const BREVO_API_URL = config['BREVO_API_URL'] as string;

  const newSubscriber = await readRawBody(event);

  const listIds: number[] =
    lang === 'pl'
      ? [NewsletterList.PL, NewsletterList.PLNew]
      : [NewsletterList.EN];

  try {
    const parsedEmail = v.parse(EmailSchema, newSubscriber);
    const client = new NewsletterClient(BREVO_API_URL, BREVO_API_KEY);

    try {
      const existingContact = await client.getContact(parsedEmail);
      const mergedListIds = Array.from(
        new Set([...existingContact.listIds, ...listIds]),
      );
      const alreadySubscribed = listIds.some((listId) =>
        existingContact.listIds.includes(listId),
      );

      if (!alreadySubscribed) {
        await client.updateContact({
          email: parsedEmail,
          emailBlacklisted: false,
          smsBlacklisted: false,
          listIds: mergedListIds,
        });
      }
    } catch (err) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        (err as Record<string, unknown>)['code'] === 'document_not_found'
      ) {
        await client.createContact({
          email: parsedEmail,
          emailBlacklisted: false,
          smsBlacklisted: false,
          listIds,
        });
      } else {
        throw err;
      }
    }

    return { success: true };
  } catch (e) {
    if (e instanceof v.ValiError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email validation error',
      });
    }
    throw createError({ statusCode: 400, statusMessage: 'Unknown error' });
  }
});
