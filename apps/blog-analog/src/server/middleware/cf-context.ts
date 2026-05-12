import { defineEventHandler } from 'h3';

import { initWorkerRegion } from '../utils/geo';

export default defineEventHandler((event) => {
  const cf = (event.context.cloudflare?.request as any)?.cf;
  if (cf?.latitude && cf?.longitude) {
    initWorkerRegion(cf);
  }
});
