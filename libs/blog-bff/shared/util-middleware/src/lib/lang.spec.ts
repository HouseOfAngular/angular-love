import { Hono } from 'hono';

import { langMw } from './lang';

describe('Lang Middleware', () => {
  const testSetup = (options?: { throwOnInvalidLang?: boolean }) => {
    const app = new Hono()
      .use(langMw(options?.throwOnInvalidLang))
      .get('/test', (c) => c.json({ lang: c.var.lang }));

    return { app };
  };

  it('sets lang from query parameter', async () => {
    const { app } = testSetup();

    const response = await app.request('/test?lang=en', {
      method: 'GET',
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ lang: 'en' });
  });

  it('sets lang from header', async () => {
    const { app } = testSetup();

    const response = await app.request('/test', {
      method: 'GET',
      headers: {
        'x-al-lang': 'en',
      },
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ lang: 'en' });
  });

  it('sets default lang to en when invalid lang is provided and throwOnInvalidLang is false', async () => {
    const { app } = testSetup();

    const response = await app.request('/test?lang=invalid', {
      method: 'GET',
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ lang: 'en' });
  });

  it('throws error if throwOnInvalidLang is true and lang is not in the headers', async () => {
    const { app } = testSetup({ throwOnInvalidLang: true });

    const response = await app.request('/test?lang=invalid', {
      method: 'GET',
    });

    expect(response.status).toBe(400);
    expect(await response.text()).toEqual('Invalid lang');
  });
});
