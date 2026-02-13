import { useState, useEffect, useRef } from "react";
import { useChatStore } from "../store/chatStore";
import { Send, User } from "lucide-react";

// Моковые данные для теста
const MOCK_CONVERSATION = {
  id: "1",
  participants: [
    {
      id: "2",
      name: "Li Wei",
      username: "liwei",
      avatar: null,
      nativeLanguage: "zh",
      learningLanguage: "ru",
      level: "intermediate",
    } as const,
  ],
};

export default function Chat() {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, setActiveConversation } = useChatStore();

  const conversationId = "1";
  const currentMessages = messages[conversationId] || [];

  useEffect(() => {
    setActiveConversation(conversationId);
    return () => setActiveConversation(null);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(conversationId, input);
    setInput("");

    setTimeout(() => {
      useChatStore.getState().receiveMessage({
        id: Date.now().toString(),
        conversationId,
        senderId: "2",
        sender: MOCK_CONVERSATION.participants[0],
        content: "Привет! Как дела??",
        originalLanguage: "zh",
        timestamp: new Date(),
        isRead: true,
      });
    }, 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm h-[calc(100vh)] flex flex-col">
      {/* Header */}
      <div className="border-b p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <User size={20} className="text-gray-500" />
        </div>
        <div>
          <h3 className="font-semibold">Li Wei</h3>
        </div>
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentMessages.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            Начните общение с Li Wei
          </div>
        )}
        {currentMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.senderId === "current-user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                msg.senderId === "current-user"
                  ? "bg-blue-600 text-white rounded-br-md"
                  : "bg-gray-100 text-gray-900 rounded-bl-md"
              }`}>
                <p>{msg.content}</p>
                <span className="text-xs opacity-70 mt-1 block">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit'})}
                </span>
              </div>
          </div>
        ))}
      </div>
      {/* input */}
      <form onSubmit={handleSend} className="border-t p-4 flex gap-2">
        <input 
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Введите сообщение..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      <button
      type="submit"
      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
        <Send size={20} />
      </button>
          </form>
    </div>
  );
}
