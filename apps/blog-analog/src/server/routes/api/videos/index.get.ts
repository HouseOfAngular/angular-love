import { defineEventHandler, getQuery } from 'h3';

import {
  mapWPVideoToVideoPreview,
  WpVideos,
} from '@angular-love/blog-bff/videos/api';
import { ArrayResponse } from '@angular-love/blog-contracts/shared';
import { VideoPreview } from '@angular-love/blog/contracts/videos';
import { getPagination } from '@angular-love/util-wp';

import { createWpClient } from '../../../utils/wp-client';

export default defineEventHandler(
  async (event): Promise<ArrayResponse<VideoPreview>> => {
    const queryParams = getQuery(event) as Record<string, string>;
    const { page, per_page } = getPagination(queryParams);

    const createWPClient = createWpClient(event);
    const client = new WpVideos(createWPClient());

    const response = await client.getVideos({
      page,
      per_page,
    });

    return {
      data: response.data.map(mapWPVideoToVideoPreview),
      total: Number(response.headers.get('x-wp-total')),
    };
  },
);
