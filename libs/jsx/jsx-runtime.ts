import {
  JSXElement,
  VirtualDOM,
  VirtualNode,
  VirtualNodeType,
} from "../vtu/type";

export const createElement = (
  type: VirtualNodeType,
  props: Record<string, unknown> | null,
  ...children: (VirtualDOM | VirtualNode)[]
): JSXElement => {
  if (typeof type === "function") {
    return type({ ...props, children });
  }

  const element: VirtualDOM = {
    node: {
      type,
      props,
      children: children.flat(Infinity).map((v) => {
        // children 배열이 중첩 배열 일 수 있어, flatten 하여 하나의 배열로 만들기
        if (!checkIsVirtualNode(v)) {
          return { node: v };
        }
        return v;
      }),
    },
  };

  return element;
};

export const jsx = createElement;

const checkIsVirtualNode = (obj: VirtualDOM | VirtualNode): boolean => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "node" in obj &&
    !Array.isArray(obj)
  );
};
