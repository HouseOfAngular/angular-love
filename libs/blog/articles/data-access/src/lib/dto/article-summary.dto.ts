export type PersonaId = 'coach' | 'takeaways' | 'mentor' | 'hotTake';

export interface PersonaSummary {
  id: PersonaId;
  name: string;
  tagline: string;
  body: string;
  bullets?: string[];
}

export interface ArticleSummaryResponse {
  summary: string;
  personas: PersonaSummary[];
}
