import { Handle, Position } from "@xyflow/react";

// One invisible handle per side. With ConnectionMode.Loose, edges can attach
// to any of these regardless of source/target role.
const SIDES = [
  { id: "top", position: Position.Top },
  { id: "right", position: Position.Right },
  { id: "bottom", position: Position.Bottom },
  { id: "left", position: Position.Left },
] as const;

const hidden: React.CSSProperties = {
  opacity: 0,
  width: 1,
  height: 1,
  minWidth: 0,
  minHeight: 0,
  border: "none",
  background: "transparent",
  pointerEvents: "none",
};

export function SideHandles() {
  return (
    <>
      {SIDES.map((s) => (
        <Handle
          key={s.id}
          id={s.id}
          type="source"
          position={s.position}
          isConnectable={false}
          style={hidden}
        />
      ))}
    </>
  );
}
