export interface WPPostDto {
  date: string;
  slug: string;
  featured_image_url: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  author_details: {
    name: string;
    slug: string;
    avatar_url: string;
  };
  acf: {
    reading_time: string | number;
    difficulty: string;
  };
}

export interface WPPostDetailsDto {
  date: string;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  author_details: {
    name: string;
    slug: string;
    avatar_url: string;
    description: string;
    position: string;
    github: string;
    twitter: string;
    linkedin: string;
  };
  acf: {
    reading_time: string | number;
    difficulty: string;
  };
}
