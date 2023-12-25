// credits for ngrx team
// these helpers comes mostly from https://github.com/ngrx/platform/tree/fcf0d8dcad6221802c58707e1bcf1d4e515e4d52/modules/store

export type CapitalizeWords<Str extends string> =
  Str extends `${infer First} ${infer Rest}`
    ? `${Capitalize<First>} ${CapitalizeWords<Rest>}`
    : Capitalize<Str>;

export function capitalize<T extends string>(text: T): Capitalize<T> {
  return (text.charAt(0).toUpperCase() + text.substring(1)) as Capitalize<T>;
}

export function capitalizeWords<T extends string>(text: T): CapitalizeWords<T> {
  return text
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ') as CapitalizeWords<T>;
}
