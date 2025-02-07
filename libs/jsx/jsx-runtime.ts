import {
  JSXElement,
  ReactElementType,
  ReactElement,
  ReactNode,
} from "../types/virtual-dom";

export const createElement = <P = {}>(
  type: ReactElementType,
  props: P & { children?: ReactNode } = {} as P & { children?: ReactNode },
  ...children: ReactNode[]
): JSXElement => {
  // 함수형 컴포넌트 처리
  if (typeof type === "function") {
    return createElement(type, { ...props, children });
  }

  const element: ReactElement<P> = {
    type,
    props: {
      ...props,
      children,
    },
  };

  return element;
};

export const jsx = createElement;
