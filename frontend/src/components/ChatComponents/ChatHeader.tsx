import { useState } from "react";
import type { User, Message } from "../../store/chatStore";
import { formatLastSeen } from "./utils";
import { MessageSearch } from "./MessageSearch";

interface ChatHeaderProps {
  user: User;
  isSomeoneTyping: boolean;
  messages?: Message[];
  onJumpToMessage?: (messageId: string) => void;
}

export function ChatHeader({ user, isSomeoneTyping, messages = [], onJumpToMessage }: ChatHeaderProps) {
  const [showStatusTooltip, setShowStatusTooltip] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-800 p-4 flex items-center gap-4 bg-white dark:bg-gray-900 shrink-0">
      <div className="relative">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-md">
          {(user.firstName || user.phoneOrLogin).charAt(0).toUpperCase()}
        </div>
        <div
          className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-white dark:ring-gray-900 cursor-pointer transition-transform hover:scale-110"
          style={{
            backgroundColor: user.isOnline ? "#10b981" : "#9ca3af",
          }}
          onMouseEnter={() => setShowStatusTooltip(true)}
          onMouseLeave={() => setShowStatusTooltip(false)}
        >
          {showStatusTooltip && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm rounded-xl whitespace-nowrap shadow-xl z-50">
              {user.isOnline
                ? "онлайн"
                : user.lastSeen
                ? `был ${formatLastSeen(user.lastSeen)}`
                : "оффлайн"}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-white" />
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 dark:text-white text-lg truncate">
          {user.firstName || user.phoneOrLogin}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {isSomeoneTyping ? (
            <span className="text-indigo-500 flex items-center gap-1">
              печатает
              <span className="flex gap-0.5">
                <span
                  className="w-1 h-1 bg-current rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="w-1 h-1 bg-current rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-1 h-1 bg-current rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </span>
            </span>
          ) : user.isOnline ? (
            "онлайн"
          ) : user.lastSeen ? (
            `был ${formatLastSeen(user.lastSeen)}`
          ) : (
            "оффлайн"
          )}
        </p>
      </div>
      
      {/* Message Search */}
      <MessageSearch messages={messages} onJumpToMessage={onJumpToMessage} />
    </div>
  );
}
