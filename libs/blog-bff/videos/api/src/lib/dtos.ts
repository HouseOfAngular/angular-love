export interface WPVideoDto {
  id: number;
  title: {
    rendered: string;
  };
  acf: {
    youtube_video_id: string;
    event_name: string;
  };
}
