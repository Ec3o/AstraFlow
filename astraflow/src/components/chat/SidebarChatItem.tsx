import { HistorySummary } from "@/types/chat"
import { cn } from "@/lib/utils"

interface Props {
  item: HistorySummary
  active: boolean
  onSelect: (id: string) => void
}

export default function SidebarChatItem({ item, active, onSelect }: Props) {
  return (
    <button
      onClick={() => onSelect(item.id)}
      className={cn(
        "w-full text-left px-3 py-2 rounded-lg transition-colors", // 按钮圆角
        // 激活态：背景 + 文字
        active
          ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium"
          : "bg-transparent text-gray-700 dark:text-gray-300",
        // Hover 效果
        "hover:bg-gray-300 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100"
      )}
    >
      <div className="truncate">{item.title}</div>
      <div className="truncate text-xs text-gray-500 dark:text-gray-400">
        {item.lastMessage}
      </div>
    </button>
  )
}
