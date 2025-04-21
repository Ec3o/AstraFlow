import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
// import Latex from "react-latex-next"; //哥们还是先不碰这个了
import CodeRenderer from "./renderer/CodeRenderer";
import ImageRenderer from "./renderer/ImageRenderer";
import TitleRenderer from "./renderer/TitleRenderer";
import LinkRenderer from "./renderer/LinkRenderer";
import BlockquoteRenderer from "./renderer/BlockquoteRenderer";
import "highlight.js/styles/github-dark.css";

interface Props {
  content: string;
}

export default function MarkdownMessage({ content }: Props) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none break-words leading-relaxed">
      {/* 使用 ReactMarkdown 渲染 Markdown 内容 */}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}  // 只保留 GitHub 风格的 Markdown 插件
        rehypePlugins={[rehypeHighlight, rehypeRaw]}  // 继续保持高亮和 raw 插件
        components={{
          code: CodeRenderer,  // 使用自定义代码渲染器
          img: ImageRenderer,  // 使用自定义图片渲染器
          a: LinkRenderer,  // 使用自定义链接渲染器
          blockquote: BlockquoteRenderer,  // 使用自定义引用块渲染器
          h1: ({ children }) => <TitleRenderer level={1}>{children}</TitleRenderer>,
          h2: ({ children }) => <TitleRenderer level={2}>{children}</TitleRenderer>,
          h3: ({ children }) => <TitleRenderer level={3}>{children}</TitleRenderer>,
          h4: ({ children }) => <TitleRenderer level={4}>{children}</TitleRenderer>,
          h5: ({ children }) => <TitleRenderer level={5}>{children}</TitleRenderer>,
          h6: ({ children }) => <TitleRenderer level={6}>{children}</TitleRenderer>,
        }}
      >
        {content}
      </ReactMarkdown>
      {/* <Latex>{content}</Latex> */}
    </div>
  );
}
