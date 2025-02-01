import { VirtualNode } from "../vtu/type";

let currentVnode: VirtualNode;
let rootElement: HTMLElement;

export const render = (vnode: VirtualNode, container: HTMLElement) => {
  rootElement = container;
  currentVnode = vnode;
  console.log("render - vnode", vnode);
  const element = createVirtualNode(vnode);
  container.appendChild(element);
};

const createVirtualNode = (vnode: VirtualNode) => {
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
      domElement.appendChild(createVirtualNode(child));
    });
  }
  vnode.node.ref = domElement;
  return domElement;
};

export const rerender = (
  root: HTMLElement = rootElement,
  currentNode: VirtualNode = currentVnode
) => {
  root.innerHTML = "";
  render(currentNode, root);
};
