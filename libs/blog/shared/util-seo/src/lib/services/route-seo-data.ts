import { Data } from '@angular/router';

import { isWebPageType, WebPageType } from '../json-ld/json-ld.types';

/**
 * Shape of `route.data.seo`.
 * - `false` → the route manages its own seo externally (a store sets
 *   meta/title/hreflang/JSON-LD after an async fetch). SeoService applies only
 *   the site-wide BASE layer + canonical for these routes.
 * - object → SeoService manages the page centrally from route data.
 * - `undefined` → defaults only (BASE + canonical + empty title), no JSON-LD.
 */
export type RouteSeoData =
  | {
      /** Transloco key for the page title (appended after the site title). */
      title?: string;
      /** Emit hreflang alternates for all available languages. */
      autoHrefLang?: boolean;
      /** schema.org page type, or `false` to suppress JSON-LD entirely. */
      jsonLd?: WebPageType | false;
    }
  | false;

export interface SeoRouteInterpretation {
  /** Route owns its seo (store-driven); apply BASE + canonical only. */
  managedExternally: boolean;
  /** Whether to inject a JSON-LD graph (the base Org + WebSite graph at minimum). */
  applyJsonLd: boolean;
  /** Resolved schema.org page type, when a valid one is declared. */
  jsonLdType?: WebPageType;
  /** Transloco key for the centrally-managed page title. */
  titleKey?: string;
  /** Plain (already-localized) collection name from `route.data.title`. */
  collectionTitle?: string;
  /** Emit hreflang alternates. */
  autoHrefLang: boolean;
}

/**
 * Single place that reads the loosely-typed `route.data` and resolves it into a
 * typed decision object. Everything downstream consumes the result instead of
 * indexing into `route.data` directly.
 */
export function interpretRouteSeo(routeData: Data): SeoRouteInterpretation {
  const seo = routeData?.['seo'] as RouteSeoData | undefined;

  if (seo === false) {
    return { managedExternally: true, applyJsonLd: false, autoHrefLang: false };
  }

  if (!seo) {
    // No `data.seo` → defaults only, no JSON-LD.
    return {
      managedExternally: false,
      applyJsonLd: false,
      autoHrefLang: false,
    };
  }

  const jsonLd = seo.jsonLd;
  const jsonLdType =
    typeof jsonLd === 'string' && isWebPageType(jsonLd) ? jsonLd : undefined;

  return {
    managedExternally: false,
    // `jsonLd: false` suppresses entirely; otherwise emit at least the base graph.
    applyJsonLd: jsonLd !== false,
    jsonLdType,
    titleKey: seo.title,
    collectionTitle: routeData?.['title'] as string | undefined,
    autoHrefLang: !!seo.autoHrefLang,
  };
}
