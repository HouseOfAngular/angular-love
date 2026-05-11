import { assertMethod, createError, defineEventHandler, readBody } from 'h3';
import * as v from 'valibot';

import {
  NewsletterClient,
  NewsletterError,
  NewsletterList,
  NewsletterTemplate,
  Subscriber,
  SubscriberSchema,
} from '@angular-love/blog-bff/newsletter/api';
import { Lang } from '@angular-love/contracts/articles';

import { getRequiredEnv } from '../../../utils/env';
import { getLang } from '../../../utils/lang';

const MAX_BODY_BYTES = 4 * 1024;

interface DoiConfig {
  includeListIds: number[];
  templateId: number;
  redirectionUrl: string;
}

export default defineEventHandler(async (event) => {
  assertMethod(event, 'POST');

  const subscriber = await parseSubscriber(event);
  const lang = getLang(event, true);
  const doiConfig = doiConfigForLang(lang, event);

  const client = new NewsletterClient(
    getRequiredEnv(event, 'BREVO_API_URL'),
    getRequiredEnv(event, 'BREVO_API_KEY'),
  );

  try {
    await client.requestDoubleOptIn({
      email: subscriber.email,
      attributes: { FIRSTNAME: subscriber.name },
      includeListIds: doiConfig.includeListIds,
      templateId: doiConfig.templateId,
      redirectionUrl: doiConfig.redirectionUrl,
    });
    return { success: true };
  } catch (err) {
    throw toHttpError(err);
  }
});

async function parseSubscriber(
  event: Parameters<typeof readBody>[0],
): Promise<Subscriber> {
  const rawBody = await readBody(event, { maxSize: MAX_BODY_BYTES } as never);
  const result = v.safeParse(SubscriberSchema, rawBody);
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid subscriber data.',
    });
  }
  return result.output;
}

function doiConfigForLang(
  lang: Lang,
  event: Parameters<typeof readBody>[0],
): DoiConfig {
  if (lang === 'pl') {
    return {
      includeListIds: [NewsletterList.PLNew],
      templateId: NewsletterTemplate.PL,
      redirectionUrl: 'https://angular.love',
    };
  }
  return {
    includeListIds: [NewsletterList.EN],
    templateId: NewsletterTemplate.EN,
    redirectionUrl: 'https://angular.love',
  };
}

function toHttpError(err: unknown) {
  if (err instanceof NewsletterError) {
    console.error('[Newsletter API]', {
      kind: err.kind,
      status: err.status,
      message: err.message,
    });
    return createError({
      statusCode: 502,
      statusMessage: 'Bad Gateway',
      message: 'Newsletter service is currently unavailable.',
    });
  }
  console.error('[Newsletter API] Unexpected error');
  return createError({
    statusCode: 500,
    statusMessage: 'Internal Server Error',
    message: 'Unexpected error.',
  });
}
