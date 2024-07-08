import { inject, Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';

type PathSegment = string | any;

@Injectable()
export class AlLocalizeService {
  private readonly _transloco = inject(TranslocoService);

  localizePath(path: any[]): any[];
  localizePath(path: string | UrlTree): string;
  localizePath(path: string | UrlTree | any[]): string | any[];
  localizePath(path: string | UrlTree | any[]): string | any[] {
    if (typeof path === 'string' || path instanceof UrlTree) {
      return this.translateStringPath(path.toString());
    }
    return this.translateArrayPath(path);
  }

  localizeExplicitPath(path: string, lang: string): string {
    return this.addPrefixToUrl(this.cleanupPath(path), lang);
  }

  private translateStringPath(path: string): string {
    return path.startsWith('/') ? this.addPrefixToUrl(path) : path;
  }

  private translateArrayPath(path: PathSegment[]): PathSegment[] {
    return path.map((segment, index) => {
      if (typeof segment !== 'string') {
        return segment;
      }

      if (index === 0 && segment.startsWith('/')) {
        return this.addPrefixToUrl(segment);
      }
      return segment;
    });
  }

  private cleanupPath(path: string): string {
    let _path = path;
    const langs = this._transloco.getAvailableLangs() as string[];
    langs.forEach((lang) => {
      if (_path.startsWith(`/${lang}`)) {
        _path = _path.replace(`/${lang}`, '');
      }
    });
    return _path;
  }

  private addPrefixToUrl(
    url: string,
    activeLang = this._transloco.getActiveLang(),
  ): string {
    const defaultLang = this._transloco.getDefaultLang();

    if (
      !url.startsWith(`/${activeLang}/`) &&
      activeLang !== defaultLang &&
      url !== `/${activeLang}`
    ) {
      return url === '/' ? `/${activeLang}` : `/${activeLang}${url}`;
    }
    return url;
  }
}
