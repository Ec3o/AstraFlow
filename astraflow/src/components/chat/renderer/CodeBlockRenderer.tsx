import { Copy, Check } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface CodeBlockProps {
  language?: string
  value: React.ReactNode
}

export default function CodeBlock({ language = "text", value }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const getTextContent = (node: React.ReactNode): string => {
    if (typeof node === "string" || typeof node === "number") {
      return String(node)
    }
    if (Array.isArray(node)) {
      return node.map(getTextContent).join("")
    }
    if (hasProps(node)) {
      return getTextContent(node.props.children)
    }
    return ""
  }

  const handleCopy = async () => {
    const textToCopy = getTextContent(value)
    await navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-100 dark:bg-zinc-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <div className="w-3 h-3 bg-yellow-400 rounded-full" />
          <div className="w-3 h-3 bg-green-500 rounded-full" />
          <span className="ml-4 text-xs text-zinc-700 dark:text-zinc-300 font-mono">
            {language.toUpperCase()}
          </span>
        </div>
        <Button
          onClick={handleCopy}
          variant="ghost"
          size="icon"
          className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>

      {/* Content */}
      <pre className="bg-[#1e1e2e] text-white px-4 py-3 text-sm overflow-x-auto font-mono">
        <code className="whitespace-pre-wrap break-words">
          {value}
        </code>
      </pre>
    </div>
  )
}
function hasProps(node: unknown): node is { props: { children: React.ReactNode } } {
  return typeof node === "object" && node !== null && "props" in node
}