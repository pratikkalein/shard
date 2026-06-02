import type { NodeProps } from "@xyflow/react";
import type { ResolvedFile } from "@/lib/types";
import { SideHandles } from "./handles";
import { Markdown } from "./Markdown";

export default function FileNode({ data }: NodeProps) {
  const d = data as unknown as ResolvedFile & { color?: string };
  const name = d.file.split("/").pop() ?? d.file;

  return (
    <div className="canvas-node file-node" style={{ borderColor: d.color }}>
      <div className="node-titlebar">{name}</div>
      <div className="node-scroll">
        {d.kind === "markdown" && <Markdown>{d.content}</Markdown>}
        {d.kind === "image" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="file-image" src={d.src} alt={name} />
        )}
        {d.kind === "other" && (
          <a className="file-download" href={d.src} target="_blank" rel="noreferrer">
            📎 Open {name}
          </a>
        )}
      </div>
      <SideHandles />
    </div>
  );
}
