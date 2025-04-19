import { useState } from "react"

interface Message {
  role: "user" | "assistant"
  content: string
  reasoning_content?: string // 推理链输出
}


const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY
const BASE_URL = "https://api.deepseek.com/v1"

export function useChatStream() {
  const [streaming, setStreaming] = useState(false)

  const sendMessage = async (
    messages: Message[],
    onChunk: (text: string, reasoning: string) => void,
    onComplete: (final: Message) => void,
    model: "deepseek-chat" | "deepseek-reasoner" = "deepseek-chat"
  ) => {
    setStreaming(true)
  
    const cleanedMessages = messages.map(({ role, content }) => ({ role, content }))
    
    if (model === "deepseek-reasoner") {
      while (cleanedMessages.length > 0 && cleanedMessages[0].role !== "user") {
        cleanedMessages.shift()
      }
    }
  
    const res = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: cleanedMessages,
        stream: true,
      }),
    })
  
    const reader = res.body?.getReader()
    const decoder = new TextDecoder("utf-8")
    let fullText = ""
    let reasoning = ""
  
    while (true) {
      const { done, value } = await reader!.read()
      if (done) break
      const chunk = decoder.decode(value)
      const lines = chunk.split("\n").filter((line) => line.startsWith("data:"))
  
      for (const line of lines) {
        const json = line.replace(/^data: /, "")
        if (json === "[DONE]") {
          // 推理链和完整内容返回
          onComplete({ role: "assistant", content: fullText, reasoning_content: reasoning })
          setStreaming(false)
          return
        }
  
        const parsed = JSON.parse(json)
        const delta = parsed.choices?.[0]?.delta || {}
        const deltaContent = delta.content || ""
        const deltaReasoning = delta.reasoning_content || ""
  
        fullText += deltaContent
        reasoning += deltaReasoning
        // console.log("fullText", fullText)
        // console.log("reasoning", reasoning)
        // 实时更新流式内容，包括推理链
        // onComplete({ role: "assistant", content: fullText, reasoning_content: reasoning })
        onChunk(fullText, reasoning)  // 更新：传递 reasoning 到 onChunk
      }
    }
  
    setStreaming(false)
  }

  return { sendMessage, streaming }
}


