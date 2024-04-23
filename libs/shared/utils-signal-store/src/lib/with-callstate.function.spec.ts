import { signalStore, withMethods, withState } from '@ngrx/signals';
import { withCallState, withError } from './with-callstate.function';

describe('withCallState', () => {
  describe('with default error type', () => {
    const FruitListSignalStore = signalStore(
      { providedIn: 'root' },
      withState({ fruitList: [] }),
      withCallState('fetch fruit list'),
      withMethods(() => {
        return {
          foo: () => {
            return;
          },
        };
      }),
    );

    const fruitListSignalStore = new FruitListSignalStore();

    it('should add proper call state signal to the state', () => {
      expect(fruitListSignalStore.isFetchFruitListInit).toBeDefined();
    });

    it('should add proper "is init" call state signal to the state', () => {
      expect(fruitListSignalStore.isFetchFruitListInit).toBeDefined();
    });

    it('should add proper "is loading" call state signal to the state', () => {
      expect(fruitListSignalStore.isFetchFruitListLoading).toBeDefined();
    });

    it('should add proper "is loaded" call state signal to the state', () => {
      expect(fruitListSignalStore.isFetchFruitListLoaded).toBeDefined();
    });

    it('should add proper "is error" call state signal to the state', () => {
      expect(fruitListSignalStore.isFetchFruitListError).toBeDefined();
    });

    it('should add proper "error" call state signal to the state', () => {
      expect(fruitListSignalStore.fetchFruitListError).toBeDefined();
    });
  });

  describe('with specific error type', () => {
    const FruitListSignalStore = signalStore(
      { providedIn: 'root' },
      withState({ fruitList: [] }),
      withCallState('fetch fruit list', withError<string>()),
      withMethods(() => {
        return {
          foo: () => {
            return;
          },
        };
      }),
    );

    const fruitListSignalStore = new FruitListSignalStore();

    it('should add proper call state signal to the state', () => {
      expect(fruitListSignalStore.isFetchFruitListInit).toBeDefined();
    });

    it('should add proper "is init" call state signal to the state', () => {
      expect(fruitListSignalStore.isFetchFruitListInit).toBeDefined();
    });

    it('should add proper "is loading" call state signal to the state', () => {
      expect(fruitListSignalStore.isFetchFruitListLoading).toBeDefined();
    });

    it('should add proper "is loaded" call state signal to the state', () => {
      expect(fruitListSignalStore.isFetchFruitListLoaded).toBeDefined();
    });

    it('should add proper "is error" call state signal to the state', () => {
      expect(fruitListSignalStore.isFetchFruitListError).toBeDefined();
    });

    it('should add proper "error" call state signal to the state', () => {
      expect(fruitListSignalStore.fetchFruitListError).toBeDefined();
    });
  });
});
