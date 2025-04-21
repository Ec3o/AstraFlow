import React from "react";

interface TitleRendererProps {
  children: React.ReactNode;
  level: number;
}

const TitleRenderer = ({ children, level }: TitleRendererProps) => {
  let className = "text-white font-bold my-4"; // 默认样式

  // 根据标题级别设置不同的样式
  switch (level) {
    case 1:
      className += " text-4xl"; // h1 样式
      break;
    case 2:
      className += " text-3xl"; // h2 样式
      break;
    case 3:
      className += " text-2xl"; // h3 样式
      break;
    case 4:
      className += " text-xl"; // h4 样式
      break;
    case 5:
      className += " text-lg"; // h5 样式
      break;
    case 6:
      className += " text-base"; // h6 样式
      break;
    default:
      className += " text-lg"; // 默认样式
  }

  return <div className={className}>{children}</div>;
};

export default TitleRenderer;
