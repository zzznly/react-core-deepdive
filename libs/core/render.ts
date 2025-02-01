import { VirtualNode } from "../vtu/type";

export default function render(
  vdom: VirtualNode,
  container: HTMLElement | null,
  oldDom: ChildNode | HTMLElement | null | undefined = container?.firstChild
) {
  console.log("Rendering VDOM:", vdom);
  if (typeof vdom.node === "string" || typeof vdom.node === "number") {
    if (oldDom && oldDom.nodeType === 3) {
      if (oldDom.nodeValue !== String(vdom.node)) {
        oldDom.nodeValue = String(vdom.node);
      }
    } else {
      const textNode = document.createTextNode(String(vdom.node));
      if (oldDom) {
        container?.replaceChild(textNode, oldDom);
      } else {
        container?.appendChild(textNode);
      }
    }
    return;
  }

  // 🔹 2. 함수형 컴포넌트 처리
  if (typeof vdom.node.type === "function") {
    const vdomComponent = vdom.node.type(vdom.node.props);
    render(vdomComponent, container, oldDom);
    return;
  }

  // 🔹 3. 일반 DOM 요소 (div, span 등)
  let domElement = oldDom as HTMLElement;
  console.log("Old DOM Element: ", oldDom);

  // 🔸 `vdom.node.type`이 `undefined`인 경우 방지
  if (!vdom.node || typeof vdom.node.type !== "string") {
    console.error("Invalid VDOM structure:", vdom);
    return;
  }

  // 🔹 4. 기존 DOM이 없거나 태그가 다르면 새로 생성
  if (!domElement || domElement.nodeName.toLowerCase() !== vdom.node.type) {
    domElement = document.createElement(vdom.node.type);
    console.log("New DOM Element Created:", domElement);

    if (oldDom) {
      container.replaceChild(domElement, oldDom);
    } else {
      container.appendChild(domElement);
    }
  }

  // 🔥 `_vdom`을 현재 `vdom`으로 저장하여 다음 비교에 활용
  domElement._vdom = vdom; // ✅ `_vdom` 저장

  const prevProps = (oldDom as any)?._vdom?.props || {}; // ✅ `oldDom._vdom`이 없으면 `{}` 기본값
  const nextProps = vdom.node.props || {};

  console.log("Prev Props:", prevProps, "Next Props:", nextProps);

  // 🔹 5. 이전 props와 현재 props가 동일하면 렌더링 건너뛰기
  if (!hasPropsChanged(prevProps, nextProps)) {
    return;
  }

  updateProps(domElement, nextProps, prevProps);

  // 🔹 6. 자식 요소 업데이트 (Key 기반 비교 및 불필요한 삭제 방지)
  const oldChildren = prevProps.children || [];
  const newChildren = vdom.node.children || [];
  updateChildren(domElement, newChildren, oldChildren);

  domElement._vdom = vdom; // ✅ 업데이트 후 `_vdom` 저장
}

// 🔹 7. props 변경 여부 확인 함수
function hasPropsChanged(prevProps, nextProps) {
  const prevKeys = Object.keys(prevProps);
  const nextKeys = Object.keys(nextProps);

  if (prevKeys.length !== nextKeys.length) return true;

  return nextKeys.some((key) => prevProps[key] !== nextProps[key]);
}

// 🔹 8. updateProps 수정: 기본값 추가하여 오류 방지
function updateProps(dom, newProps = {}, oldProps = {}) {
  Object.keys(newProps)
    .filter((key) => key !== "children")
    .forEach((name) => {
      if (newProps[name] !== oldProps[name]) {
        dom.setAttribute(name, newProps[name]);
      }
    });

  Object.keys(oldProps)
    .filter((key) => key !== "children")
    .forEach((name) => {
      if (!(name in newProps)) {
        dom.removeAttribute(name);
      }
    });
}

// 🔹 9. Key 기반의 자식 업데이트 및 삭제 방지
function updateChildren(dom, newChildren = [], oldChildren = []) {
  const oldKeys = new Map();
  oldChildren.forEach((child, index) => {
    const key = child?.props?.key || index;
    oldKeys.set(key, dom.childNodes[index]);
  });

  newChildren.forEach((child, index) => {
    const key = child?.props?.key || index;
    const oldChildNode = oldKeys.get(key);

    render(child, dom, oldChildNode || null);
  });

  // 불필요한 요소 삭제
  while (dom.childNodes.length > newChildren.length) {
    dom.removeChild(dom.lastChild);
  }
}
