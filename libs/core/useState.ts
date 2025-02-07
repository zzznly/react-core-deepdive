import { rerender } from "./render";

let componentStates = new Map<number, any[]>(); // 컴포넌트별 상태 저장
let stateIndexes = new Map<number, number>(); // 컴포넌트별 stateIndex 저장
let currentComponentId = 0; // 현재 렌더링 중인 컴포넌트 ID

export function useState<T>(initialValue: T) {
  if (!stateIndexes.has(currentComponentId)) {
    stateIndexes.set(currentComponentId, 0);
  }

  const states = componentStates.get(currentComponentId) ?? [];
  const currentIndex = stateIndexes.get(currentComponentId)!;

  if (states[currentIndex] === undefined) {
    states[currentIndex] = initialValue;
  }
  console.log(
    222,
    "# states: ",
    states,
    "# currentIndex: ",
    currentIndex,
    "# states[currentIndex]: ",
    states[currentIndex]
  );

  function setState(newValue: T | ((prev: T) => T)) {
    const newValueResolved =
      typeof newValue === "function"
        ? (newValue as (prev: T) => T)(states[currentIndex])
        : newValue;

    states[currentIndex] = newValueResolved;
    componentStates.set(currentComponentId, states);

    console.log(333, "# new val: ", states[currentIndex]);
    // 상태 변경 후 리렌더링 실행
    rerender();
  }

  // console.log(444, states, componentStates.get(currentComponentId));

  componentStates.set(currentComponentId, states);
  stateIndexes.set(currentComponentId, currentIndex + 1); // stateIndex 증가

  return [states[currentIndex], setState] as const;
}

/**
 * 현재 렌더링 중인 컴포넌트의 상태 초기화
 */
export function resetStateIndex(componentId: number) {
  currentComponentId = componentId;
  stateIndexes.set(currentComponentId, 0); // 새로운 렌더링이 시작될 때 stateIndex를 초기화
}
