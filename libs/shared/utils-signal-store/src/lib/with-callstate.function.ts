import { signalStoreFeature, withComputed, withState } from '@ngrx/signals';
import { CallState, LoadingState } from './callstate.type';
import { computed, Signal } from '@angular/core';
import { capitalize, CapitalizeWords, Join, uncapitalize } from './helpers';

type CallStateName<T extends string> = Uncapitalize<Join<CapitalizeWords<T>>>;

type CapitalizedCallStateName<T extends string> = Capitalize<CallStateName<T>>;

function toCallStateName<T extends string>(callStateName: T): CallStateName<T> {
  return callStateName
    .trim()
    .split(' ')
    .map((word, i) => (i === 0 ? uncapitalize(word) : capitalize(word)))
    .join('') as CallStateName<T>;
}

type CallStateStoreState<T extends string, Error = unknown> = Record<
  `${CallStateName<T>}CallState`,
  CallState<Error>
>;

type isInitKey<T extends string> = `is${CapitalizedCallStateName<T>}Init`;
type isLoadingKey<T extends string> = `is${CapitalizedCallStateName<T>}Loading`;
type isLoadedKey<T extends string> = `is${CapitalizedCallStateName<T>}Loaded`;
type isErrorKey<T extends string> = `is${CapitalizedCallStateName<T>}Error`;
type errorKey<T extends string> = `${CallStateName<T>}Error`;

type CallStateComputed<T extends string, Error = unknown> = Record<
  isInitKey<T>,
  Signal<boolean>
> &
  Record<isLoadingKey<T>, Signal<boolean>> &
  Record<isLoadedKey<T>, Signal<boolean>> &
  Record<isErrorKey<T>, Signal<boolean>> &
  Record<errorKey<T>, Signal<Error | null>>;

export function withCallState<Error = unknown, T extends string = string>(
  callStateName: T
) {
  const fixedCallStateName: CallStateName<T> =
    toCallStateName<T>(callStateName);
  const capitalizedCallStateName = capitalize(fixedCallStateName);
  const callStateKey =
    `${fixedCallStateName}CallState` as `${CallStateName<T>}CallState`;

  const initState: CallStateStoreState<T, Error> = {
    [callStateKey]: LoadingState.INIT,
  } as CallStateStoreState<T, Error>;

  return signalStoreFeature(
    withState<CallStateStoreState<T, Error>>(initState),
    withComputed((state) => {
      const callState = (state as never)[callStateKey] as () => CallState;
      const isInitComputedKey =
        `is${capitalizedCallStateName}Init` as isInitKey<T>;
      const isLoadingComputedKey =
        `is${capitalizedCallStateName}Loading` as isLoadingKey<T>;
      const isLoadedComputedKey =
        `is${capitalizedCallStateName}Loaded` as isLoadedKey<T>;
      const isErrorComputedKey =
        `is${capitalizedCallStateName}Error` as isErrorKey<T>;
      const errorComputedKey = `${fixedCallStateName}Error` as errorKey<T>;

      return {
        [isInitComputedKey]: computed(() => callState() === LoadingState.INIT),
        [isLoadingComputedKey]: computed(
          () => callState() === LoadingState.LOADING
        ),
        [isLoadedComputedKey]: computed(
          () => callState() === LoadingState.LOADED
        ),
        [isErrorComputedKey]: computed(() => {
          const state = callState();
          return typeof state === 'object' && 'error' in state;
        }),
        [errorComputedKey]: computed(() => {
          const state = callState();
          return typeof state === 'object' && 'error' in state
            ? (state.error as Error)
            : null;
        }),
      } as CallStateComputed<T, Error>;
    })
  );
}
