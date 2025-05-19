export interface Slider {
  slideDisplayTimeMs: number;
  slides: {
    url?: string;
    alt?: string;
    navigateTo: string;
  }[];
}

export interface TopBanner {
  navigateTo?: string;
  buttonText?: string;
  text: string;
  buttonPosition: 'left' | 'right';
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
