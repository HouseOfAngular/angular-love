import { signalStoreFeature, withComputed, withState } from '@ngrx/signals';
import { CallState, LoadingState } from './callstate.type';
import { computed, Signal } from '@angular/core';
import { capitalize, CapitalizeWords } from './helpers/capitalize.function';
import { uncapitalize } from './helpers/uncapitalize.function';
import { Join } from './helpers/join.type';

type CapitalizedCallStateName<T extends string> = Join<CapitalizeWords<T>>;

type CallStateName<T extends string> = Uncapitalize<
  CapitalizedCallStateName<T>
>;

function toCallStateName<T extends string>(callStateName: T): CallStateName<T> {
  const separator = ' ';
  const [firstWord, ...restWords] = callStateName.trim().split(separator);
  return [
    uncapitalize(firstWord),
    ...restWords.map((word) => capitalize(word)),
  ].join('') as CallStateName<T>;
}

type CallStateNameWithPostfix<T extends string> =
  `${CallStateName<T>}CallState`;

type CallStateStoreState<T extends string, Error> = Record<
  CallStateNameWithPostfix<T>,
  CallState<Error>
>;

type isInitKey<T extends string> = `is${CapitalizedCallStateName<T>}Init`;
type isLoadingKey<T extends string> = `is${CapitalizedCallStateName<T>}Loading`;
type isLoadedKey<T extends string> = `is${CapitalizedCallStateName<T>}Loaded`;
type isErrorKey<T extends string> = `is${CapitalizedCallStateName<T>}Error`;
type errorKey<T extends string> = `${CallStateName<T>}Error`;

type CallStateComputed<T extends string, Error> = Record<
  isInitKey<T>,
  Signal<boolean>
> &
  Record<isLoadingKey<T>, Signal<boolean>> &
  Record<isLoadedKey<T>, Signal<boolean>> &
  Record<isErrorKey<T>, Signal<boolean>> &
  Record<errorKey<T>, Signal<Error | null>>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type WithError<E> = <E>() => void;

export function withError<E>(): WithError<E> {
  return () => {};
}

type CallStateDefaultErrorType = unknown;

export function withCallState<
  T extends string,
  ErrorType = CallStateDefaultErrorType
>(
  name: T,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  withError?: WithError<ErrorType>
) {
  const callStateName: CallStateName<T> = toCallStateName<T>(name);
  const capitalizedCallStateName = capitalize(callStateName);
  const callStateNameWithPostfix =
    `${callStateName}CallState` as CallStateNameWithPostfix<T>;

  const initState: CallStateStoreState<T, ErrorType> = {
    [callStateNameWithPostfix]: LoadingState.INIT,
  } as CallStateStoreState<T, ErrorType>;

  return signalStoreFeature(
    withState(initState),
    withComputed((state) => {
      const callState = (state as never)[callStateNameWithPostfix] as Signal<
        CallState<ErrorType>
      >;
      const isInitComputedKey =
        `is${capitalizedCallStateName}Init` as isInitKey<T>;
      const isLoadingComputedKey =
        `is${capitalizedCallStateName}Loading` as isLoadingKey<T>;
      const isLoadedComputedKey =
        `is${capitalizedCallStateName}Loaded` as isLoadedKey<T>;
      const isErrorComputedKey =
        `is${capitalizedCallStateName}Error` as isErrorKey<T>;
      const errorComputedKey =
        `${callStateNameWithPostfix}Error` as errorKey<T>;

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
            ? (state.error as ErrorType)
            : null;
        }),
      } as CallStateComputed<T, ErrorType>;
    })
  );
}
