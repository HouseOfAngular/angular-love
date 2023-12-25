// credits for ngrx team
// these helpers comes mostly from https://github.com/ngrx/platform/tree/fcf0d8dcad6221802c58707e1bcf1d4e515e4d52/modules/store

export function capitalize<T extends string>(text: T): Capitalize<T> {
  return (text.charAt(0).toUpperCase() + text.substring(1)) as Capitalize<T>;
}

export function uncapitalize<T extends string>(text: T): Uncapitalize<T> {
  return (text.charAt(0).toLowerCase() + text.substring(1)) as Uncapitalize<T>;
}

export type Join<
  Str extends string,
  Separator extends string = ' '
> = Str extends `${infer First}${Separator}${infer Rest}`
  ? Join<`${First}${Rest}`, Separator>
  : Str;

export type CapitalizeWords<Str extends string> =
  Str extends `${infer First} ${infer Rest}`
    ? `${Capitalize<First>} ${CapitalizeWords<Rest>}`
    : Capitalize<Str>;
