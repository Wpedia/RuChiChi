import { useRef, useEffect, useCallback, useState } from "react";
import { MessageCircle, Loader2 } from "lucide-react";
import { Message } from "../Chat/Message";
import type { Message as MessageType, User } from "../../store/chatStore";

interface ChatMessagesProps {
  messages: MessageType[];
  currentUserId: string | undefined;
  activeUser: User;
  isSomeoneTyping: boolean;
  isDark: boolean;
  onMarkAsRead: (messageId: string) => void;
  onAddReaction?: (messageId: string, emoji: string) => void;
  onRemoveReaction?: (messageId: string) => void;
  highlightMessageId?: string;
  searchQuery?: string;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

export function ChatMessages({
  messages,
  currentUserId,
  activeUser,
  isSomeoneTyping,
  isDark,
  onMarkAsRead,
  onAddReaction,
  onRemoveReaction,
  highlightMessageId,
  searchQuery,
  onLoadMore,
  hasMore,
  isLoadingMore,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const messageRefs = useRef<Record<string, HTMLDivElement>>({});
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const prevMessagesLength = useRef(messages.length);

  // Auto-scroll to bottom on initial load and new messages
  useEffect(() => {
    if (shouldScrollToBottom && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages, shouldScrollToBottom, isSomeoneTyping]);

  // Track if user is at bottom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isAtBottom = 
        container.scrollHeight - container.scrollTop - container.clientHeight < 50;
      setShouldScrollToBottom(isAtBottom);
      
      // Load more when near top
      if (container.scrollTop < 100 && hasMore && !isLoadingMore && onLoadMore) {
        onLoadMore();
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasMore, isLoadingMore, onLoadMore]);

  // Scroll to highlighted message
  useEffect(() => {
    if (highlightMessageId) {
      const element = messageRefs.current[highlightMessageId];
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        setHighlightedId(highlightMessageId);
        setTimeout(() => setHighlightedId(null), 2000);
      }
    }
  }, [highlightMessageId]);

  const setMessageRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
    if (el) messageRefs.current[id] = el;
  }, []);

  const avatarLetter = (activeUser.firstName || activeUser.phoneOrLogin).charAt(0).toUpperCase();

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-yellow-300 dark:bg-yellow-600 text-gray-900 dark:text-white rounded px-0.5">
          {part}
        </mark>
      ) : part
    );
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-gray-400 dark:text-gray-500">
        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <MessageCircle size={32} className="text-gray-300 dark:text-gray-600" />
        </div>
        <p className="text-lg font-medium mb-1">Начните общение</p>
        <p className="text-sm">Отправьте первое сообщение {activeUser.firstName || activeUser.phoneOrLogin}</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent"
    >
      {/* Loading indicator at top */}
      {isLoadingMore && (
        <div className="flex justify-center py-2">
          <Loader2 size={20} className="animate-spin text-gray-400" />
        </div>
      )}
      
      {/* "Load more" indicator */}
      {hasMore && !isLoadingMore && (
        <div className="flex justify-center py-2 text-xs text-gray-400">
          Листайте вверх для загрузки старых сообщений
        </div>
      )}

      {messages.map((msg, index) => {
        const isMe = msg.senderId === currentUserId;
        const showAvatar = !isMe && (index === 0 || messages[index - 1]?.senderId !== msg.senderId);
        const isHighlighted = highlightedId === msg.id;

        const messageContent = searchQuery && msg.type !== 'image' && msg.type !== 'voice' 
          ? { ...msg, content: highlightText(msg.content, searchQuery) as unknown as string }
          : msg;

        return (
          <div
            key={msg.id}
            ref={setMessageRef(msg.id)}
            className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-2 ${
              isHighlighted ? "animate-pulse bg-yellow-100/50 dark:bg-yellow-900/20 rounded-2xl -mx-2 px-2 py-1" : ""}`}
            onClick={!isMe && !msg.isRead ? () => onMarkAsRead(msg.id) : undefined}
          >
            {!isMe && showAvatar && (
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                {avatarLetter}
              </div>
            )}
            {!isMe && !showAvatar && <div className="w-8 shrink-0" />}

            <Message
              message={messageContent}
              isMe={isMe}
              currentUserId={currentUserId}
              onAddReaction={onAddReaction ? (emoji) => onAddReaction(msg.id, emoji) : undefined}
              onRemoveReaction={onRemoveReaction ? () => onRemoveReaction(msg.id) : undefined}
            />
          </div>
        );
      })}

      {isSomeoneTyping && (
        <div className="flex justify-start items-end gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
            {avatarLetter}
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md rounded-2xl px-5 py-3 shadow-sm">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
