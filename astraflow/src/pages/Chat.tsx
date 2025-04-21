// pages/Chat.tsx
import { useState } from "react"
import ThemeToggle from "@/components/theme/ThemeToggle"
import ChatStreamLayout from "@/components/chat/ChatStreamLayout"
import SidebarChatItem from "@/components/chat/SidebarChatItem"
import { HistorySummary } from "@/types/chat"
import { Menu, X } from "lucide-react"

export default function ChatPage() {
  const [history] = useState<HistorySummary[]>([
    { id: "1", title: "首次会话", lastMessage: "Hi!" },
    { id: "2", title: "第二次会话", lastMessage: "好的" },
  ])
  const [activeId, setActiveId] = useState("1")
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="relative h-screen flex overflow-hidden">
      {/* sidebar */}
      <aside
        className={`bg-gray-100 dark:bg-gray-900 border-r dark:border-gray-700
          transition-all duration-300 ${expanded ? "w-64" : "w-0 md:w-14"}
          flex-shrink-0`}
      >
        <div className="h-12 flex items-center justify-between px-3 border-b dark:border-gray-700">
          <span className="text-sm font-semibold truncate text-xs text-gray-500 dark:text-gray-400">Chat History</span>
          <button onClick={() => setExpanded(!expanded)}>
            {expanded ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <div className="p-2 space-y-1 overflow-y-auto h-[calc(100%-3rem)]">
          {history.map((h) => (
            <SidebarChatItem
              key={h.id}
              item={h}
              active={h.id === activeId}
              onSelect={(id) => {
                setActiveId(id)
                if (window.innerWidth < 768) setExpanded(false)
              }}
            />
          ))}
        </div>
      </aside>

      {/* main */}
      <main className="flex-1 relative h-full">
        <ThemeToggle className="absolute top-3 right-3 z-10" />
        <ChatStreamLayout key={activeId} chatId={activeId} />
      </main>
    </div>
  )
}
