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
