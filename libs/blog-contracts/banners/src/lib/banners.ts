export interface Slider {
  slideDisplayTimeMs: number;
  slides: {
    url: string;
    alt: string;
    navigateTo: string;
  }[];
}
