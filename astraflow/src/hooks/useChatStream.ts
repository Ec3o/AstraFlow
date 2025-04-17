import { useState } from "react"

interface Message {
  role: "user" | "assistant"
  content: string
}

const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY
const BASE_URL = "https://api.deepseek.com/v1"

export function useChatStream() {
  const [streaming, setStreaming] = useState(false)

  const sendMessage = async (
    messages: Message[],
    onChunk: (text: string) => void,
    onComplete: (final: string) => void
  ) => {
    setStreaming(true)

    const res = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages,
        stream: true,
      }),
    })

    const reader = res.body?.getReader()
    const decoder = new TextDecoder("utf-8")
    let fullText = ""

    while (true) {
      const { done, value } = await reader!.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split("\n").filter((line) => line.startsWith("data:"))

      for (const line of lines) {
        const json = line.replace(/^data: /, "")
        if (json === "[DONE]") {
          onComplete(fullText)
          setStreaming(false)
          return
        }

        const parsed = JSON.parse(json)
        const delta = parsed.choices?.[0]?.delta?.content || ""
        fullText += delta
        onChunk(fullText)
      }
    }

    setStreaming(false)
  }

  return { sendMessage, streaming }
}
