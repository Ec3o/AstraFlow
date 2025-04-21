// components/LinkRenderer.tsx
import React from "react";

const LinkRenderer: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = ({ href, children, ...props }) => {
  if (!href) {
    return <span className="text-gray-500">{children}</span>; // Render as plain text if href is undefined
  }
  return (
    <a href={href} className="text-blue-500 underline" target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
};

export default LinkRenderer;
