import { PixelFactory } from '../scripts-loader';

export const metaPixel =
  (id: string): PixelFactory =>
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
