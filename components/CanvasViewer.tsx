"use client";

import {
  Background,
  ConnectionMode,
  Controls,
  MarkerType,
  ReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import Link from "next/link";
import type { ViewEdge, ViewNode } from "@/lib/types";
import TextNode from "./nodes/TextNode";
import LinkNode from "./nodes/LinkNode";
import FileNode from "./nodes/FileNode";
import GroupNode from "./nodes/GroupNode";

const nodeTypes = {
  text: TextNode,
  link: LinkNode,
  file: FileNode,
  group: GroupNode,
};

const DEFAULT_EDGE_COLOR = "#888";

export default function CanvasViewer({
  title,
  nodes,
  edges,
}: {
  title: string;
  nodes: ViewNode[];
  edges: ViewEdge[];
}) {
  const rfNodes: Node[] = nodes.map((n) => ({
    id: n.id,
    type: n.type,
    position: { x: n.x, y: n.y },
    width: n.width,
    height: n.height,
    data: { ...n.data, color: n.color },
    draggable: false,
    selectable: false,
    connectable: false,
    zIndex: n.type === "group" ? 0 : 1,
  }));

  const rfEdges: Edge[] = edges.map((e) => {
    const color = e.color ?? DEFAULT_EDGE_COLOR;
    return {
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle,
      label: e.label,
      labelStyle: { fill: "#ddd", fontSize: 12 },
      labelBgStyle: { fill: "#1e1e1e" },
      style: { stroke: color, strokeWidth: 2 },
      markerStart: e.markerStart
        ? { type: MarkerType.ArrowClosed, color }
        : undefined,
      markerEnd: e.markerEnd
        ? { type: MarkerType.ArrowClosed, color }
        : undefined,
    };
  });

  return (
    <div className="viewer">
      <div className="viewer-bar">
        <Link className="home-link" href="/">
          ← Shard
        </Link>
        <span className="viewer-title">{title}</span>
      </div>
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        edgesFocusable={false}
        fitView
        minZoom={0.05}
        maxZoom={4}
      >
        <Background color="#333" gap={24} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
