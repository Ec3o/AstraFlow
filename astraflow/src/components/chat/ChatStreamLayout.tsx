import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useChatStream } from "@/hooks/useChatStream"
import DeepSeekIcon from "@/components/icon/DeepSeekIcon"
import MarkdownMessage from "@/components/chat/MarkdownMessage"

interface Message {
  role: "user" | "assistant"
  content: string
  reasoning_content?: string // 推理链输出
}

export default function ChatStreamLayout() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "🫡 Hi ! How can i help you today ?" },
  ])
  const [model, setModel] = useState<"deepseek-chat" | "deepseek-reasoner">("deepseek-chat")
  const [input, setInput] = useState("")
  const [partial, setPartial] = useState("") // 用来显示部分内容的变量
  const { sendMessage, streaming } = useChatStream()
  const bottomRef = useRef<HTMLDivElement>(null)

  // Log messages every time they change
  useEffect(() => {
    console.log("Updated messages:", messages)
  }, [messages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, partial])

  const handleSend = async () => {
    if (!input.trim()) return
    const userMsg: Message = { role: "user", content: input }

    console.log("User message:", userMsg)

    setMessages((prev) => {
      console.log("Prev messages before adding user:", prev)
      return [...prev, userMsg] // 用户消息加入
    })

    setInput("")
    setPartial("")

    // 逐步更新推理链
    await sendMessage(
      [...messages, userMsg],
      (text: string, reasoning: string) => {
        console.log("Streamed text:", text)
        console.log("Streamed reasoning:", reasoning)

        setPartial(text)

        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];

          // 判断当前是否是新消息，还是修改现有消息
          if (lastMessage && lastMessage.role === "user") {
            // 如果是用户消息，说明要创建新的推理链消息
            const newAssistantMessage: Message = {
              role: "assistant",
              content: "",
              reasoning_content: "",
            };
            newMessages.push(newAssistantMessage);
          } else {
            // 如果是助手的消息，更新推理链
            lastMessage.reasoning_content = reasoning;
            lastMessage.content = text;
          }

          console.log("Messages before reasoning update:", newMessages);
          console.log("Last message before reasoning update:", lastMessage);
          
          // 返回新数组，确保每个消息的推理链独立更新
          return newMessages;
        });
      },
      (finalMsg) => {
        console.log("Final message received:", finalMsg);
        // setMessages((prev) => [...prev, finalMsg]);
        setPartial(""); // 清空流式内容
      },
      model
    )
  }


  return (
    <div className="flex h-screen bg-white dark:bg-[#1a1a1a] text-black dark:text-white transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-16 bg-gray-100 dark:bg-gray-900 flex flex-col items-center gap-4 py-4">
        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center"><DeepSeekIcon /></div>
      </aside>

      {/* Chat area */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b bg-gray-100 dark:bg-gray-900 dark:border-gray-700 font-bold text-lg">
          ✨AstraFlow ChatUI
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4 space-y-3">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={cn(
                  "max-w-[75%] px-4 py-2 rounded-xl text-sm shadow whitespace-pre-wrap",
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-bl-none"
                )}
              >
                {msg.role === "user" ? (
                  msg.content
                ) : (
                  <>
                    {/* Display reasoning content (streaming chain) */}
                    {msg.reasoning_content && (
                      <div className="mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-l-4 border-blue-500 text-sm text-gray-600 dark:text-gray-400">
                        <MarkdownMessage content={msg.reasoning_content} />
                      </div>
                    )}
                    {/* Display final message content */}
                    <MarkdownMessage content={msg.content} />
                  </>
                )}
              </div>
            </div>
          ))}

          {/* Streamed content */}
          {partial && (
            <div className="flex justify-start">
              <div className="max-w-[75%] px-4 py-2 rounded-xl text-sm shadow bg-gray-200 dark:bg-gray-700 text-black dark:text-white rounded-bl-none whitespace-pre-wrap">
                <MarkdownMessage content={partial + "▍"} />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </ScrollArea>

        {/* Input */}
        <div className="flex justify-end px-4 pt-2">
          <select
            className="bg-gray-100 dark:bg-gray-800 border rounded px-2 py-1 text-sm"
            value={model}
            onChange={(e) => setModel(e.target.value as "deepseek-chat" | "deepseek-reasoner")}
          >
            <option value="deepseek-chat">Chat 模型</option>
            <option value="deepseek-reasoner">Reasoner 模型</option>
          </select>
        </div>
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
