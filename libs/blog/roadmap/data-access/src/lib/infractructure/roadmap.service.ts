import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import {
  AngularLoveNode,
  NodeDetails,
  RegularNode,
} from '@angular-love/roadmap-utils';
import { ConfigService } from '@angular-love/shared/config';

const angularLoveNodeMock: AngularLoveNode = {
  id: 'angular-love',
  title: 'Angular.Love Roadmap Introduction',
  nodeType: 'angular-love',
  description:
    'The Angular Roadmap on Angular.Love is your go-to guide for learning Angular the right way. It breaks down key concepts, best practices, and useful resources in a clear, structured way. Plus, it’s packed with valuable materials and constantly updated to keep up with the latest trends.',
  additionalDescription: `Before diving into Angular, it's essential to have a solid understanding of the following concepts: HTML & CSS – Structure and styling of web pages, including Flexbox, Grid, and responsiveness; JavaScript (ES6+) – Core concepts like variables, functions, promises, and async/await; TypeScript – A typed version of JavaScript with interfaces, generics, and decorators; Node.js & npm – Running JavaScript outside the browser and managing packages; Git – Handling code versions, branches, and teamwork; APIs & HTTP – Making requests and working with JSON data`,
  creators: [
    { name: 'Miłosz Rutkowski', slug: 'milosz-rutkowski' },
    { name: 'Łukasz Myszkowski', slug: 'lukasz-myszkowski' },
    { name: 'Damian Brzeziński', slug: 'damian-brzezinski' },
    { name: 'Dominik Kalinowski', slug: 'dominik-kalinowski' },
  ],
};
const regularNodeMock: RegularNode = {
  id: 'change-detection',
  title: 'change detection',
  nodeType: 'regular',
  description:
    'Change detection in Angular synchronizes the component state with the DOM by tracking and updating data changes. It uses a tree-based approach, where updates propagate from the root component down to child components. The framework provides two strategies: Default, which checks all components, and OnPush, which optimizes performance by only checking components when their inputs change.',
  movies: [
    {
      url: 'https://www.youtube.com/watch?v=KSFPOIauEPU',
      title: 'Angular RxJS and Signals: Better Together',
    },
  ],
  articles: [
    {
      title: 'Signals in Angular: deep dive for busy developers',
      url: 'https://angular.love/signals-in-angular-deep-dive-for-busy-developers',
    },
    {
      title: 'Angular Signals: A New Feature in Angular 16',
      url: 'https://angular.love/angular-signals-a-new-feature-in-angular-16',
    },
    {
      title: 'Why Angular signals won’t replace',
      url: 'https://angular.love/why-angular-signals-wont-replace-rxjs',
    },
  ],
};

const regularNodeMockNoContent: RegularNode = {
  id: 'lifecycle',
  title: 'lifecycle',
  nodeType: 'regular',
  description:
    'Change detection in Angular synchronizes the component state with the DOM by tracking and updating data changes. It uses a tree-based approach, where updates propagate from the root component down to child components. The framework provides two strategies: Default, which checks all components, and OnPush, which optimizes performance by only checking components when their inputs change.',
  movies: [],
  articles: [],
};

@Injectable({ providedIn: 'root' })
export class RoadmapService {
  private readonly _http = inject(HttpClient);
  private readonly _apiBaseUrl = inject(ConfigService).get('apiBaseUrl');

  getNodeDetails(id: string): Observable<NodeDetails> {
    console.log(id);
    if (id === 'angular-love') {
      return of(angularLoveNodeMock);
    } else if (id === 'lifecycle') {
      return of(regularNodeMockNoContent);
    } else {
      return of(regularNodeMock);
    }
  }
}
