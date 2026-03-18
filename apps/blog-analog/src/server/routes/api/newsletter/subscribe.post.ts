import { assertMethod, createError, defineEventHandler, readRawBody } from 'h3';
import * as v from 'valibot';

import {
  EmailSchema,
  NewsletterClient,
  NewsletterList,
} from '@angular-love/blog-bff/newsletter/api';

import { getRequiredEnv } from '../../../utils/env';
import { getLang } from '../../../utils/lang';

export default defineEventHandler(async (event) => {
  assertMethod(event, 'POST');

  const lang = getLang(event, true);
  const BREVO_API_KEY = getRequiredEnv(event, 'BREVO_API_KEY');
  const BREVO_API_URL = getRequiredEnv(event, 'BREVO_API_URL');

  const rawBody = await readRawBody(event);
  let parsedEmail: string;

  try {
    parsedEmail = v.parse(EmailSchema, rawBody);
  } catch (err) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid email format provided.',
    });
  }

  const listIds: number[] =
    lang === 'pl'
      ? [NewsletterList.PL, NewsletterList.PLNew]
      : [NewsletterList.EN];

  const client = new NewsletterClient(BREVO_API_URL, BREVO_API_KEY);

  try {
    const existingContact = await client.getContact(parsedEmail);

    const isMissingLists = listIds.some(
      (listId) => !existingContact.listIds.includes(listId),
    );

    if (isMissingLists) {
      const mergedListIds = Array.from(
        new Set([...existingContact.listIds, ...listIds]),
      );

      await client.updateContact({
        email: parsedEmail,
        emailBlacklisted: false,
        smsBlacklisted: false,
        listIds: mergedListIds,
      });
    }

    return { success: true };
  } catch (err: any) {
    if (err?.code === 'document_not_found') {
      try {
        await client.createContact({
          email: parsedEmail,
          emailBlacklisted: false,
          smsBlacklisted: false,
          listIds,
        });
        return { success: true };
      } catch (createErr) {
        console.error(
          '[Newsletter API] Failed to create new contact:',
          createErr,
        );
        throw createError({
          statusCode: 502,
          statusMessage: 'Bad Gateway',
          message:
            'Failed to register subscriber with the newsletter provider.',
        });
      }
    }

    console.error('[Newsletter API] Failed to fetch or update contact:', err);
    throw createError({
      statusCode: 502,
      statusMessage: 'Bad Gateway',
      message: 'Newsletter service is currently unavailable.',
    });
  }
});
