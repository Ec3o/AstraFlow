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
  model?: string;
}

export default function ChatStreamLayout() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "🫡 Hi ! How can i help you today ?", model:"初始化对话" },
  ])
  const [model, setModel] = useState<"deepseek-chat" | "deepseek-reasoner">("deepseek-chat")
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState("")
  const [partial, setPartial] = useState("") // 用来显示部分内容的变量
  const { sendMessage, streaming } = useChatStream()
  const bottomRef = useRef<HTMLDivElement>(null)

  // Log messages every time they change
  useEffect(() => {
    // console.log("Updated messages:", messages)
  }, [messages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, partial])

  const handleSend = async () => {
    if (!input.trim()) return
    const userMsg: Message = { role: "user", content: input }

    // console.log("User message:", userMsg)

    setMessages((prev) => {
      // console.log("Prev messages before adding user:", prev)
      return [...prev, userMsg] // 用户消息加入
    })

    setInput("")
    setPartial("")
    setLoading(true)
    // 逐步更新推理链
    await sendMessage(
      [...messages, userMsg],
      (text: string, reasoning: string) => {
        // console.log("Streamed text:", text)
        // console.log("Streamed reasoning:", reasoning)

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
              model: model,
            };
            newMessages.push(newAssistantMessage);
          } else {
            // 如果是助手的消息，更新推理链
            lastMessage.reasoning_content = reasoning;
            lastMessage.content = text;
          }

          // console.log("Messages before reasoning update:", newMessages);
          // console.log("Last message before reasoning update:", lastMessage);
          
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
    setLoading(false)
  }


  return (
    <div className="flex h-screen bg-white dark:bg-[#1a1a1a] text-black dark:text-white transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-16 bg-blue-100 dark:bg-gray-900 flex flex-col items-center gap-4 py-4">
        <div className="w-10 h-10 bg-blue-200 text-white rounded-full flex items-center justify-center"><DeepSeekIcon /></div>
      </aside>

      {/* Chat area */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b bg-blue-200 dark:bg-gray-900 border-gray-200 dark:border-gray-700 font-bold text-lg">
          ✨AstraFlow ChatUI
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4 space-y-0">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className="relative max-w-[75%]">
                <div
                  className={cn(
                    "px-4 py-2 rounded-xl text-sm shadow",
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                  )}
                >
                  {msg.role === "user" ? (
                    msg.content
                  ) : (
                    <>
                      {loading && idx === messages.length - 1 && (
                        <div className="text-sm text-muted-foreground animate-pulse">
                          {model === "deepseek-chat" ? "DeepSeek-V3" : "DeepSeek-R1"} 正在思考中...
                        </div>
                      )}

                      {msg.reasoning_content && (
                        <div className="mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg border-l-4 border-blue-500 text-sm text-gray-600 dark:text-gray-400">
                          <MarkdownMessage content={msg.reasoning_content} />
                        </div>
                      )}

                      <MarkdownMessage content={msg.content} />
                    </>
                  )}
                </div>

                {/* 右下角模型角标（仅限助手消息，且加载完毕显示） */}
                {msg.role === "assistant" &&
                  (idx !== messages.length - 1 || (idx === messages.length - 1 && !loading)) && (
                    <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 px-2 py-0.5 rounded-full bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-[10px] shadow">
                      {msg.model}
                    </div>
                )}
              </div>
            </div>
          ))}

          <div ref={bottomRef} />
        </ScrollArea>


        {/* Input */}
        <div className="flex justify-end px-4 pt-2">
          <select
            className="bg-gray-100 dark:bg-gray-800 border rounded px-2 py-1 text-sm"
            value={model}
            onChange={(e) => setModel(e.target.value as "deepseek-chat" | "deepseek-reasoner")}
          >
            <option value="deepseek-chat">DeepSeek-V3</option>
            <option value="deepseek-reasoner">DeepSeek-R1</option>
          </select>
        </div>
        <div className="p-4 border-t bg-blue-200 dark:bg-gray-900 dark:border-gray-700 ">
          <div className="max-w-4xl mx-auto bg-gray-300 dark:bg-gray-600 rounded-2xl px-4 py-3 flex items-center gap-2 shadow-inner focus:ring focus:ring-violet-300 dark:visited:ring dark:visited:ring-violet-300  hover:ring-2 hover:ring-blue-300 transition-all duration-300">
          <input
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground text-foreground rounded-lg"
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
