export function rewriteImageUrl(url: string): string {
  return url.startsWith('https://angular.love/wp-content/')
    ? url.replace(
        'https://angular.love/wp-content/',
        'https://wp.angular.love/wp-content/',
      )
    : url;
}
