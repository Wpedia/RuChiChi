import { useState, lazy, Suspense } from "react";
import { MessageReactions } from "../../Message/Reactions";
import { StatusIcon } from "../../../../shared/StatusIcon";
import { formatTime } from "../../../../utils/formatters";
import type { Message } from "../../../../store/chatStore";

// Lazy load modal
const ImageModal = lazy(() => import("../common/ImageModal").then(m => ({ default: m.ImageModal })));

interface ImageMessageProps {
  message: Message;
  isMe: boolean;
  currentUserId?: string;
  onAddReaction?: (emoji: string) => void;
  onRemoveReaction?: () => void;
}

export function ImageMessage({
  message,
  isMe,
  currentUserId,
  onAddReaction,
  onRemoveReaction,
}: ImageMessageProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!message.attachmentUrl) return null;

  return (
    <>
      <div className="flex flex-col max-w-[80%]">
        <div className="relative">
          <img
            src={message.attachmentUrl}
            alt="Image"
            className="rounded-2xl cursor-pointer transition-all duration-300 max-w-64 max-h-64 hover:opacity-95 shadow-md"
            onClick={() => setIsExpanded(true)}
            loading="lazy"
          />
          
          <div className="absolute bottom-2 right-2 flex items-center gap-1.5 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full">
            <span className="text-xs text-white/90">{formatTime(message.createdAt)}</span>
            {isMe && (
              <span className="text-white/90">
                <StatusIcon status={message.status} isDark={true} />
              </span>
            )}
          </div>
        </div>

        {onAddReaction && onRemoveReaction && (
          <div className="mt-1.5" onClick={(e) => e.stopPropagation()}>
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

      {isExpanded && (
        <Suspense fallback={null}>
          <ImageModal
            src={message.attachmentUrl}
            onClose={() => setIsExpanded(false)}
          />
        </Suspense>
      )}
    </>
  );
}
