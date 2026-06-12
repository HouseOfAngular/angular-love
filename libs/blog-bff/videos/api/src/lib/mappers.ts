import * as cheerio from 'cheerio';

import { VideoPreview } from '@angular-love/blog/contracts/videos';

import { WPVideoDto } from './dtos';

export function mapWPVideoToVideoPreview(dto: WPVideoDto): VideoPreview {
  return {
    videoId: dto.acf.youtube_video_id,
    title: cheerio.load(dto.title.rendered || '').text(),
    eventName: dto.acf.event_name,
  };
}
