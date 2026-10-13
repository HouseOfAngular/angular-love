import type { AiNewsItemInput } from '@angular-love/blog-bff/ai-news/api';

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

/**
 * Fictional AI news items for local development: every source type and
 * category, with and without images, a YouTube video, a GitHub repo and a
 * social post, spread over today, yesterday, this week and earlier months so
 * every date group renders. Dates are relative to `now`. Nothing here is a
 * real news claim.
 */
export function aiNewsSeedItems(now = new Date()): AiNewsItemInput[] {
  const ago = (ms: number) => new Date(now.getTime() - ms);

  return [
    {
      url: 'https://blog.example-ai-lab.dev/introducing-placeholder-7?utm_source=newsletter&utm_medium=email',
      title: 'Example AI Lab introduces Placeholder-7, a fictional model',
      summary:
        'A made-up announcement used for local development. Placeholder-7 is said to handle longer contexts and cheaper tool calls than its imaginary predecessor, with a fictional benchmark table to match.',
      imageUrl: 'https://picsum.photos/seed/al-ai-news-1/1200/628',
      sourceName: 'Example AI Lab',
      sourceType: 'blog',
      category: 'models',
      publishedAt: ago(2 * HOUR),
    },
    {
      url: 'https://x.com/fictional_dev/status/1000000000000000001?s=20&t=abc',
      title: 'Thread: what we learned shipping a fictional agent to production',
      summary:
        'A placeholder social post. The fictional author lists five lessons about retries, evals and prompt versioning from an agent that never actually existed.',
      sourceName: 'X',
      sourceType: 'social',
      author: '@fictional_dev',
      category: 'tools',
      publishedAt: ago(5 * HOUR),
    },
    {
      url: 'https://youtu.be/aaaaaaaaaaa?si=placeholder',
      title: 'Talk: building a toy RAG pipeline in 20 minutes',
      summary:
        'A fictional conference talk that walks through chunking, embeddings and a tiny retrieval loop. Used here to check the video card and its play overlay.',
      sourceName: 'Example Conf',
      sourceType: 'video',
      category: 'tools',
      publishedAt: ago(9 * HOUR),
    },
    {
      url: 'https://github.com/example-org/tiny-agent-kit',
      title: 'tiny-agent-kit: a fictional minimal agent framework',
      summary:
        'Placeholder repository entry. The imaginary project offers a small typed tool registry and a step loop, and exists only to exercise the GitHub social card thumbnail.',
      sourceName: 'GitHub',
      sourceType: 'repo',
      category: 'tools',
      publishedAt: ago(DAY + 3 * HOUR),
    },
    {
      url: 'https://arxiv.example.org/abs/0000.00001v1',
      title: 'On the imaginary scaling of placeholder transformers',
      summary:
        'A fictional paper abstract for development. It claims nothing real; it is here to show a research item that has no thumbnail and renders as a text-forward card.',
      sourceName: 'arXiv (example)',
      sourceType: 'paper',
      author: 'A. Example, B. Sample',
      category: 'research',
      publishedAt: ago(DAY + 8 * HOUR),
    },
    {
      url: 'https://www.linkedin.com/posts/fictional-person_placeholder-activity-0000000000000000001/',
      title: 'Why our fictional team moved evals into CI',
      summary:
        'A placeholder LinkedIn post about running model evaluations on every pull request. Present to check the LinkedIn source icon and the author label.',
      sourceName: 'LinkedIn',
      sourceType: 'social',
      author: 'Jane Placeholder',
      category: 'industry',
      publishedAt: ago(3 * DAY),
    },
    {
      url: 'https://podcast.example.fm/episodes/42-fictional-frontiers',
      title: 'Fictional Frontiers #42: are small models enough?',
      summary:
        'An invented podcast episode in which two imaginary hosts debate whether small local models cover most product use cases. No real people or claims involved.',
      imageUrl: 'https://picsum.photos/seed/al-ai-news-7/1200/628',
      sourceName: 'Fictional Frontiers',
      sourceType: 'podcast',
      category: 'industry',
      publishedAt: ago(4 * DAY),
    },
    {
      url: 'https://newsletter.example.com/p/weekly-placeholder-digest-17#comments',
      title: 'Weekly Placeholder Digest #17',
      summary:
        'A made-up newsletter issue rounding up imaginary releases, a fictional funding round and a toy benchmark. Used to show the newsletter source type.',
      sourceName: 'Placeholder Digest',
      sourceType: 'newsletter',
      category: 'industry',
      publishedAt: ago(5 * DAY),
    },
    {
      url: 'https://research.example-ai-lab.dev/notes/interpretability-sketch',
      title: 'Research note: a sketch of fictional feature circuits',
      summary:
        'A placeholder research note with an image. It describes an invented interpretability method in general terms so the standard card layout can be checked for research.',
      imageUrl: 'https://picsum.photos/seed/al-ai-news-9/1200/628',
      sourceName: 'Example AI Lab',
      sourceType: 'blog',
      category: 'research',
      publishedAt: ago(6 * DAY),
    },
    {
      url: 'https://www.youtube.com/shorts/bbbbbbbbbbb',
      title: 'Short: a fictional model writes a haiku about TypeScript',
      summary:
        'A placeholder YouTube Short. The URL is normalized to a watch link, which also checks the image error fallback because the video does not exist.',
      sourceName: 'YouTube',
      sourceType: 'video',
      category: 'models',
      publishedAt: ago(35 * DAY),
    },
    {
      url: 'https://news.example.org/2026/fictional-startup-raises-seed',
      title: 'Fictional startup raises an imaginary seed round',
      summary:
        'A made-up industry item from an unknown source type, rendered without a thumbnail. Nothing in it refers to a real company or deal.',
      sourceName: 'Example News',
      sourceType: 'other',
      category: 'industry',
      publishedAt: ago(40 * DAY),
    },
    {
      url: 'https://blog.example-ai-lab.dev/placeholder-6-retired',
      title: 'Placeholder-6 retired in favour of a newer fictional model',
      summary:
        'An older fictional model announcement, published two months back, so the feed shows more than one month group when you load more.',
      sourceName: 'Example AI Lab',
      sourceType: 'blog',
      category: 'models',
      publishedAt: ago(70 * DAY),
    },
    {
      url: 'https://blog.example-ai-lab.dev/draft-not-visible',
      title: 'Draft: this item must not appear in the feed',
      summary:
        'A draft, here to check that the feed only shows published items.',
      sourceName: 'Example AI Lab',
      sourceType: 'blog',
      category: 'models',
      status: 'draft',
      publishedAt: ago(HOUR),
    },
  ];
}
