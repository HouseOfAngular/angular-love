import { TranslocoTestingModule } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { UiAuthorCard } from './author-card-data-model';
import { AuthorCardComponent } from './author-card.component';

const selectors = {
  authorTitles: '[data-testid="author-titles"]',
};

const basicAuthor: UiAuthorCard = {
  titles: ['blogger'],
  name: 'name',
  avatarUrl: 'avatarUrl',
  position: 'position',
  slug: 'slug',
  github: 'github',
  twitter: 'twitter',
  linkedin: 'linkedin',
  description: 'description',
};

describe('AuthorCardComponent', () => {
  let spectator: Spectator<AuthorCardComponent>;
  const createComponent = createComponentFactory({
    component: AuthorCardComponent,
    imports: [
      TranslocoTestingModule.forRoot({
        langs: {
          en: {
            authorCard: {
              titles: {
                blogger: 'Blogger',
                key_contributor: 'Key Contributor',
                contributor: 'Contributor',
                gde: 'Google Developer Expert',
              },
            },
          },
        },
        preloadLangs: true,
        translocoConfig: {
          defaultLang: 'en',
          availableLangs: ['en'],
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent({ props: { author: basicAuthor } });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  describe('titles', () => {
    it('should display translated author title', () => {
      // arrange
      const author: UiAuthorCard = {
        ...basicAuthor,
        titles: ['blogger'],
      };
      spectator.setInput('author', author);

      // assert
      const titleElement = spectator.query(selectors.authorTitles);
      expect(titleElement).toContainText('Blogger');
    });

    it('should hide title element if there are no titles', () => {
      // arrange
      const author: UiAuthorCard = {
        ...basicAuthor,
        titles: [],
      };
      spectator.setInput('author', author);

      // assert
      const titleElement = spectator.query(selectors.authorTitles);
      expect(titleElement).not.toExist();
    });

    it('should concatenate multiple titles using comma', () => {
      // arrange
      const author: UiAuthorCard = {
        ...basicAuthor,
        titles: ['blogger', 'gde'],
      };
      spectator.setInput('author', author);

      // assert
      const titleElement = spectator.query(selectors.authorTitles);
      expect(titleElement).toContainText('Blogger, Google Developer Expert');
    });

    it('should not display title if it is not translated', () => {
      // arrange
      const author: UiAuthorCard = {
        ...basicAuthor,
        titles: ['blogger', 'hoa', 'gde'],
      };
      spectator.setInput('author', author);

      // assert
      const titleElement = spectator.query(selectors.authorTitles);
      expect(titleElement).toContainText('Blogger, Google Developer Expert');
    });
  });
});
