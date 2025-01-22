import { createVirtualDom } from "./createVirtualDom";

let currentVirtualDom;
let rootElement;

export const render = (vNode, rootContainer) => {
  rootElement = rootContainer; // rootElement를 최초 렌더(mount)시 등록
  currentVirtualDom = vNode; // 현재 virtualDOM Node를 최초 mount된 컴포넌트로 등록
  console.log("render - vNode", vNode);
  const element = createVirtualDom(vNode);
  rootContainer.appendChild(element);
};

export const createVirtualDom = (element) => {
  if (typeof element.node === "string" || typeof element.node === "number") {
    return document.createTextNode(element.node);
  }

  const DOMElement = document.createElement(element.node.tag);

  if (element.node.props)
    Object.keys(element.node.props).forEach((key) => {
      DOMElement[key] = element.node.props[key];
    });

  if (element.node.children) {
    element.node.children.forEach((child) => {
      DOMElement.appendChild(createVirtualDom(child));
    });
  }
  element.ref = DOMElement;

  return DOMElement;
};
