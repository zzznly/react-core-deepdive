export const createVirtualDom = (element) => {
  if (typeof element.node === "string" || typeof element.node === "number") {
    return document.createTextNode(element.node);
  }

  const DOMElement = document.createElement(element.node.tag);

  if (element.node.props)
    Object.keys(element.node.props).forEach((key) => {
      DOMElement[key] = element.node.props[key];
    });

  if (element.node.children) {
    element.node.children.forEach((child) => {
      DOMElement.appendChild(createVirtualDom(child));
    });
  }
  element.ref = DOMElement;

  return DOMElement;
};
