export interface VirtualDOM {
  node: VirtualNode;
}

export type VirtualNode = {
  type: VirtualNodeType;
  props: Record<string, unknown> | null;
  children: (VirtualDOM | VirtualNode)[];
};

export type VirtualNodeType =
  | HTMLElementTagNameMap
  | string
  | number
  | Function;

export type JSXElement = VirtualDOM;
