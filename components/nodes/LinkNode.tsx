import type { NodeProps } from "@xyflow/react";
import type { LinkData } from "@/lib/types";
import { SideHandles } from "./handles";

export default function LinkNode({ data }: NodeProps) {
  const d = data as unknown as LinkData & { color?: string };
  let host = d.url;
  try {
    host = new URL(d.url).hostname;
  } catch {
    /* keep raw url */
  }
  return (
    <div className="canvas-node link-node" style={{ borderColor: d.color }}>
      <a className="link-header" href={d.url} target="_blank" rel="noreferrer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://www.google.com/s2/favicons?domain=${host}&sz=32`}
          alt=""
          width={16}
          height={16}
        />
        <span className="link-host">{host}</span>
        <span className="link-open">↗</span>
      </a>
      <iframe className="link-frame" src={d.url} title={d.url} loading="lazy" />
      <SideHandles />
    </div>
  );
}
