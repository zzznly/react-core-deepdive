export const rerender = () => {
  let currentVirtualDom;

  initializeStateIndex();
  const updateElement = App();
//   updateVirtualDom(rootElement, currentVirtualDom, updateElement);
  currentVirtualDom = updateElement;
};
