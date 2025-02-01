import rerender from "../../src/main";

let states: any[] = [];
let stateIndex = 0;

export function useState<T>(initialValue: T) {
  const currentIndex = stateIndex;
  states[currentIndex] = states[currentIndex] ?? initialValue;

  function setState(newValue: T) {
    states[currentIndex] = newValue;
    rerender();
  }

  stateIndex++;
  return [states[currentIndex], setState];
}
