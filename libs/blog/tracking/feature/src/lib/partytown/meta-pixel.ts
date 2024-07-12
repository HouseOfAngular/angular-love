import { PartyTownPixelFactory } from './partytown.service';

export const metaPixel =
  (id: string): PartyTownPixelFactory =>
  (pixel) => {
    pixel.setAttribute('height', '1');
    pixel.setAttribute('width', '1');
    pixel.setAttribute('style', 'display:none');
    pixel.setAttribute(
      'src',
      `https://www.facebook.com/tr?id=${id}&ev=PageView&noscript=1`,
    );

    return pixel;
  };
