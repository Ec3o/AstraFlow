import { ComponentPropsWithoutRef } from "react";
import CodeBlock from "./CodeBlockRenderer";

// CodeProps 继承自 HTMLAttributes，这样就能与 ReactMarkdown 的类型兼容
type CodeProps = ComponentPropsWithoutRef<"code"> & {
  inline?: boolean;
  node?: unknown;
};

const CodeRenderer = ({ className, children}: CodeProps) => {
  console.log("CodeRenderer", className, children);

  // 判断是否是代码块（通过 className 中的语言类型）
  const match = /language-(\w+)/.exec(className || "");
  const lang = match?.[1] || "plaintext";

  // 如果是多行代码块，使用 CodeBlock 渲染组件
  if (className && match) {
    return <CodeBlock language={lang} value={children} />;
  }

  // 如果是内联代码，直接渲染为普通的 code 标签
  return (
    <code className="bg-gray-200 dark:bg-gray-400 text-black dark:text-white px-1 py-0.5 rounded font-mono text-sm border border-gray-300 dark:border-gray-600">
      {children}
    </code>
  );
};

export default CodeRenderer;
