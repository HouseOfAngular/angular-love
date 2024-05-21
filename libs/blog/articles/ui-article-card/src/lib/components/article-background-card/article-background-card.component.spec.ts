import { DatePipe, NgClass } from '@angular/common';
import { provideRouter, RouterLink } from '@angular/router';
import {
  byTestId,
  createComponentFactory,
  Spectator,
} from '@ngneat/spectator/jest';

import { ArticleCard } from '@angular-love/blog/shared/types';
import { AvatarComponent } from '@angular-love/blog/shared/ui-avatar';
import { IconComponent } from '@angular-love/blog/shared/ui-icon';

import { ArticleBackgroundCardComponent } from './article-background-card.component';

const articleMock: ArticleCard = {
  title: 'Card Title',
  readingTime: '8',
  excerpt:
    'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, se',
  featuredImageUrl: '/assets/storybook/article-featured-image.png',
  author: {
    name: 'Author Data',
    avatarUrl: '/assets/storybook/author-image.jpg',
  },
  slug: '',
  publishDate: new Date('2021-05-01').toISOString(),
};

describe('ArticleBackgroundCardComponent', () => {
  let spectator: Spectator<ArticleBackgroundCardComponent>;
  const createComponent = createComponentFactory({
    component: ArticleBackgroundCardComponent,
    imports: [AvatarComponent, RouterLink, DatePipe, NgClass, IconComponent],
    providers: [provideRouter([])],
  });

  it(`Should have element with id: 'card-bg-image' having class : 'bg-cover' when input layout is equal to 'compact'`, () => {
    spectator = createComponent({
      props: {
        layout: 'compact',
        article: articleMock,
      },
    });
    expect(spectator.query(byTestId('card-bg-image'))).toHaveClass('bg-cover');
  });

  it(`Should have element with id: 'card-bg-image' having classes : 'bg-contain bg-center' when input layout is equal to 'hero'`, () => {
    spectator = createComponent({
      props: {
        layout: 'hero',
        article: articleMock,
      },
    });
    expect(spectator.query(byTestId('card-bg-image'))).toHaveClass([
      'bg-contain',
      'bg-center',
    ]);
  });

  it(`Should have element with id: 'card-bg-image-shadow' having class : 'bg-al-gray-500' when input layout is equal to 'compact'`, () => {
    spectator = createComponent({
      props: {
        layout: 'compact',
        article: articleMock,
      },
    });
    expect(spectator.query(byTestId('card-bg-image-shadow'))).toHaveClass([
      'h-full',
      'bg-al-gray-500',
    ]);
  });

  it(`Should have element with id: 'card-bg-image-shadow' having classes : 'bg-al-gradient-black rounded-lg' when input layout is equal to 'hero'`, () => {
    spectator = createComponent({
      props: {
        layout: 'hero',
        article: articleMock,
      },
    });
    expect(spectator.query(byTestId('card-bg-image-shadow'))).toHaveClass([
      'h-full',
      'bg-al-gradient-black',
      'hover:bg-al-gradient-black-red',
      'rounded-lg',
    ]);
  });

  it(`Should have element with id: 'card-data' having classes : 'px-6, pt-6' when input layout is equal to 'compact'`, () => {
    spectator = createComponent({
      props: {
        layout: 'compact',
        article: articleMock,
      },
    });
    expect(spectator.query(byTestId('card-data'))).toHaveClass([
      'px-6',
      'pt-6',
    ]);
  });

  it(`Should have element with id: 'card-data' having classes : 'px-8, pt-8' when input layout is equal to 'hero'`, () => {
    spectator = createComponent({
      props: {
        layout: 'hero',
        article: articleMock,
      },
    });
    expect(spectator.query(byTestId('card-data'))).toHaveClass([
      'px-8',
      'pt-8',
    ]);
  });

  it(`Should have element with id: 'card-content' having classes : 'px-6 pb-6 pt-8' when input layout is equal to 'compact'`, () => {
    spectator = createComponent({
      props: {
        layout: 'compact',
        article: articleMock,
      },
    });
    expect(spectator.query(byTestId('card-content'))).toHaveClass([
      'px-6',
      'pb-6',
      'pt-8',
    ]);
  });

  it(`Should have element with id: 'card-content' having classes : 'px-6 pb-6 pt-8' when input layout is equal to 'compact'`, () => {
    spectator = createComponent({
      props: {
        layout: 'compact',
        article: articleMock,
      },
    });
    expect(spectator.query(byTestId('card-content'))).toHaveClass([
      'px-6',
      'pb-6',
      'pt-8',
    ]);
  });

  it(`Should have element with id: 'card-content' having classes : 'px-8 pb-8 pt-44' when input layout is equal to 'hero'`, () => {
    spectator = createComponent({
      props: {
        layout: 'hero',
        article: articleMock,
      },
    });
    expect(spectator.query(byTestId('card-content'))).toHaveClass([
      'px-8',
      'pb-8',
      'pt-44',
    ]);
  });

  it(`Should have element with id: 'card-span-date' if layout props is equal to: 'hero'`, () => {
    spectator = createComponent({
      props: {
        layout: 'hero',
        article: articleMock,
      },
    });
    expect(spectator.query(byTestId('card-span-date'))).toBeTruthy();
  });
});
