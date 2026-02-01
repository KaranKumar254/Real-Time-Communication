import { useRef } from "react";

export default function Whiteboard() {
  const canvasRef = useRef(null);

  const draw = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "black";
    ctx.fillRect(e.nativeEvent.offsetX, e.nativeEvent.offsetY, 2, 2);
  };

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={200}
      onMouseMove={(e) => e.buttons === 1 && draw(e)}
      style={{ border: "1px solid black" }}
    />
  );
}
