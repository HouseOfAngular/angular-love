export interface Slider {
  slideDisplayTimeMs: number;
  slides: {
    url?: string;
    alt?: string;
    navigateTo: string;
  }[];
}

export interface TopBanner {
  url?: string;
  alt?: string;
  navigateTo: string;
}

export interface CardBanner {
  url?: string;
  alt?: string;
  navigateTo: string;
}

export interface Banners {
  slider?: Slider;
  topBanner?: TopBanner;
  cardBanner?: CardBanner;
}
