// import ChatLayout from "@/components/chat/ChatLayout"
import ThemeToggle from "@/components/theme/ThemeToggle"

// export default function ChatPage() {
//   return (
//     <div className="relative h-screen">
//       <ThemeToggle />
//       <ChatLayout />
//     </div>
//   )
// }
import ChatStreamLayout from "@/components/chat/ChatStreamLayout"

export default function ChatPage() {
  return (
        <div className="relative h-screen">
          <ThemeToggle />
          <ChatStreamLayout />
        </div>
      )
    }
