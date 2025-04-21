// components/BlockquoteRenderer.tsx
import React from "react";

const BlockquoteRenderer = ({ children }: { children?: React.ReactNode }) => {
  return (
    <blockquote className="mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-l-4 border-blue-500 text-sm text-gray-600 dark:text-gray-400">
      {children}
    </blockquote>
  );
};

export default BlockquoteRenderer;
