export type AlgoliaArticleSearchResultDto = {
  comment_count: number;
  content: string;
  images: string[];
  permalink: string;
  post_author: {
    user_id: number;
    display_name: string;
    user_url: string;
    user_login: string;
    user_avatar_url: string;
  };
  post_date: number;
  post_date_formatted: string;
  post_slug: string;
  post_title: 'Main';
  post_type: 'page';
  post_type_label: 'Pages';
  reading_time: number | null;
  record_index: 0;
  _highlightResult: {
    content: { value: string };
    post_title: { value: string };
  };
};
