import { Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Message } from "../../types";

interface Props {
  messages: Message[];
  participantName: string;
  isOnline: boolean;
  onSend: (content: string) => void;
}

export function ChatWindow({
  messages,
  participantName,
  isOnline,
  onSend,
}: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="border-b p-4 flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <User size={20} className="text-gray-500" />
          </div>
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>
        <div>
          <h3 className="font-semibold">{participantName}</h3>
          <span className="text-sm text-green-600">
            {isOnline ? "онлайн" : "был недавно"}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            Начните общение с {participantName}
          </div>
        )}

        {messages.map((msg) => (
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
                  : "bg-white text-gray-900 rounded-bl-md shadow-sm"
              }`}
            >
              <p>{msg.content}</p>
              <span
                className={`text-xs mt-1 block ${
                  msg.senderId === "current-user"
                    ? "text-blue-200"
                    : "text-gray-400"
                }`}
              >
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="border-t p-4 flex gap-2 bg-white"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Введите сообщение..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
