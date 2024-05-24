import { InjectionToken } from '@angular/core';

export type GiscusConfig = {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping?: string;
  theme?: string;
  lang?: string;
  strict?: boolean;
  reactionsEnabled?: boolean;
  emitMetadata?: boolean;
  inputPosition?: string;
};

export const GISCUS_CONFIG = new InjectionToken<GiscusConfig>(
  'Giscus Comment Config',
);
