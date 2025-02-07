import {
  ReactElement,
  ReactNode,
  FunctionComponent,
} from "../types/virtual-dom";

let currentVnode: ReactElement;
let rootElement: HTMLElement;

/**
 * Virtual DOM을 실제 DOM으로 변환하는 함수 (초기 렌더링시)
 */
const createDOM = (vnode: ReactElement | string | number): Node => {
  if (typeof vnode === "string" || typeof vnode === "number") {
    return document.createTextNode(vnode.toString());
  }

  console.log('## createDOM - ReactElement type: ', vnode.type, typeof vnode.type);

  if (typeof vnode.type === "function") {
    const component = vnode.type as FunctionComponent<any>;
    const renderedVnode = component(vnode.props); // 함수형 컴포넌트 실행
    return createDOM(renderedVnode as ReactElement); // 재귀적으로 실행 - 실행 결과를 다시 실제 DOM으로 변환
  }

  const domElement = document.createElement(vnode.type as string);
  applyProps(domElement, {}, vnode.props); // props 적용

  if (Array.isArray(vnode.props.children)) {
    vnode.props.children.forEach((child: ReactElement) => {
      if (child !== null && child !== undefined) {
        domElement.appendChild(createDOM(child));
      }
    });
  } else if (
    typeof vnode.props.children === "string" ||
    typeof vnode.props.children === "number"
  ) {
    domElement.appendChild(
      document.createTextNode(vnode.props.children.toString())
    );
  }

  vnode.ref && (vnode.ref.current = domElement);
  return domElement;
};

/**
 * 기존 DOM을 업데이트하는 함수 (재렌더링)
 */
const updateDOM = (
  parent: HTMLElement,
  oldVnode: ReactElement,
  newVnode: ReactElement
) => {
  if (!oldVnode) {
    parent.appendChild(createDOM(newVnode));
    return;
  }

  // 1. type이 다르면 DOM 엘리먼트 교체
  if (oldVnode.type !== newVnode.type) {
    parent.replaceChild(createDOM(newVnode), parent.firstChild!);
    return;
  }

  // 2. props 변경시 newProps, oldProps 비교하여 변경된 부분만 업데이트
  applyProps(parent, oldVnode.props, newVnode.props);

  // 3. children 변경시 기존 children과 새로운 children을 비교하여 변경된 부분만 업데이트
  updateChildren(parent, oldVnode.props.children, newVnode.props.children);
};

/**
 * props 비교하여 변경된 부분만 적용하는 함수
 */
const applyProps = (dom: HTMLElement, oldProps: any, newProps: any) => {
  // 얕은 비교 수행 (Shallow Comparision)
  // - 객체의 1차 속성의 참조(Reference)만 비교
  // - 객체 내부의 중첩된 값이 변했는지는 검사하지 않음

  // 기존 props중 없는 속성 제거
  Object.keys(oldProps).forEach((key) => {
    if (!(key in newProps)) {
      dom.removeAttribute(key);
    }
  });
  Object.entries(newProps).forEach(([key, value]) => {
    if (key === "children") return; // children을 속성으로 설정하지 않음!

    /**
     * Reconcilation (재조정)
     */
    if (oldProps[key] === newProps[key]) {
      return; // props가 변경되지 않음 -> 업데이트 생략 (= 재렌더링 생략)
    }

    if (key.startsWith("on") && typeof value === "function") {
      // 이벤트 핸들러 업데이트 (onClick, onChange 등)
      const eventType = key.slice(2).toLowerCase();
      dom.removeEventListener(eventType, oldProps[key]);
      dom.addEventListener(eventType, value);
    } else {
      // 일반 props 업데이트
      dom.setAttribute(key, value as string);
    }
  });
};

/**
 * 기존 children과 새로운 children을 비교하여 변경된 부분만 업데이트
 */
const updateChildren = (
  parent: HTMLElement,
  oldChildren: ReactNode,
  newChildren: ReactNode
) => {
  if (!Array.isArray(newChildren)) newChildren = [newChildren];
  if (!Array.isArray(oldChildren)) oldChildren = [oldChildren];

  const maxLength = Math.max(oldChildren.length, newChildren.length);
  for (let i = 0; i < maxLength; i++) {
    const oldChild = oldChildren[i];
    const newChild = newChildren[i];

    if (oldChild === newChild) {
      continue; // 변경되지 않음 -> 업데이트 생략
    }

    if (newChild === undefined) {
      parent.removeChild(parent.childNodes[i]); // 삭제된 children
      continue;
    }

    if (oldChild === undefined) {
      parent.appendChild(createDOM(newChild as ReactElement)); // oldChild가 없으면 새로 추가
      continue;
    }

    if (typeof oldChild === "string" || typeof newChild === "string") {
      if (oldChild !== newChild) {
        parent.childNodes[i].textContent = newChild as string;
      }
      continue;
    }

    updateDOM(
      parent.childNodes[i] as HTMLElement,
      oldChild as ReactElement, // oldChild가 존재하는 경우만 updateDOM() 호출
      newChild as ReactElement
    );
  }
};

/**
 * 초기 렌더링
 */
export const render = (container: HTMLElement, vnode: ReactElement) => {
  rootElement = container;
  currentVnode = vnode;
  console.log("render - vnode", vnode);
  console.log("render - element", createDOM(vnode));

  const element = createDOM(vnode);
  container.innerHTML = "";
  container.appendChild(element);
};

/**
 * Virtual DOM을 업데이트하는 함수
 */

export const rerender = (
  root: HTMLElement = rootElement,
  newVnode: ReactElement = currentVnode
) => {
  if (!currentVnode) {
    // 기존 Virtual DOM이 없으면 새로 렌더링
    render(newVnode, root);
    return;
  }

  updateDOM(root, currentVnode, newVnode);
  currentVnode = newVnode;
};
