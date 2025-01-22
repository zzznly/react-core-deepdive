const checkIsVirtualNode = (obj) => {
  if (Array.isArray(obj)) {
    return false;
  }
  if (typeof obj === "object" && obj != null && "node" in obj) {
    return true;
  }

  return false;
};

export const createElement = (component, props, ...children) => {
  if (typeof component === "function") {
    return component({ ...props, children });
  }

  return {
    node: {
      tag: component,
      props,
      children: children.flat(Infinity).map((v) => {
        if (!checkIsVirtualNode(v)) {
          return { node: v };
        }
        return v;
      }),
    },
  };
};

export const jsx = { createElement };
