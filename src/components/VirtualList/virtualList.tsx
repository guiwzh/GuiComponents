import { useState, FC } from "react";
import { flushSync } from "react-dom";

interface VirtualListProps {
  containerHeight: number;
  itemHeight: number;
  itemCount: number;
  children: React.ComponentType<{ index: number; style: React.CSSProperties }>;
}
const VirtualList: FC<VirtualListProps> = ({
  containerHeight,
  itemHeight,
  itemCount,
  children,
}) => {
  // children 语义不好，赋值给 Component
  const Component = children;

  const contentHeight = itemHeight * itemCount; // 内容高度
  const [scrollTop, setScrollTop] = useState<number>(0); // 滚动高度

  // 继续需要渲染的 item 索引有哪些
  let startIdx = Math.floor(scrollTop / itemHeight);
  let endIdx = Math.floor((scrollTop + containerHeight) / itemHeight);

  // 上下额外多渲染几个 item，解决滚动时来不及加载元素出现短暂的空白区域的问题
  const paddingCount = 2;
  startIdx = Math.max(startIdx - paddingCount, 0); // 处理越界情况
  endIdx = Math.min(endIdx + paddingCount, itemCount - 1);

  const top = itemHeight * startIdx; // 第一个渲染 item 到顶部距离

  // 需要渲染的 items
  const items = [];
  for (let i = startIdx; i <= endIdx; i++) {
    items.push(<Component key={i} index={i} style={{ height: itemHeight }} />);
  }

  return (
    <div
      style={{ height: containerHeight, overflow: "auto" }}
      onScroll={(e) => {
        flushSync(() => {
          setScrollTop((e.target as HTMLDivElement).scrollTop);
        });
      }}
    >
      <div style={{ height: contentHeight }}>
        <div style={{ transform: `translate3d(0px, ${top}px, 0` }}>{items}</div>
      </div>
    </div>
  );
};

export default VirtualList;
