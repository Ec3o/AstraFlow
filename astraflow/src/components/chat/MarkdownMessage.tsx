import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import CodeBlock from "./CodeBlock"
import "highlight.js/styles/github-dark.css"
import type { ComponentPropsWithoutRef } from "react"

interface Props {
  content: string
}

// ✅ 解决类型推导冲突，手动构造 CodeProps 类型
type CodeProps = ComponentPropsWithoutRef<"code"> & {
  inline?: boolean
  node?: unknown
}

const CodeRenderer = ({ inline, className, children }: CodeProps) => {
  const match = /language-(\w+)/.exec(className || "")
  const lang = match?.[1] || "plaintext"

  if (inline) {
    return (
      <code className="bg-muted dark:bg-zinc-800 text-pink-500 px-1 py-0.5 rounded">
        {children}
      </code>
    )
  }

  return (
    <CodeBlock
      language={lang}
      // ✅ 直接传 children ReactNode 而不是转 string
      value={children}
    />
  )
}

export default function MarkdownMessage({ content }: Props) {
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none break-words leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{ code: CodeRenderer }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}