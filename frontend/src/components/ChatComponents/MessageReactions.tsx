import { useState, useRef, useEffect, useCallback } from "react";
import { SmilePlus } from "lucide-react";
import { createPortal } from "react-dom";
import type { Reaction } from "../../store/chatStore";
import { useChatStore } from "../../store/chatStore";

const EMOJI_LIST = ["❤️", "👍", "👎", "😂", "😮", "😢", "🎉", "🔥"];

// Анимации для каждой реакции
const getReactionAnimation = (emoji: string, isAnimating: boolean) => {
  if (!isAnimating) return "";
  
  switch (emoji) {
    case "❤️":
      return "animate-heartbeat";
    case "👍":
    case "👎":
      return "animate-bounce-rotate";
    case "😂":
      return "animate-shake";
    case "😮":
      return "animate-pop";
    case "😢":
      return "animate-wobble";
    case "🎉":
      return "animate-tada";
    case "🔥":
      return "animate-flame";
    default:
      return "animate-bounce";
  }
};

interface MessageReactionsProps {
  reactions?: Reaction[];
  currentUserId?: string;
  onAddReaction: (emoji: string) => void;
  onRemoveReaction: () => void;
  isMe: boolean;
}

export function MessageReactions({
  reactions = [],
  currentUserId,
  onAddReaction,
  onRemoveReaction,
  isMe,
}: MessageReactionsProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [pickerPosition, setPickerPosition] = useState({ top: 0, left: 0 });
  const [hoveredEmoji, setHoveredEmoji] = useState<string | null>(null);
  const [animatingEmoji, setAnimatingEmoji] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const users = useChatStore((state) => state.users);

  // Close picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest("[data-reaction-picker]")) {
        setShowPicker(false);
      }
    }
    
    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showPicker]);

  // Calculate picker position
  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const pickerWidth = 240; // Уже
    const pickerHeight = 50; // Компактная высота
    
    // По умолчанию показываем СНИЗУ от кнопки
    let top = rect.bottom + 5;
    let left = rect.left + rect.width / 2 - pickerWidth / 2; // Центрируем относительно кнопки

    // Если снизу не помещается - показываем сверху
    if (top + pickerHeight > window.innerHeight - 10) {
      top = rect.top - pickerHeight - 5;
    }

    // Проверка по горизонтали
    if (left < 10) left = 10;
    if (left + pickerWidth > window.innerWidth - 10) {
      left = window.innerWidth - pickerWidth - 10;
    }
    
    setPickerPosition({ top, left });
  }, [isMe]);

  const handleTogglePicker = () => {
    if (!showPicker) {
      updatePosition();
    }
    setShowPicker(!showPicker);
  };

  useEffect(() => {
    if (showPicker) {
      const handleScroll = () => updatePosition();
      const handleResize = () => updatePosition();
      
      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", handleResize);
      
      return () => {
        window.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [showPicker, updatePosition]);

  const reactionGroups = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = { count: 0, users: [], hasCurrentUser: false };
    }
    acc[reaction.emoji].count++;
    
    const user = users.find((u) => u.id === reaction.userId);
    const userName = user?.firstName || user?.phoneOrLogin || "Неизвестный";
    acc[reaction.emoji].users.push(userName);
    
    if (reaction.userId === currentUserId) {
      acc[reaction.emoji].hasCurrentUser = true;
    }
    
    return acc;
  }, {} as Record<string, { count: number; users: string[]; hasCurrentUser: boolean }>);

  const hasAnyReaction = reactions.some((r) => r.userId === currentUserId);

  const handleEmojiClick = (emoji: string) => {
    setAnimatingEmoji(emoji);
    
    if (reactionGroups[emoji]?.hasCurrentUser) {
      onRemoveReaction();
    } else {
      onAddReaction(emoji);
    }
    
    setTimeout(() => setAnimatingEmoji(null), 600);
    setShowPicker(false);
  };

  const getTooltipText = (emoji: string, data: { users: string[]; count: number }) => {
    if (data.count === 1) return data.users[0];
    if (data.count === 2) return `${data.users[0]} и ${data.users[1]}`;
    return `${data.users.slice(0, 2).join(", ")} и ещё ${data.count - 2}`;
  };

  return (
    <>
      {/* CSS анимации */}
      <style>{`
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.3); }
          50% { transform: scale(1); }
          75% { transform: scale(1.3); }
        }
        @keyframes bounce-rotate {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-15deg) scale(1.2); }
          50% { transform: rotate(0deg) scale(1); }
          75% { transform: rotate(15deg) scale(1.2); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          10% { transform: translateX(-5px) rotate(-5deg); }
          20% { transform: translateX(5px) rotate(5deg); }
          30% { transform: translateX(-5px) rotate(-5deg); }
          40% { transform: translateX(5px) rotate(5deg); }
          50% { transform: translateX(0) rotate(0deg); }
        }
        @keyframes pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.4); }
          100% { transform: scale(1); }
        }
        @keyframes wobble {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          15% { transform: translateX(-5px) rotate(-5deg); }
          30% { transform: translateX(4px) rotate(3deg); }
          45% { transform: translateX(-4px) rotate(-3deg); }
          60% { transform: translateX(3px) rotate(2deg); }
          75% { transform: translateX(-2px) rotate(-1deg); }
        }
        @keyframes tada {
          0% { transform: scale(1) rotate(0deg); }
          10% { transform: scale(0.9) rotate(-3deg); }
          20% { transform: scale(0.9) rotate(-3deg); }
          30% { transform: scale(1.1) rotate(3deg); }
          40% { transform: scale(1.1) rotate(-3deg); }
          50% { transform: scale(1.1) rotate(3deg); }
          60% { transform: scale(1.1) rotate(-3deg); }
          70% { transform: scale(1.1) rotate(3deg); }
          80% { transform: scale(1.1) rotate(-3deg); }
          90% { transform: scale(1.1) rotate(3deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes flame {
          0%, 100% { transform: scale(1) rotate(0deg); filter: brightness(1); }
          25% { transform: scale(1.2) rotate(-5deg) translateY(-2px); filter: brightness(1.2); }
          50% { transform: scale(1.1) rotate(0deg); filter: brightness(1); }
          75% { transform: scale(1.2) rotate(5deg) translateY(-2px); filter: brightness(1.3); }
        }
        .animate-heartbeat { animation: heartbeat 0.6s ease-in-out; }
        .animate-bounce-rotate { animation: bounce-rotate 0.6s ease-in-out; }
        .animate-shake { animation: shake 0.6s ease-in-out; }
        .animate-pop { animation: pop 0.4s ease-out; }
        .animate-wobble { animation: wobble 0.6s ease-in-out; }
        .animate-tada { animation: tada 0.8s ease-in-out; }
        .animate-flame { animation: flame 0.6s ease-in-out; }
      `}</style>

      <div className={`flex items-center gap-1.5 mt-1.5 flex-wrap ${isMe ? "justify-end" : "justify-start"}`}>
        {/* Display existing reactions */}
        {Object.entries(reactionGroups).map(([emoji, data]) => (
          <div
            key={emoji}
            className="relative group"
            onMouseEnter={() => setHoveredEmoji(emoji)}
            onMouseLeave={() => setHoveredEmoji(null)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEmojiClick(emoji);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-base transition-all duration-200 hover:scale-110 ${
                data.hasCurrentUser
                  ? "bg-indigo-100 dark:bg-indigo-900/50 border-2 border-indigo-400 dark:border-indigo-600 shadow-sm"
                  : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm"
              }`}
            >
              <span className={`text-xl ${getReactionAnimation(emoji, animatingEmoji === emoji)}`}>
                {emoji}
              </span>
              <span className={`text-sm font-semibold ${
                data.hasCurrentUser 
                  ? "text-indigo-600 dark:text-indigo-400" 
                  : "text-gray-600 dark:text-gray-400"
              }`}>
                {data.count}
              </span>
            </button>

            {/* Tooltip */}
            {hoveredEmoji === emoji && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm rounded-xl whitespace-nowrap shadow-xl z-[100] animate-in fade-in zoom-in-95 duration-200 pointer-events-none">
                {getTooltipText(emoji, data)}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-white" />
              </div>
            )}
          </div>
        ))}

        {/* Add reaction button */}
        <button
          ref={buttonRef}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleTogglePicker();
          }}
          className={`p-2 rounded-full transition-all duration-200 ${
            hasAnyReaction
              ? "text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
              : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          } ${showPicker ? "bg-gray-100 dark:bg-gray-800" : ""}`}
          style={{ position: 'relative', zIndex: 20 }}
          title="Добавить реакцию"
        >
          <SmilePlus size={18} />
        </button>

        {/* Portal picker */}
        {showPicker && createPortal(
          <div
            data-reaction-picker
            onClick={(e) => e.stopPropagation()}
            className="fixed z-[9999] p-1.5 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200"
            style={{
              top: `${pickerPosition.top}px`,
              left: `${pickerPosition.left}px`,
            }}
          >
            {/* Emoji grid компактный */}
            <div className="flex gap-0.5">
              {EMOJI_LIST.map((emoji) => {
                const isSelected = reactionGroups[emoji]?.hasCurrentUser;
                return (
                  <button
                    key={emoji}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleEmojiClick(emoji);
                    }}
                    className={`relative p-1.5 rounded-lg text-xl transition-all duration-150 hover:scale-110 ${
                      isSelected
                        ? "bg-indigo-100 dark:bg-indigo-900/50"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <span className={getReactionAnimation(emoji, animatingEmoji === emoji)}>
                      {emoji}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>,
          document.body
        )}
      </div>
    </>
  );
}
