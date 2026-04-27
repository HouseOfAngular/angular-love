import * as v from 'valibot';

export const enum NewsletterList {
  PL = 15,
  EN = 16,
  PLNew = 18,
}

export const enum NewsletterTemplate {
  PL = 42,
  EN = 43,
}

export interface NewContactDto {
  email: string;
  attributes: Record<string, string>;
  listIds: number[];
  emailBlacklisted: boolean;
  smsBlacklisted: boolean;
}

export interface Template {
  sender: {
    id: number;
  };
  subject: string;
  htmlContent: string;
}

export interface SendEmailDto {
  sender: {
    id: number;
  };
  subject: string;
  htmlContent: string;
  to: {
    email: string;
  }[];
}

export const SubscriberSchema = v.object({
  name: v.pipe(
    v.string(),
    v.nonEmpty('Please enter your name.'),
    v.maxLength(254, 'Your name is too long.'),
  ),
  email: v.pipe(
    v.string(),
    v.nonEmpty('Please enter your email.'),
    v.email('Invalid email address'),
    v.maxLength(254, 'Your email is too long.'),
  ),
});

export type Subscriber = v.InferInput<typeof SubscriberSchema>;
