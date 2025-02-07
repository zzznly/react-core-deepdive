// export interface VirtualDOM {
//   node: ReactElement;
// }

// export type ReactElement = {
//   type: ReactElementType;
//   props: Record<string, unknown> | null;
//   children: (VirtualDOM | string | number)[];
//   ref?: any;
// };

// export type ReactElementType = keyof HTMLElementTagNameMap | string | Function;

// export type JSXElement = VirtualDOM;

export type ReactElement<
  P = any,
  T extends ReactElementType = ReactElementType
> = {
  type: T;
  props: P & { children?: ReactNode };
  key?: string | number | null;
  ref?: Ref<any>;
};

export type ReactElementType =
  | keyof HTMLElementTagNameMap
  | string
  | FunctionComponent<any>;

export type FunctionComponent<P = {}> = (props: P) => ReactElement | null;

export type ReactNode =
  | ReactElement
  | string
  | number
  | boolean
  | null
  | undefined
  | ReactNode[];

export interface Ref<T> {
  current: T | null;
}

export type JSXElement = ReactElement;
