import { useState, FC, useRef, useEffect } from "react";

interface SignatureProps {
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  onSave?: (dataUrl: string | undefined) => void;
}
const Signature: FC<SignatureProps> = ({
  width = 400,
  height = 200,
  style,
  onSave,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeStyle, setStrokeStyle] = useState("pen");
  const [points, setPoints] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const canvas = useRef<HTMLCanvasElement>(null);
  const ctx = useRef<CanvasRenderingContext2D>();

  useEffect(() => {
    ctx.current = canvas.current?.getContext("2d") as CanvasRenderingContext2D;
    updateStrokeStyle();
  }, []);

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> & React.TouchEvent<HTMLCanvasElement>
  ) => {
    // e.preventDefault();
    setIsDrawing(true);
    ctx.current?.beginPath();
    const { offsetX, offsetY } = getEventPosition(e);

    setPoints({ x: offsetX, y: offsetY });
    ctx.current?.moveTo(offsetX, offsetY); // 移动画笔到初始位置
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> & React.TouchEvent<HTMLCanvasElement>
  ) => {
    // e.preventDefault(); // 阻止默认行为，避免页面滚动
    if (!isDrawing) return; // 如果不是在绘制，直接返回

    // 获取当前触点位置
    const { offsetX, offsetY } = getEventPosition(e);
    // 使用贝塞尔曲线进行平滑过渡绘制
    ctx.current?.quadraticCurveTo(
      points["x"],
      points["y"],
      (points["x"] + offsetX) / 2,
      (points["y"] + offsetY) / 2
    );
    ctx.current?.stroke(); // 实际绘制路径

    // 更新上一个点的位置
    setPoints({ x: offsetX, y: offsetY });
  };

  const stopDrawing = (
    e: React.TouchEvent<HTMLCanvasElement> & React.MouseEvent<HTMLCanvasElement>
  ) => {
    // e.preventDefault(); // 阻止默认行为
    setIsDrawing(false); // 结束绘制状态
  };

  const getEventPosition = (
    e: React.MouseEvent<HTMLCanvasElement> & React.TouchEvent<HTMLCanvasElement>
  ) => {
    const offsetX =
      e.nativeEvent.offsetX ??
      e.touches[0].clientX - canvas.current!.offsetLeft;
    const offsetY =
      e.nativeEvent.offsetY ?? e.touches[0].clientY - canvas.current!.offsetTop;
    return { offsetX, offsetY };
  };

  const updateStrokeStyle = () => {
    if (strokeStyle === "pen") {
      ctx.current!.lineWidth = 2; // 细线条
      ctx.current!.lineCap = "round"; // 线条末端圆角
    } else if (strokeStyle === "brush") {
      ctx.current!.lineWidth = 5; // 粗线条
      ctx.current!.lineCap = "round"; // 线条末端圆角
    }
  };
  const handleStrokeStyle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStrokeStyle(e.target.value);
    updateStrokeStyle();
  };
  const handleSave = () => {
    const dataURL = canvas.current?.toDataURL();
    // 在此处可以将 dataURL 发送到服务器或进行其他操作
    onSave?.(dataURL);
  };
  return (
    <>
      <canvas
        ref={canvas}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchEnd={stopDrawing}
        onTouchMove={draw}
        onTouchCancel={stopDrawing}
        style={{ border: "1px solid black", ...style }}
        width={width}
        height={height}
        className="viking-signature"
      ></canvas>

      <div className="controls" style={{ width }}>
        <select onChange={handleStrokeStyle}>
          <option value="pen">钢笔</option>
          <option value="brush">毛笔</option>
        </select>
        <button
          onClick={() =>
            ctx.current!.clearRect(
              0,
              0,
              canvas.current!.width,
              canvas.current!.height
            )
          }
        >
          清空
        </button>
        <button onClick={handleSave}>保存</button>
      </div>
    </>
  );
};

export default Signature;
