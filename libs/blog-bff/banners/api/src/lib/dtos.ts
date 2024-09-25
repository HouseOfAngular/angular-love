export interface WPBannerDto {
  id: number;
  acf: {
    display_time: string;
    slides: {
      slide_image: number /* slideId */;
      slide_url: string /* url to navigate to after click */;
    }[];
  };
}

export interface WPBannerMediaDto {
  id: number;
  alt_text: string;
  guid: {
    rendered: string; // URL
  };
}
