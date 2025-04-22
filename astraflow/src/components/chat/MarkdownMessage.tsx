import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
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
    <div className="prose prose-sm dark:prose-invert max-w-none break-words leading-relaxed [&>*]:my-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          code: CodeRenderer,
          img: ImageRenderer,
          a: LinkRenderer,
          blockquote: BlockquoteRenderer,
          h1: ({ children }) => <TitleRenderer level={1}>{children}</TitleRenderer>,
          h2: ({ children }) => <TitleRenderer level={2}>{children}</TitleRenderer>,
          h3: ({ children }) => <TitleRenderer level={3}>{children}</TitleRenderer>,
          h4: ({ children }) => <TitleRenderer level={4}>{children}</TitleRenderer>,
          h5: ({ children }) => <TitleRenderer level={5}>{children}</TitleRenderer>,
          h6: ({ children }) => <TitleRenderer level={6}>{children}</TitleRenderer>,
          table: ({ children }) => (
            <div className="overflow-auto rounded-lg shadow-md border border-gray-300 dark:border-gray-600 my-4">
              <table className="min-w-full table-auto border-collapse bg-white dark:bg-gray-800 text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-100 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
              {children}
            </thead>
          ),
          tbody: ({ children }) => <tbody>{children}</tbody>,
          th: ({ children }) => (
            <th className="px-4 py-2 text-left font-semibold text-gray-700 dark:text-gray-200 border-r border-gray-200 dark:border-gray-600 last:border-r-0">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 text-gray-800 dark:text-gray-300 border-t border-r border-gray-200 dark:border-gray-600 last:border-r-0">
              {children}
            </td>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-gray-800 dark:text-gray-300 my-2 pl-4">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-gray-800 dark:text-gray-300 my-2 pl-4">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="my-1">{children}</li>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
