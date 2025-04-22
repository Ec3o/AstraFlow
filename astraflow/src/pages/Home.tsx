import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl p-8 space-y-6 transition duration-300">
        <h1 className="text-4xl font-bold text-center text-white drop-shadow-sm">
          👋 Welcome to ✨AstraFlow ChatUI!
        </h1>
        <p className="text-white/80 text-center text-lg">
          Start chatting with your AI assistant in style.
        </p>
        <div className="flex justify-center">
          <Link
            to="/chat"
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 hover:scale-105 hover:brightness-110 transition-transform duration-300 text-white font-semibold rounded-full shadow-lg"
          >
            🚀 Go to Chat
          </Link>
        </div>
      </div>
    </div>
  );
}
