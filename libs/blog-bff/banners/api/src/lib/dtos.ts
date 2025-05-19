export interface WPBannerDto {
  id: number;
  acf: {
    is_slider_banner_displayed: boolean;
    display_time: string;
    slides: {
      slide_image_desktop: number /* slideId */;
      slide_image_mobile: number /* slideId */;
      slide_url: string /* url to navigate to after click */;
    }[];

    is_top_banner_displayed: boolean;
    top_banner_image_desktop: number /* mediaId */;
    top_banner_image_mobile: number /* mediaId */;
    top_banner_image_url: string /* url to navigate to after click */;

    is_card_banner_displayed: boolean;
    card_banner_image: number /* mediaId */;
    card_banner_url: string /* url to navigate to after click */;
  };
}

export interface WPBannerMediaDto {
  id: number;
  alt_text: string;
  guid: {
    rendered: string; // URL
  };
}
