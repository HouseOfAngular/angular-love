// credits for ngrx team
// these helpers comes mostly from https://github.com/ngrx/platform/tree/fcf0d8dcad6221802c58707e1bcf1d4e515e4d52/modules/store

export type Join<
  Str extends string,
  Separator extends string = ' '
> = Str extends `${infer First}${Separator}${infer Rest}`
  ? Join<`${First}${Rest}`, Separator>
  : Str;
