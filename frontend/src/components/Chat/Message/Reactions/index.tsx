import { useState, useRef, useEffect, useCallback, lazy, Suspense } from "react";
import { SmilePlus } from "lucide-react";
import { useChatStore, type Reaction } from "../../../../store/chatStore";
import { getReactionAnimation } from "./utils";
import "./styles.css";

// Lazy load EmojiPicker
const EmojiPicker = lazy(() => import("./EmojiPicker").then(m => ({ default: m.EmojiPicker })));

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

  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const pickerWidth = 240;
    const pickerHeight = 50;
    
    let top = rect.bottom + 5;
    let left = rect.left + rect.width / 2 - pickerWidth / 2;

    if (left < 10) left = 10;
    if (left + pickerWidth > window.innerWidth - 10) {
      left = window.innerWidth - pickerWidth - 10;
    }
    if (top + pickerHeight > window.innerHeight - 10) {
      top = rect.top - pickerHeight - 5;
    }
    
    setPickerPosition({ top, left });
  }, []);

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
  };

  const getTooltipText = (emoji: string, data: { users: string[]; count: number }) => {
    if (data.count === 1) return data.users[0];
    if (data.count === 2) return `${data.users[0]} и ${data.users[1]}`;
    return `${data.users.slice(0, 2).join(", ")} и ещё ${data.count - 2}`;
  };

  const selectedEmojis = Object.fromEntries(
    Object.entries(reactionGroups).map(([emoji, data]) => [emoji, data.hasCurrentUser])
  );

  return (
    <div className={`flex items-center gap-1.5 mt-1.5 flex-wrap ${isMe ? "justify-end" : "justify-start"}`}>
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

          {hoveredEmoji === emoji && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm rounded-xl whitespace-nowrap shadow-xl z-[100] animate-in fade-in zoom-in-95 duration-200 pointer-events-none">
              {getTooltipText(emoji, data)}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-white" />
            </div>
          )}
        </div>
      ))}

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

      {showPicker && (
        <Suspense fallback={null}>
          <EmojiPicker
            position={pickerPosition}
            selectedEmojis={selectedEmojis}
            animatingEmoji={animatingEmoji}
            onSelect={handleEmojiClick}
            onClose={() => setShowPicker(false)}
          />
        </Suspense>
      )}
    </div>
  );
}
