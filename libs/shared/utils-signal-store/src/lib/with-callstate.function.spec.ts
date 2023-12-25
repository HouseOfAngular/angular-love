import { withCallState } from './with-callstate.function';
import { signalStore, withMethods } from '@ngrx/signals';

describe('withCallState', () => {
  const FruitListSignalStore = signalStore(
    { providedIn: 'root' },
    withCallState<unknown>('fetch fruit list'),
    withMethods(() => {
      return {
        foo: () => {},
      };
    })
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
