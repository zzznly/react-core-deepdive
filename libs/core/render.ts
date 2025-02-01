import { VirtualNode } from "../vtu/type";

let currentVirtualDom;
let rootElement;

export const render = (vnode: VirtualNode, container: HTMLElement) => {
  rootElement = container; // rootElement를 최초 렌더(mount)시 등록
  currentVirtualDom = vnode; // 현재 virtualDOM Node를 최초 mount된 컴포넌트로 등록
  console.log("render - vNode", vnode);
  const element = createVirtualDom(vnode);
  container.appendChild(element);
};

export const createVirtualDom = (vnode: VirtualNode) => {
  if (typeof vnode.node === "string" || typeof vnode.node === "number") {
    return document.createTextNode(vnode.node as string);
  }
  const domElement = document.createElement(vnode.node.type);

  if (vnode.node.props)
    Object.keys(vnode.node.props).forEach((key) => {
      domElement[key] = vnode.node.props[key];
    });

  if (vnode.node.children) {
    vnode.node.children.forEach((child: VirtualNode) => {
      domElement.appendChild(createVirtualDom(child));
    });
  }
  vnode.node.ref = domElement;
  return domElement;
};

export const rerender = (
  rootElement: HTMLElement,
  currentVnode: VirtualNode
) => {
  rootElement.innerHTML = "";
  render(currentVnode, rootElement);
};
