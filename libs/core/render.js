export default function render(vdom, container, oldDom = container.firstChild) {
  console.log("Rendering VDOM:", vdom); // vdom이 정상적으로 들어오는지 확인

  if (!vdom) {
    console.error("VDOM is undefined!", vdom);
    return;
  }

  if (typeof vdom === "string" || typeof vdom === "number") {
    if (oldDom && oldDom.nodeType === 3) {
      if (oldDom.nodeValue !== String(vdom)) {
        oldDom.nodeValue = vdom;
      }
    } else {
      const textNode = document.createTextNode(vdom);
      container.replaceChild(textNode, oldDom);
    }
    return;
  }

  if (typeof vdom.node.type === "function") {
    const componentVdom = vdom.node.type(vdom.node.props);
    render(componentVdom, container, oldDom);
    return;
  }

  let domElement = oldDom;

  if (!domElement || domElement.nodeName.toLowerCase() !== vdom.node.type) {
    domElement = document.createElement(vdom.node.type);
    if (oldDom) {
      container.replaceChild(domElement, oldDom);
    } else {
      container.appendChild(domElement);
    }
  }

  const prevProps = oldDom?._vdom?.props || {};
  const nextProps = vdom.node.props || {};

  // 1. 이전 props와 현재 props가 동일하면 렌더링 건너뛰기
  if (!hasPropsChanged(prevProps, nextProps)) {
    return;
  }

  updateProps(domElement, nextProps, prevProps);

  const oldChildren = prevProps.children || [];
  const newChildren = nextProps.children || [];

  updateChildren(domElement, newChildren, oldChildren);

  domElement._vdom = vdom;
}

// 2. props 변경 여부 확인 함수
function hasPropsChanged(prevProps, nextProps) {
  const prevKeys = Object.keys(prevProps);
  const nextKeys = Object.keys(nextProps);

  if (prevKeys.length !== nextKeys.length) return true;

  return nextKeys.some((key) => prevProps[key] !== nextProps[key]);
}

// 3. updateProps 수정: 기본값 추가하여 오류 방지
function updateProps(dom, newProps = {}, oldProps = {}) {
  Object.keys(newProps)
    .filter((key) => key !== "children")
    .forEach((name) => {
      if (newProps[name] !== oldProps[name]) {
        dom[name] = newProps[name];
      }
    });

  Object.keys(oldProps)
    .filter((key) => key !== "children")
    .forEach((name) => {
      if (!(name in newProps)) {
        dom[name] = null;
      }
    });
}

// 4. updateChildren 수정: 기본값 추가하여 오류 방지
function updateChildren(dom, newChildren = [], oldChildren = []) {
  newChildren = Array.isArray(newChildren) ? newChildren : [newChildren];
  oldChildren = Array.isArray(oldChildren) ? oldChildren : [oldChildren];

  for (let i = 0; i < newChildren.length || i < oldChildren.length; i++) {
    render(newChildren[i], dom, dom.childNodes[i]);
  }
}
