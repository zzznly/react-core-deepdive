import { rerender } from "./rerender";

export const useState = (initialValue) => {
  let stateIndex = 0;
  const states = [];

  const stateIndexSnapshot = stateIndex;
  stateIndex++;

  if (states[stateIndexSnapshot] === undefined) {
    states.push(initialValue);
  }

  const setState = (updateValue) => {
    states[stateIndexSnapshot] = updateValue;
    // rerender();
  };
  return [states[stateIndexSnapshot], setState];
};

export const initializeStateIndex = () => {
  stateIndex = 0;
};
