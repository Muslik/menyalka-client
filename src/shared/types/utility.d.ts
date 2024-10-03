type Prettify<T> = T extends {}
  ? T extends infer Obj
    ? T extends Date
      ? Date
      : { [Key in keyof Obj]: Prettify<Obj[Key]> } & {}
    : never
  : T;

type EventFor<
  TElement extends keyof JSX.IntrinsicElements,
  THandler extends Extract<keyof JSX.IntrinsicElements[TElement], BeginsWithOn>,
> = JSX.IntrinsicElements[TElement][THandler] extends ((e: infer TEvent) => any) | undefined
  ? TEvent
  : never;

type NonFalsy<T> = T extends false | 0 | '' | null | undefined | 0n ? never : T;

type NotNullRecord<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

interface Array<T> {
  filter(predicate: BooleanConstructor, thisArg?: any): NonFalsy<T>[];
}

interface ReadonlyArray<T> {
  filter(predicate: BooleanConstructor, thisArg?: any): NonFalsy<T>[];
}

// Проверяем что мы не дошли до этого места
declare function assertUnreachable(x: never): void;
