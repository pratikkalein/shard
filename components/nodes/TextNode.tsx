import type { NodeProps } from "@xyflow/react";
import type { TextData } from "@/lib/types";
import { SideHandles } from "./handles";
import { Markdown } from "./Markdown";

export default function TextNode({ data }: NodeProps) {
  const d = data as unknown as TextData & { color?: string };
  return (
    <div className="canvas-node text-node" style={{ borderColor: d.color }}>
      <div className="node-scroll">
        <Markdown>{d.text ?? ""}</Markdown>
      </div>
      <SideHandles />
    </div>
  );
}
