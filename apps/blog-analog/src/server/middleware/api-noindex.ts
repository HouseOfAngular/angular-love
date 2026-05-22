import { defineEventHandler, setResponseHeader } from 'h3';

export default defineEventHandler((event) => {
  if (event.node.req.url?.startsWith('/api/')) {
    setResponseHeader(event, 'X-Robots-Tag', 'noindex, nofollow');
  }
});
