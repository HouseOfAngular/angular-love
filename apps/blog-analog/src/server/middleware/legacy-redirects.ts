import { defineEventHandler, getRequestURL, sendRedirect } from 'h3';

export default defineEventHandler((event) => {
  const url = getRequestURL(event);
  const pathname = url.pathname;
  const search = url.search;

  // Fast path: root and short paths can't match dated patterns
  // (minimum dated path is /YYYY/MM/DD/x = 14 chars)
  const couldBeDated = pathname.length >= 14;

  if (couldBeDated) {
    // Only try the dated regexes if length permits
    if (pathname.startsWith('/en/')) {
      const m = pathname.match(/^\/en\/\d{4}\/\d{2}\/\d{2}\/([^/]+)\/?$/);
      if (m) sendRedirect(event, `/en/${m[1]}${search}`, 301);
    } else if (pathname.startsWith('/pl/')) {
      const m = pathname.match(/^\/pl\/\d{4}\/\d{2}\/\d{2}\/([^/]+)\/?$/);
      if (m) sendRedirect(event, `/pl/${m[1]}${search}`, 301);
    } else {
      const m = pathname.match(/^\/\d{4}\/\d{2}\/\d{2}\/([^/]+)\/?$/);
      if (m) sendRedirect(event, `/pl/${m[1]}${search}`, 301);
    }
  }

  // /en handling
  if (pathname === '/en' || pathname === '/en/') {
    sendRedirect(event, `/${search}`, 301);
  }
  if (pathname.startsWith('/en/')) {
    const splat = pathname.slice(4).replace(/\/$/, '');
    sendRedirect(event, `/${splat}${search}`, 301);
  }

  // Trailing slash removal
  if (pathname.length > 1 && pathname.endsWith('/')) {
    sendRedirect(event, `${pathname.slice(0, -1)}${search}`, 301);
  }
});
