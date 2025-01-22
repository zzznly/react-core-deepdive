import { createVirtualDom } from "./dom/create";

export const render = (vNode, rootContainer) => {
  let currentVirtualDom;
  let rootElement;

  rootElement = rootContainer; // rootElement를 최초 렌더(mount)시 등록
  currentVirtualDom = vNode; // 현재 virtualDOM Node를 최초 mount된 컴포넌트로 등록
  console.log("render - vNode", vNode);
  const element = createVirtualDom(vNode);
  rootContainer.appendChild(element);
};
