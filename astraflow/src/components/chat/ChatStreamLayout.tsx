import { useRef, useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useChatStream } from "@/hooks/useChatStream"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function ChatStreamLayout() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "你好，我是 DeepSeek Chat 流式模式！" },
  ])
  const [input, setInput] = useState("")
  const [partial, setPartial] = useState("")
  const { sendMessage, streaming } = useChatStream()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, partial])

  const handleSend = async () => {
    if (!input.trim()) return
    const userMsg = { role: "user", content: input }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setPartial("")

    await sendMessage(
      [...messages, userMsg],
      (chunk) => setPartial(chunk),
      (final) => {
        setMessages((prev) => [...prev, { role: "assistant", content: final }])
        setPartial("")
      }
    )
  }

  return (
    <div className="flex h-screen bg-white dark:bg-[#1a1a1a] text-black dark:text-white transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-16 bg-gray-100 dark:bg-gray-900 flex flex-col items-center gap-4 py-4">
        <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center">⚡</div>
      </aside>

      {/* Chat area */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b bg-gray-100 dark:bg-gray-900 dark:border-gray-700 font-bold text-lg">
          DeepSeek Chat - 流式模式
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4 space-y-3">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={cn(
                "max-w-[70%] px-4 py-2 rounded-xl text-sm shadow",
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-bl-none"
              )}>
                {msg.content}
              </div>
            </div>
          ))}

          {partial && (
            <div className="flex justify-start">
              <div className="max-w-[70%] px-4 py-2 rounded-xl text-sm shadow bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-bl-none">
                {partial}
                <span className="animate-pulse text-muted-foreground">▍</span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t bg-gray-100 dark:bg-gray-900 dark:border-gray-700">
          <div className="max-w-4xl mx-auto bg-muted dark:bg-gray-800 rounded-2xl px-4 py-3 flex items-center gap-2 shadow-inner">
            <input
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground text-foreground"
              placeholder="输入消息..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={streaming}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSend}
              disabled={streaming || !input.trim()}
              className="text-muted-foreground hover:text-primary"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3.4,20.5L22,12L3.4,3.5V10l10.6,2L3.4,14V20.5z" />
              </svg>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
