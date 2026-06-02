// JSON Canvas 1.0 spec types — https://jsoncanvas.org/spec/1.0/
// Plus the "view model" types that the (client) viewer consumes after the
// server has resolved file nodes and colors at build time.

export type CanvasColor = string; // hex ("#FF0000") or preset "1".."6"
export type Side = "top" | "right" | "bottom" | "left";
export type Arrow = "none" | "arrow";

export interface NodeBase {
  id: string;
  type: "text" | "file" | "link" | "group";
  x: number;
  y: number;
  width: number;
  height: number;
  color?: CanvasColor;
}

export interface TextNode extends NodeBase {
  type: "text";
  text: string;
}

export interface FileNode extends NodeBase {
  type: "file";
  file: string;
  subpath?: string;
}

export interface LinkNode extends NodeBase {
  type: "link";
  url: string;
}

export interface GroupNode extends NodeBase {
  type: "group";
  label?: string;
  background?: string;
  backgroundStyle?: "cover" | "ratio" | "repeat";
}

export type CanvasNode = TextNode | FileNode | LinkNode | GroupNode;

export interface CanvasEdge {
  id: string;
  fromNode: string;
  toNode: string;
  fromSide?: Side;
  toSide?: Side;
  fromEnd?: Arrow;
  toEnd?: Arrow;
  color?: CanvasColor;
  label?: string;
}

export interface JSONCanvas {
  nodes?: CanvasNode[];
  edges?: CanvasEdge[];
}

// ---- Resolved view model (serializable, passed to the client viewer) ----

export type ResolvedFile =
  | { kind: "markdown"; content: string; file: string }
  | { kind: "image"; src: string; file: string }
  | { kind: "other"; src: string; file: string };

export type TextData = { text: string };
export type LinkData = { url: string };
export type GroupData = {
  label?: string;
  background?: string;
  backgroundStyle?: "cover" | "ratio" | "repeat";
};

export type NodeData = TextData | LinkData | GroupData | ResolvedFile;

export interface ViewNode {
  id: string;
  type: NodeBase["type"];
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string; // resolved hex
  data: NodeData;
}

export interface ViewEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle: Side;
  targetHandle: Side;
  markerStart: boolean;
  markerEnd: boolean;
  color?: string;
  label?: string;
}

export interface ViewModel {
  nodes: ViewNode[];
  edges: ViewEdge[];
}
