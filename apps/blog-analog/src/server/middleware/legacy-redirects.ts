import { defineEventHandler, getRequestURL, sendRedirect } from 'h3';

const dateSlugPattern = /^\/(?:pl\/)?(\d{4})\/(\d{2})\/(\d{2})\/(.+?)\/?\??.*$/;
const enDateSlugPattern = /^\/en\/(\d{4})\/(\d{2})\/(\d{2})\/(.+?)\/?\??.*$/;
const enSplatPattern = /^\/en\/(.+)$/;

export default defineEventHandler((event) => {
  const url = getRequestURL(event);
  const path = url.pathname;

  // /en/:year/:month/:day/:slug → /:slug/
  // const enMatch = path.match(enDateSlugPattern);
  // if (enMatch) {
  //   sendRedirect(event, `/${enMatch[4]}/`, 301);
  // }

  // /:year/:month/:day/:slug → /pl/:slug/
  // /pl/:year/:month/:day/:slug → /pl/:slug/
  const plMatch = path.match(dateSlugPattern);
  if (plMatch) {
    sendRedirect(event, `/pl/${plMatch[4]}/`, 301);
  }

  // /en/* → /:splat/
  // const splatMatch = path.match(enSplatPattern);
  // if (splatMatch) {
  //   sendRedirect(event, `/${splatMatch[1]}/`, 301);
  // }
});
