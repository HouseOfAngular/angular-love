export enum LoadingState {
  INIT = 'INIT',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
}

export type CallState<T = unknown> =
  | LoadingState.INIT
  | LoadingState.LOADING
  | LoadingState.LOADED
  | { error: T };
