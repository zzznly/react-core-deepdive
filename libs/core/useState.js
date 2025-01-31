import { rerender } from "./rerender";

let states = [];
let stateIndex = 0;

export function useState(initialValue) {
  const currentIndex = stateIndex;
  states[currentIndex] = states[currentIndex] ?? initialValue;

  function setState(newValue) {
    states[currentIndex] = newValue;
    rerender();
  }

  stateIndex++;
  return [states[currentIndex], setState];
}