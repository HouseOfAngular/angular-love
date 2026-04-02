import { defineEventHandler, getRequestURL, sendRedirect } from 'h3';

const dateSlugPattern = /^\/(?:pl\/)?(\d{4})\/(\d{2})\/(\d{2})\/(.+?)\/?\??.*$/;

export default defineEventHandler((event) => {
  const url = getRequestURL(event);
  const path = url.pathname;

  if (path !== '/' && path.endsWith('/')) {
    const newPath = path.slice(0, -1) + (url.search || '');
    sendRedirect(event, newPath, 301);
  }

  // /:year/:month/:day/:slug → /pl/:slug/
  // /pl/:year/:month/:day/:slug → /pl/:slug/
  const plMatch = path.match(dateSlugPattern);
  if (plMatch) {
    sendRedirect(event, `/pl/${plMatch[4]}`, 301);
  }
});
