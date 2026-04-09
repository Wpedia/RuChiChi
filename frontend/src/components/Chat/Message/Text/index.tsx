import { StatusIcon } from "../../../../shared/StatusIcon";
import { MessageReactions } from "../../Message/Reactions";
import { formatTime } from "../../../../utils/formatters";
import type { Message } from "../../../../store/chatStore";

interface TextMessageProps {
  message: Message;
  isMe: boolean;
  currentUserId?: string;
  onAddReaction?: (emoji: string) => void;
  onRemoveReaction?: () => void;
}

export function TextMessage({
  message,
  isMe,
  currentUserId,
  onAddReaction,
  onRemoveReaction,
}: TextMessageProps) {
  return (
    <div className="flex flex-col max-w-[80%]">
      <div
        className={`rounded-2xl shadow-sm transition-all px-4 py-2 ${
          isMe
            ? "bg-indigo-600 text-white rounded-br-md"
            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md hover:shadow-md"
        }`}
      >
        <p className="leading-relaxed text-[15px] break-all whitespace-pre-wrap">{message.content}</p>

        <div className={`flex items-center gap-1.5 mt-1 ${isMe ? "justify-end" : ""}`}>
          <span className={`text-xs ${isMe ? "text-indigo-200" : "text-gray-500 dark:text-gray-400"}`}>
            {formatTime(message.createdAt)}
          </span>
          {isMe && <StatusIcon status={message.status} isDark={isMe} />}
        </div>
      </div>

      {onAddReaction && onRemoveReaction && (
        <div className="mt-1" onClick={(e) => e.stopPropagation()}>
          <MessageReactions
            reactions={message.reactions}
            currentUserId={currentUserId}
            onAddReaction={onAddReaction}
            onRemoveReaction={onRemoveReaction}
            isMe={isMe}
          />
        </div>
      )}
    </div>
  );
}
