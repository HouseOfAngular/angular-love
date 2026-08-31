import { generateText, Output } from 'ai';
import { createAiGateway } from 'ai-gateway-provider';
import { createOpenRouter } from 'ai-gateway-provider/providers/openrouter';
import { eq } from 'drizzle-orm';
import {
  createError,
  defineEventHandler,
  getRouterParam,
  type H3Event,
} from 'h3';

import { articles } from '@angular-love/blog-bff/shared/schema';

import { createDatabase } from '../../../../utils/database';
import { getRequiredEnv } from '../../../../utils/env';
import { htmlToPlain } from '../../../../utils/html';
import {
  PersonaId,
  PERSONAS,
  RawResponse,
  ResponseSchema,
  SYSTEM_PROMPT,
} from '../../../../utils/summary.helpers';

const MODEL = 'google/gemini-3.1-flash-lite';

function assemble(raw: RawResponse) {
  const personas = (Object.keys(PERSONAS) as PersonaId[]).map((id) => {
    const config = PERSONAS[id];
    const isTakeaways = id === 'takeaways';

    return {
      id,
      name: config.name,
      tagline: config.tagline,
      body: isTakeaways ? '' : (raw[id] as string).trim(),
      ...(isTakeaways && { bullets: raw.takeaways.map((b) => b.trim()) }),
    };
  });

  return { summary: raw.general.trim(), personas };
}

export default defineEventHandler(async (event: H3Event) => {
  const slug = getRouterParam(event, 'id');
  if (!slug)
    throw createError({ statusCode: 400, statusMessage: 'Missing article id' });

  const db = createDatabase(event);
  const [article] = await db
    .select({ content: articles.content })
    .from(articles)
    .where(eq(articles.slug, slug));

  if (!article)
    throw createError({ statusCode: 404, statusMessage: 'Article not found' });

  const plain = htmlToPlain(article.content);
  if (!plain)
    throw createError({
      statusCode: 422,
      statusMessage: 'Article has no content',
    });

  const ai = getRequiredEnv(event, 'AI');
  const aigateway = createAiGateway({
    binding: ai.gateway('angular-love'),
    options: { cacheTtl: 604_800 },
  });
  const model = aigateway([createOpenRouter()(MODEL)]);

  try {
    const { output } = await generateText({
      model,
      output: Output.object({ schema: ResponseSchema }),
      system: SYSTEM_PROMPT,
      prompt: `ARTICLE:\n${plain}`,
      headers: {
        'cf-aig': JSON.stringify({ task_type: 'article_summary' }),
      },
    });

    return assemble(output);
  } catch (err) {
    console.error('[article-summary] primary generation failed', {
      slug,
      error: err instanceof Error ? err.message : String(err),
    });

    try {
      const { text } = await generateText({
        model,
        system:
          'Summarize this Angular blog article in 3-5 sentences of neutral, professional prose. No headings or lists.',
        prompt: `ARTICLE:\n${plain}`,
      });
      return { summary: text.trim(), personas: [] };
    } catch {
      throw createError({
        statusCode: 502,
        statusMessage: 'Summary generation failed',
      });
    }
  }
});
