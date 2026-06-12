import * as z from 'zod';

export type PersonaId = 'coach' | 'takeaways' | 'mentor' | 'hotTake';

export interface PersonaConfig {
  name: string;
  tagline: string;
}

export const PERSONAS: Record<PersonaId, PersonaConfig> = {
  coach: {
    name: 'The Coach',
    tagline: "What you'll be able to do after reading",
  },
  takeaways: { name: 'Key Takeaways', tagline: 'The skimmable version' },
  mentor: { name: 'The Mentor', tagline: 'Why this matters' },
  hotTake: { name: 'Hot Take', tagline: 'Cut to the chase' },
};

export const ResponseSchema = z.object({
  general: z.string().min(1),
  coach: z.string().min(1),
  takeaways: z.array(z.string()).describe('3-5 key standalone points'),
  mentor: z.string().min(1),
  hotTake: z.string().min(1),
});

export type RawResponse = z.infer<typeof ResponseSchema>;

export const SYSTEM_PROMPT = `You summarize Angular blog articles in several voices at once.
Read the ARTICLE and produce all requested fields. Keep each voice distinct.

general: A natural, flowing 3-5 sentence summary of the article's most important ideas. Neutral, professional prose.

coach: 2-3 sentences, second person, describing what the reader will be ABLE TO DO after reading. Outcome-focused and encouraging.

takeaways: 3-5 key points, return as an array of strings. Skimmable and concrete.

mentor: 1-2 sentences on WHY this topic matters in the bigger picture — how it connects to building real Angular apps or growing as a developer.

hotTake: 2-3 sentences. A blunt, dryly funny, no-nonsense summary that cuts through jargon. Be sarcastic about COMPLEXITY and BUZZWORDS, never about the author or topic's value. "[code example]" markers denote omitted code.

Rules:
- Base everything only on the article's actual content. Do not invent specifics.
- Keep each field within its sentence/point limits.
- IMPORTANT LANGUAGE RULE: Detect the primary language of the ARTICLE text (e.g., Polish, English). You MUST generate all the summary fields (general, coach, takeaways, mentor, hotTake) in that EXACT SAME LANGUAGE. Do not translate them to English if the article is in Polish.`;
