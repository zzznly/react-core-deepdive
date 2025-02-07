import {
  ReactElement,
  ReactNode,
  FunctionComponent,
} from "../types/virtual-dom";

let currentVnode: ReactElement | null = null;
let rootElement: HTMLElement | null = null;

/**
 * Commit Phase: Virtual DOM을 실제 DOM으로 변환하는 함수
 */
const createDOM = (vnode: ReactElement | string | number): Node => {
  if (typeof vnode === "string" || typeof vnode === "number") {
    return document.createTextNode(vnode.toString());
  }

  if (typeof vnode.type === "function") {
    const component = vnode.type as FunctionComponent<any>;
    const renderedVnode = component(vnode.props);
    return createDOM(renderedVnode as ReactElement);
  }

  const domElement = document.createElement(vnode.type as string);
  applyProps(domElement, {}, vnode.props);

  // children이 undefined인 경우 예외 처리
  if (vnode.props?.children) {
    vnode.props.children.forEach((child: ReactNode) => {
      if (child !== null && child !== undefined) {
        domElement.appendChild(createDOM(child as ReactElement));
      }
    });
  }

  if (vnode.ref) {
    vnode.ref.current = domElement;
  }

  return domElement;
};

/**
 * 기존 Virtual DOM을 업데이트하는 함수 (재렌더링)
 */
const updateDOM = (
  parent: HTMLElement,
  oldVnode: ReactElement,
  newVnode: ReactElement
) => {
  // Virtual DOM이 동일하면 업데이트 생략 (최적화)
  console.log("## updateDOM: ", oldVnode, newVnode);
  // if (oldVnode === newVnode) return;

  if (!oldVnode) {
    parent.appendChild(createDOM(newVnode));
    return;
  }

  // type이 다르면 전체 노드를 교체
  if (oldVnode.type !== newVnode.type) {
    parent.replaceChild(createDOM(newVnode), parent.firstChild!);
    return;
  }

  // props 변경된 부분만 업데이트
  applyProps(parent, oldVnode.props, newVnode.props);

  // children 변경 감지 후 업데이트
  updateChildren(parent, oldVnode.props.children, newVnode.props.children);
};

/**
 * Commit Phase: 변경된 props만 적용하는 함수
 */
const applyProps = (dom: HTMLElement, oldProps: any, newProps: any) => {
  Object.keys(oldProps).forEach((key) => {
    if (!(key in newProps)) {
      dom.removeAttribute(key);
    }
  });

  Object.entries(newProps).forEach(([key, value]) => {
    if (key === "children") return;

    // Reconciliation: props가 변경되지 않았으면 업데이트 생략 (최적화)
    if (oldProps[key] === newProps[key]) {
      return;
    }

    if (key.startsWith("on") && typeof value === "function") {
      const eventType = key.slice(2).toLowerCase();
      dom.removeEventListener(eventType, oldProps[key]);
      dom.addEventListener(eventType, value);
    } else {
      dom.setAttribute(key, value as string);
    }
  });
};

/**
 * Render Phase: 기존 children과 새로운 children을 비교하여 변경된 부분만 업데이트
 */
const updateChildren = (
  parent: HTMLElement,
  oldChildren: ReactNode | undefined,
  newChildren: ReactNode | undefined
) => {
  console.log(222, "oldChildren: ", oldChildren, "newChildren: ", newChildren);
  if (!Array.isArray(newChildren)) newChildren = [newChildren];
  if (!Array.isArray(oldChildren)) oldChildren = [oldChildren];

  const maxLength = Math.max(oldChildren.length, newChildren.length);
  for (let i = 0; i < maxLength; i++) {
    const oldChild = oldChildren[i];
    const newChild = newChildren[i];

    if (oldChild === newChild) continue;

    if (newChild === undefined) {
      if (parent.childNodes[i]) {
        parent.removeChild(parent.childNodes[i]); // 존재하는 노드만 삭제
      }
      continue;
    }

    if (oldChild === undefined) {
      parent.appendChild(createDOM(newChild as ReactElement));
      continue;
    }

    if (typeof oldChild === "string" || typeof newChild === "string") {
      if (oldChild !== newChild) {
        if (parent.childNodes[i]) {
          parent.childNodes[i].textContent = newChild as string;
        }
      }
      continue;
    }

    updateDOM(
      parent.childNodes[i] as HTMLElement,
      oldChild as ReactElement,
      newChild as ReactElement
    );
  }
};

/**
 * 초기 렌더링 (Render Phase -> Commit Phase)
 */
export const render = (container: HTMLElement, vnode: ReactElement) => {
  rootElement = container;
  currentVnode = vnode;
  console.log("render", currentVnode);

  const element = createDOM(currentVnode);
  container.innerHTML = "";
  container.appendChild(element);
};

/**
 * Virtual DOM을 업데이트하는 함수 (재렌더링)
 */
export const rerender = (
  newVnode: ReactElement = currentVnode!,
  root: HTMLElement = rootElement!
) => {
  if (!currentVnode) {
    render(root, newVnode);
    return;
  }

  updateDOM(root, currentVnode, newVnode);
  currentVnode = newVnode;
  console.log("rerendering...", root, newVnode);
};
