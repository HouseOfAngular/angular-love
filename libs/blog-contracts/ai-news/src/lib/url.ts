const TRACKING_PARAMS = new Set([
  'fbclid',
  'gclid',
  'gbraid',
  'wbraid',
  'dclid',
  'msclkid',
  'yclid',
  'twclid',
  'igshid',
  'mc_cid',
  'mc_eid',
  '_hsenc',
  '_hsmkt',
  'mkt_tok',
  'ref_src',
  'ref_url',
  'si',
]);

// x.com share links append `?s=20&t=<token>`; elsewhere these can be meaningful.
const X_TRACKING_PARAMS = new Set(['s', 't']);
const X_HOSTS = new Set(['x.com', 'twitter.com']);

const YOUTUBE_HOSTS = new Set(['youtube.com', 'm.youtube.com']);
const YOUTUBE_ID = /^[\w-]{6,}$/;

// Top-level GitHub paths that look like `github.com/<owner>/<repo>` but aren't repos.
const GITHUB_NON_OWNERS = new Set([
  'orgs',
  'topics',
  'collections',
  'sponsors',
  'marketplace',
  'features',
  'settings',
  'trending',
  'explore',
  'enterprise',
  'apps',
  'users',
  'search',
]);

/**
 * Normalizes a source URL so the same link always maps to one row: drops
 * tracking params, the fragment, trailing slashes and a leading `www.`,
 * lowercases the host, and rewrites YouTube short links to `watch?v=`.
 * Throws on an invalid URL.
 */
export function canonicalizeUrl(url: string): string {
  const parsed = new URL(url.trim());
  // URL lowercases the hostname itself.
  const host = parsed.host.replace(/^www\./, '');
  const hostname = parsed.hostname.replace(/^www\./, '');
  let pathname = parsed.pathname;

  const kept: [string, string][] = [];
  parsed.searchParams.forEach((value, key) => {
    const lower = key.toLowerCase();
    const isTracking =
      lower.startsWith('utm_') ||
      TRACKING_PARAMS.has(lower) ||
      (X_HOSTS.has(hostname) && X_TRACKING_PARAMS.has(lower));
    if (!isTracking) {
      kept.push([key, value]);
    }
  });
  let params = new URLSearchParams(kept);

  const youTubeId = youTubeShortLinkId(hostname, pathname);
  let finalHost = host;
  if (youTubeId) {
    finalHost = 'youtube.com';
    pathname = '/watch';
    params = new URLSearchParams([
      ['v', youTubeId],
      ...kept.filter(([key]) => key !== 'v'),
    ]);
  } else if (hostname === 'm.youtube.com') {
    finalHost = 'youtube.com';
  }

  pathname = pathname.replace(/\/+$/, '');
  const query = params.toString();
  const search = query ? `?${query}` : '';

  return `${parsed.protocol}//${finalHost}${pathname}${search}`;
}

/** The video id of a YouTube URL, or `null` for anything else. Keys off the hostname. */
export function getYouTubeVideoId(url: string): string | null {
  const parsed = tryParse(url);
  if (!parsed) {
    return null;
  }
  const hostname = parsed.hostname.replace(/^www\./, '');
  const id =
    youTubeShortLinkId(hostname, parsed.pathname) ??
    (YOUTUBE_HOSTS.has(hostname)
      ? parsed.pathname === '/watch'
        ? parsed.searchParams.get('v')
        : (parsed.pathname.match(/^\/(?:embed|live)\/([^/]+)/)?.[1] ?? null)
      : null);

  return id && YOUTUBE_ID.test(id) ? id : null;
}

/**
 * The card thumbnail: the stored image, else a YouTube frame, else the GitHub
 * social card for a repo root URL, else `null`. Social posts, papers and
 * unknown links get no image on purpose.
 */
export function resolveThumbnail(item: {
  url: string;
  imageUrl?: string | null;
}): string | null {
  if (item.imageUrl) {
    return item.imageUrl;
  }

  const youTubeId = getYouTubeVideoId(item.url);
  if (youTubeId) {
    return `https://img.youtube.com/vi/${youTubeId}/hqdefault.jpg`;
  }

  const repo = getGitHubRepo(item.url);
  if (repo) {
    return `https://opengraph.githubassets.com/1/${repo.owner}/${repo.repo}`;
  }

  return null;
}

function getGitHubRepo(url: string): { owner: string; repo: string } | null {
  const parsed = tryParse(url);
  if (!parsed || parsed.hostname.replace(/^www\./, '') !== 'github.com') {
    return null;
  }
  const segments = parsed.pathname.split('/').filter(Boolean);
  if (segments.length !== 2 || GITHUB_NON_OWNERS.has(segments[0])) {
    return null;
  }
  const [owner, repo] = segments;
  return { owner, repo: repo.replace(/\.git$/, '') };
}

function youTubeShortLinkId(hostname: string, pathname: string): string | null {
  if (hostname === 'youtu.be') {
    return pathname.split('/').filter(Boolean)[0] ?? null;
  }
  if (YOUTUBE_HOSTS.has(hostname)) {
    return pathname.match(/^\/shorts\/([^/]+)/)?.[1] ?? null;
  }
  return null;
}

function tryParse(url: string): URL | null {
  try {
    return new URL(url);
  } catch {
    return null;
  }
}
