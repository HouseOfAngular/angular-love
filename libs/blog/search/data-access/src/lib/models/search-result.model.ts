export type ArticleSearchResultDto = {
  comment_count: number;
  content: string;
  images: string[];
  permalink: string;
  post_author: {
    user_id: number;
    display_name: string;
    user_url: string;
    user_login: string;
  };
  post_date: number;
  post_date_formatted: string;
  post_title: 'Main';
  post_type: 'page';
  post_type_label: 'Pages';
  record_index: 0;
};
