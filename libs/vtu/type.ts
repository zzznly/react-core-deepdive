export interface VirtualNode {
  node: VirtualDOM | VirtualDOMType;
}

export type VirtualDOM = {
  type: VirtualDOMType;
  props: Record<string, unknown> | null;
  children: (VirtualNode | VirtualDOMType)[];
};

export type VirtualDOMType = HTMLElementTagNameMap | string | number | Function;

export type JSXElement = VirtualNode;
