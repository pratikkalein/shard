import type { NodeProps } from "@xyflow/react";
import type { GroupData } from "@/lib/types";
import { SideHandles } from "./handles";

const BG_SIZE: Record<string, string> = {
  cover: "cover",
  ratio: "contain",
  repeat: "auto",
};

export default function GroupNode({ data }: NodeProps) {
  const d = data as unknown as GroupData & { color?: string };
  const style: React.CSSProperties = { borderColor: d.color };
  if (d.background) {
    style.backgroundImage = `url("${d.background}")`;
    style.backgroundSize = BG_SIZE[d.backgroundStyle ?? "cover"] ?? "cover";
    style.backgroundRepeat = d.backgroundStyle === "repeat" ? "repeat" : "no-repeat";
    style.backgroundPosition = "center";
  }
  return (
    <div className="canvas-node group-node" style={style}>
      {d.label && <div className="group-label">{d.label}</div>}
      <SideHandles />
    </div>
  );
}
