import { defineEventHandler, setHeader } from 'h3';

export default defineEventHandler((event) => {
  setHeader(event, 'Content-Type', 'text/plain');
  return `User-agent: *
Disallow: /`;
});
