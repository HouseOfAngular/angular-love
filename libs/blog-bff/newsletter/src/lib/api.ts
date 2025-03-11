import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { csrf } from 'hono/csrf';
import { HTTPException } from 'hono/http-exception';
import * as v from 'valibot';

import { langMw } from '@angular-love/blog-bff/shared/util-middleware';

import { NewsletterList, NewsletterTemplate } from './models';
import { NewsletterClient } from './newsletter-client';

type NewsletterBindings = {
  BREVO_API_KEY: string;
  BREVO_API_URL: string;
};

const app = new Hono<{
  Bindings: NewsletterBindings;
}>().use(langMw(true));

app.use(
  '*',
  csrf({
    origin: (origin, c) =>
      c.env['IS_PROD'] === 'true'
        ? /https:\/\/(\w+\.)?(angular\.love|angular-love-client\.pages\.dev)$/.test(
            origin,
          )
        : true,
  }),
);

const EmailSchema = v.pipe(
  v.string(),
  v.nonEmpty('Please enter your email.'),
  v.email('Invalid email address'),
  v.maxLength(30, 'Your email is too long.'),
);

app.post('/subscribe', async (c) => {
  const newSubscriber = await c.req.text();
  const lang = c.var.lang;
  const { BREVO_API_KEY, BREVO_API_URL } = env(c);

  let listIds: number[];
  let templateId: number;

  if (lang === 'pl') {
    listIds = [NewsletterList.PL, NewsletterList.PLNew];
    templateId = NewsletterTemplate.PL;
  } else {
    listIds = [NewsletterList.EN];
    templateId = NewsletterTemplate.EN;
  }

  try {
    const parsedEmail = v.parse(EmailSchema, newSubscriber);
    const client = new NewsletterClient(BREVO_API_URL, BREVO_API_KEY);
    let sendTemplate = true;

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

      // Contact is already on the list, we should not send a welcoming template
      sendTemplate = !alreadySubscribed;
    } catch (err) {
      if (
        typeof err === 'object' &&
        err &&
        'code' in err &&
        err.code === 'document_not_found'
      ) {
        await client.createContact({
          email: parsedEmail,
          emailBlacklisted: false,
          smsBlacklisted: false,
          listIds,
        });
      }
    }

    if (sendTemplate) {
      const template = await client.getTemplate(templateId);

      await client.sendEmail({
        sender: {
          id: template.sender.id,
        },
        subject: template.subject,
        htmlContent: template.htmlContent,
        to: [
          {
            email: parsedEmail,
          },
        ],
      });
    }

    return c.json({ success: true }, 200);
  } catch (e) {
    if (e instanceof v.ValiError) {
      return c.json('Email validation error', 400);
    }
    if (e instanceof HTTPException) {
      return c.json('Post method fail', 400);
    }
    return c.json('Unknown error', 400);
  }
});

export default app;
