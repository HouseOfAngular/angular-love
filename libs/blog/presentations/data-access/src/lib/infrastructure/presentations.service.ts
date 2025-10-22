import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { PresentationPreview } from '@angular-love/blog-contracts/presentations';
import { ArrayResponse } from '@angular-love/blog-contracts/shared';
import { ConfigService } from '@angular-love/shared/config';

import { PresentationsQuery } from '../dto/presentations.query';

const MOCK_PRESENTATIONS = [
  {
    slug: 'from-chaos-to-clarity-mastering-state-management',
    title: 'From Chaos to Clarity: Mastering State Management in Angular',
    excerpt:
      'Discover practical patterns for managing complex application state without losing your mind.',
    featuredImageUrl: null,
    eventName: 'Angular Camp',
    presentationUrl: 'https://www.youtube.com/@angularlove/videos',
    publishDate: '2025-03-15',
    author: {
      name: 'Sarah Chen',
      slug: 'sarah-chen',
      avatarUrl: 'assets/mock-avatar.png',
    },
  },
  {
    slug: 'zero-to-hero-building-accessible-angular-apps',
    title: 'Zero to Hero: Building Accessible Angular Applications',
    excerpt:
      'Transform your Angular apps into inclusive experiences that everyone can use and enjoy.',
    featuredImageUrl: null,
    eventName: 'Angular Camp',
    presentationUrl: 'https://www.youtube.com/@angularlove/videos',
    publishDate: '2025-03-14',
    author: {
      name: 'Marcus Thompson',
      slug: 'marcus-thompson',
      avatarUrl: 'assets/mock-avatar.png',
    },
  },
  {
    slug: 'performance-wizardry-making-angular-blazingly-fast',
    title: 'Performance Wizardry: Making Angular Blazingly Fast',
    excerpt:
      'Learn the secrets behind lightning-fast Angular applications that delight users.',
    featuredImageUrl: null,
    eventName: 'Angular Camp',
    presentationUrl: 'https://www.youtube.com/@angularlove/videos',
    publishDate: '2025-03-13',
    author: {
      name: 'Priya Sharma',
      slug: 'priya-sharma',
      avatarUrl: 'assets/mock-avatar.png',
    },
  },
  {
    slug: 'reactive-revolution-rxjs-patterns-that-actually-work',
    title: 'Reactive Revolution: RxJS Patterns That Actually Work',
    excerpt:
      'Cut through the complexity and master RxJS with real-world patterns you can use today.',
    featuredImageUrl: null,
    eventName: 'Angular Camp',
    presentationUrl: 'https://www.youtube.com/@angularlove/videos',
    publishDate: '2025-03-12',
    author: {
      name: 'Lukas Müller',
      slug: 'lukas-muller',
      avatarUrl: 'assets/mock-avatar.png',
    },
  },
  {
    slug: 'component-architecture-building-scalable-design-systems',
    title: 'Component Architecture: Building Scalable Design Systems',
    excerpt:
      'Create maintainable, reusable components that grow with your application and team.',
    featuredImageUrl: null,
    eventName: 'Angular Camp',
    presentationUrl: 'https://www.youtube.com/@angularlove/videos',
    publishDate: '2025-03-11',
    author: {
      name: 'Elena Rodriguez',
      slug: 'elena-rodriguez',
      avatarUrl: 'assets/mock-avatar.png',
    },
  },
  {
    slug: 'debugging-like-a-detective-advanced-angular-techniques',
    title: 'Debugging Like a Detective: Advanced Angular Techniques',
    excerpt:
      'Uncover hidden bugs and solve mysterious issues with professional debugging strategies.',
    featuredImageUrl: null,
    eventName: 'Angular Camp',
    presentationUrl: 'https://www.youtube.com/@angularlove/videos',
    publishDate: '2025-03-10',
    author: {
      name: 'Takeshi Nakamura',
      slug: 'takeshi-nakamura',
      avatarUrl: 'assets/mock-avatar.png',
    },
  },
];

@Injectable({ providedIn: 'root' })
export class PresentationsService {
  private readonly _apiBaseUrl = inject(ConfigService).get('apiBaseUrl');
  private readonly _http = inject(HttpClient);

  getPresentationsList(
    query: PresentationsQuery,
  ): Observable<ArrayResponse<PresentationPreview>> {
    return of({
      data: MOCK_PRESENTATIONS,
      total: MOCK_PRESENTATIONS.length,
    });
    // TODO - add real API
    // return this._http.get<ArrayResponse<PresentationPreview>>(
    //   `${this._apiBaseUrl}/presentations`,
    //   { params: query || {} },
    // );
  }

  getPresentationDetail(slug: string): Observable<PresentationPreview> {
    // Find the presentation preview by slug
    // This is a mock implementation; replace with real API call
    const preview = MOCK_PRESENTATIONS.find((p) => p.slug === slug);

    if (!preview) {
      throw new Error(`Presentation with slug "${slug}" not found`);
    }

    return of(preview);
    // TODO - add real API
    // return this._http.get<PresentationDetails>(
    //   `${this._apiBaseUrl}/presentations/${slug}`,
    // );
  }
}
