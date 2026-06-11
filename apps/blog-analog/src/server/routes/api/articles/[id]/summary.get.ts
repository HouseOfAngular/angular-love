import { generateText, Output } from 'ai';
import { createAiGateway } from 'ai-gateway-provider';
import { unified } from 'ai-gateway-provider/providers/unified';
import { eq } from 'drizzle-orm';
import {
  createError,
  defineEventHandler,
  getRouterParam,
  type H3Event,
} from 'h3';
import * as z from 'zod';

import { articles } from '@angular-love/blog-bff/shared/schema';

import { createDatabase } from '../../../../utils/database';
import { getRequiredEnv } from '../../../../utils/env';

const MODEL = 'openrouter/google/gemini-3.1-flash-lite';

interface PersonaSummary {
  id: PersonaId;
  name: string;
  tagline: string;
  body: string;
  bullets?: string[];
}

type PersonaId = 'coach' | 'takeaways' | 'mentor' | 'hotTake';

interface SummaryResponse {
  summary: string;
  personas: PersonaSummary[];
}

const PERSONAS: Record<
  PersonaId,
  { name: string; tagline: string; usesBullets: boolean }
> = {
  coach: {
    name: 'The Coach',
    tagline: "What you'll be able to do after reading",
    usesBullets: false,
  },
  takeaways: {
    name: 'Key Takeaways',
    tagline: 'The skimmable version',
    usesBullets: true,
  },
  mentor: {
    name: 'The Mentor',
    tagline: 'Why this matters',
    usesBullets: false,
  },
  hotTake: {
    name: 'Hot Take',
    tagline: 'Cut to the chase',
    usesBullets: false,
  },
};

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function htmlToPlain(html: string): string {
  let work = html;
  work = work.replace(/<(script|style|svg|noscript)[^>]*>[\s\S]*?<\/\1>/gi, '');
  work = work.replace(/<!--[\s\S]*?-->/g, '');
  // Collapse code: keep the signal a section is example-heavy, drop the syntax.
  work = work.replace(/<pre[^>]*>[\s\S]*?<\/pre>/gi, ' [code example] ');
  work = work.replace(/<code[^>]*>[\s\S]*?<\/code>/gi, ' [code] ');
  work = decodeEntities(work.replace(/<[^>]*>/g, ' '));
  return work
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const SYSTEM_PROMPT = `You summarize Angular blog articles in several voices at once.
Read the ARTICLE and produce all of the following. Keep each voice distinct.

general: A natural, flowing 3-5 sentence summary of the article's most important
ideas. Neutral, professional prose. This is the default summary readers see.

coach: 2-3 sentences, second person, describing what the reader will be ABLE TO
DO after reading. Outcome-focused and encouraging. Example tone: "You'll set up
X and be able to Y."

takeaways: 3-5 key points, each a short standalone line. Write them as plain
lines separated by newlines. No bullet characters, no numbering — just one point
per line. Skimmable and concrete.

mentor: 1-2 sentences on WHY this topic matters in the bigger picture — how it
connects to building real Angular apps or growing as a developer. Calm,
perspective-giving.

hotTake: 2-3 sentences. A blunt, dryly funny, no-nonsense summary that cuts
through jargon and says what the article really boils down to. Be sarcastic
about COMPLEXITY and BUZZWORDS, never about the author, the reader, or the
topic's value. Punch at jargon, not at people. It should still be accurate and
genuinely informative — the joke is that it's the most honest summary, not that
it's dismissive. "[code example]" markers denote omitted code.

Rules:
- Base everything only on the article's actual content. Do not invent specifics.
- Keep each field within its sentence/point limits.`;

const ResponseSchema = z.object({
  general: z.string().min(1),
  coach: z.string().min(1),
  takeaways: z.string().min(1),
  mentor: z.string().min(1),
  hotTake: z.string().min(1),
});

type RawResponse = z.infer<typeof ResponseSchema>;

function splitBullets(raw: string): string[] {
  return raw
    .split('\n')
    .map((line) =>
      // Defensively strip any bullet/number prefix the model added anyway.
      line.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').trim(),
    )
    .filter(Boolean);
}

function assemble(raw: RawResponse): SummaryResponse {
  const personas: PersonaSummary[] = [
    {
      id: 'coach',
      name: PERSONAS.coach.name,
      tagline: PERSONAS.coach.tagline,
      body: raw.coach.trim(),
    },
    {
      id: 'takeaways',
      name: PERSONAS.takeaways.name,
      tagline: PERSONAS.takeaways.tagline,
      body: raw.takeaways.trim(),
      bullets: splitBullets(raw.takeaways),
    },
    {
      id: 'mentor',
      name: PERSONAS.mentor.name,
      tagline: PERSONAS.mentor.tagline,
      body: raw.mentor.trim(),
    },
    {
      id: 'hotTake',
      name: PERSONAS.hotTake.name,
      tagline: PERSONAS.hotTake.tagline,
      body: raw.hotTake.trim(),
    },
  ];

  return { summary: raw.general.trim(), personas };
}

// ===========================================================================
// Handler
// ===========================================================================

export default defineEventHandler(
  async (event: H3Event): Promise<SummaryResponse> => {
    const slug = getRouterParam(event, 'id');
    if (!slug) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing article id',
      });
    }

    const db = createDatabase(event);
    const [article] = await db
      .select({ content: articles.content })
      .from(articles)
      .where(eq(articles.slug, slug));

    if (!article) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Article not found',
      });
    }

    const plain = htmlToPlain(article.content);
    if (!plain) {
      throw createError({
        statusCode: 422,
        statusMessage: 'Article has no summarizable content',
      });
    }

    const ai = getRequiredEnv(event, 'AI');
    const aigateway = createAiGateway({
      binding: ai.gateway('zwiedzai-gateway'),
    });
    const model = aigateway([unified(MODEL)]);

    try {
      const { output } = await generateText({
        model,
        output: Output.object({ schema: ResponseSchema }),
        system: SYSTEM_PROMPT,
        prompt: `ARTICLE:\n${plain}`,
      });
      return assemble(output);
    } catch (err) {
      console.error('[article-summary] generation failed', {
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
  },
);
