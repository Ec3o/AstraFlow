import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Welcome to DeepSeek Chat
        </h1>
        <p className="text-gray-600 text-center">
          Start chatting with the DeepSeek AI assistant
        </p>
        <div className="flex justify-center">
          <Link
            to="/chat"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium transition-colors"
          >
            Go to Chat
          </Link>
        </div>
      </div>
    </div>
  );
}