import * as v from 'valibot';

export enum NewsletterList {
  PL = 15,
  EN = 16,
  PLNew = 18,
}

export enum NewsletterTemplate {
  PL = 707,
  EN = 706,
}

export type BrevoAttributeValue = string | number | boolean;

export interface ContactPayload {
  email: string;
  attributes: Record<string, string | number | boolean>;
  listIds: number[];
  emailBlacklisted: boolean;
  smsBlacklisted: boolean;
}

export interface UpsertContactPayload extends ContactPayload {
  updateEnabled: true;
}

export interface UpdateContactPayload {
  attributes?: Record<string, string | number | boolean>;
  emailBlacklisted?: boolean;
  smsBlacklisted?: boolean;
  listIds?: number[];
  unlinkListIds?: number[];
}

export interface ContactInfo {
  id: number;
  email: string;
  listIds: number[];
}

export interface DoubleOptInPayload {
  email: string;
  attributes?: Record<string, string | number | boolean>;
  includeListIds: number[];
  excludeListIds?: number[];
  templateId: number;
  redirectionUrl: string;
}

export const SubscriberSchema = v.object({
  name: v.pipe(
    v.string(),
    v.trim(),
    v.nonEmpty('Please enter your name.'),
    v.maxLength(254, 'Your name is too long.'),
  ),
  email: v.pipe(
    v.string(),
    v.trim(),
    v.toLowerCase(),
    v.nonEmpty('Please enter your email.'),
    v.email('Invalid email address'),
    v.maxLength(254, 'Your email is too long.'),
  ),
});

export type Subscriber = v.InferOutput<typeof SubscriberSchema>;
