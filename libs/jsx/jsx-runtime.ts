import {
  JSXElement,
  VirtualDOM,
  VirtualNode,
  VirtualDOMType,
} from "../vtu/type";

export const createElement = (
  type: VirtualDOMType,
  props: Record<string, unknown> | null,
  ...children: (VirtualDOM | VirtualNode | string | number)[]
): JSXElement => {
  if (typeof type === "function") {
    return type({ ...props, children });
  }

  const element: VirtualDOM = {
    type,
    props,
    children: children.flat(Infinity).map((v) => {
      if (!isVirtualNode(v)) {
        return { node: v };
      }
      return v;
    }) as (VirtualNode | VirtualDOMType)[],
  };

  return { node: element };
};

export const jsx = createElement;

const isVirtualNode = (obj: any): obj is VirtualNode => {
  return (
    !Array.isArray(obj) &&
    typeof obj === "object" &&
    obj != null &&
    "node" in obj
  );
};
