import React from "react";

interface TitleRendererProps {
  children: React.ReactNode;
  level: number;
}

const TitleRenderer = ({ children, level }: TitleRendererProps) => {
  // 基础样式支持浅色和深色模式的切换
  const baseClassName = "font-bold my-4 text-gray-800 dark:text-white";

  // 不同标题级别对应的字体大小
  const headingClasses: Record<number, string> = {
    1: "text-4xl",
    2: "text-3xl",
    3: "text-2xl",
    4: "text-xl",
    5: "text-lg",
    6: "text-base",
  };

  const className = `${baseClassName} ${headingClasses[level] || "text-lg"}`;

  switch (level) {
    case 1:
      return <h1 className={className}>{children}</h1>;
    case 2:
      return <h2 className={className}>{children}</h2>;
    case 3:
      return <h3 className={className}>{children}</h3>;
    case 4:
      return <h4 className={className}>{children}</h4>;
    case 5:
      return <h5 className={className}>{children}</h5>;
    case 6:
      return <h6 className={className}>{children}</h6>;
    default:
      return <div className={className}>{children}</div>;
  }
};

export default TitleRenderer;
