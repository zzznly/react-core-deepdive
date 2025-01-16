// https://ko.react.dev/reference/react/createElement
/*
  주의 사항:
  1. 반드시 React 엘리먼트와 그 프로퍼티는 불변하게 취급해야하며 엘리먼트 생성 후에는 그 내용이 변경되어선 안됩니다.
    개발환경에서 React는 이를 강제하기 위해 반환된 엘리먼트와 그 프로퍼티를 얕게 freeze합니다.
  2. JSX를 사용한다면 태그를 대문자로 시작해야만 사용자 컴포넌트를 렌더링할 수 있습니다.
    즉, <Something />은 createElement(Something)과 동일하지만 <something />(소문자) 은 createElement('something')와 동일합니다. 
    (문자열임을 주의하세요. 내장된 HTML 태그로 취급됩니다.)
  3. createElement('h1', {}, child1, child2, child3)와 같이 children이 모두 정적인 경우에만 createElement에 여러 인수로 전달해야 합니다.
    children이 동적이라면 전체 배열을 세 번째 인수로 전달해야 합니다. 이렇게 하면 React는 누락된 키에 대한 경고를 표시합니다.
    정적 목록인 경우 재정렬하지 않기 때문에 작업이 필요하지 않습니다.
*/

function ReactElement(type, props, ref = null, key = null) {
  const element = Object.freeze({
    type,
    props,
    ref,
    key,
  });

  return element;
}

export function createElement(type, config, ...children) {
  const props = { ...config };

  if (children.length === 1) {
    props.children = children[0];
  } else if (children.length > 1) {
    props.children = children;
  }

  return ReactElement(type, Object.freeze(props), null, null);
}
