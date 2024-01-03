// credits for ngrx team
// these helpers comes mostly from https://github.com/ngrx/platform/tree/fcf0d8dcad6221802c58707e1bcf1d4e515e4d52/modules/store

export function uncapitalize<T extends string>(text: T): Uncapitalize<T> {
  return (text.charAt(0).toLowerCase() + text.substring(1)) as Uncapitalize<T>;
}
