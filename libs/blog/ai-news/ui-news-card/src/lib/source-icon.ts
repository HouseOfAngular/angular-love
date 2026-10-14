import { AiNewsSourceType } from '@angular-love/blog/contracts/ai-news';

/** Names of the svgs in `apps/blog-analog/public/assets/icons`, rendered with `fast-svg`. */
export type SourceIconName =
  | 'twitter-x'
  | 'linkedIn'
  | 'github-mark'
  | 'youtube'
  | 'facebook'
  | 'play'
  | 'link'
  | 'source-article'
  | 'source-chat'
  | 'source-code'
  | 'source-paper'
  | 'source-podcast'
  | 'source-newsletter';

const HOST_ICONS: Record<string, SourceIconName> = {
  'x.com': 'twitter-x',
  'twitter.com': 'twitter-x',
  'linkedin.com': 'linkedIn',
  'github.com': 'github-mark',
  'youtube.com': 'youtube',
  'm.youtube.com': 'youtube',
  'youtu.be': 'youtube',
  'facebook.com': 'facebook',
};

const SOURCE_TYPE_ICONS: Record<AiNewsSourceType, SourceIconName> = {
  blog: 'source-article',
  social: 'source-chat',
  video: 'play',
  repo: 'source-code',
  paper: 'source-paper',
  podcast: 'source-podcast',
  newsletter: 'source-newsletter',
  other: 'link',
};

/** The platform icon for well-known hosts, otherwise a generic one for the source type. */
export function sourceIcon(
  url: string,
  sourceType: AiNewsSourceType,
): SourceIconName {
  let hostname = '';
  try {
    hostname = new URL(url).hostname.replace(/^www\./, '');
  } catch {
    // Fall through to the source type icon.
  }
  return HOST_ICONS[hostname] ?? SOURCE_TYPE_ICONS[sourceType] ?? 'link';
}
