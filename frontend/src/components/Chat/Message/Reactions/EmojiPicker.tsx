import { createPortal } from "react-dom";
import { getReactionAnimation } from "./utils";
import "./styles.css";

const EMOJI_LIST = ["❤️", "👍", "👎", "😂", "😮", "😢", "🎉", "🔥"];

interface EmojiPickerProps {
  position: { top: number; left: number };
  selectedEmojis?: Record<string, boolean>;
  animatingEmoji?: string | null;
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

export function EmojiPicker({
  position,
  selectedEmojis = {},
  animatingEmoji,
  onSelect,
  onClose,
}: EmojiPickerProps) {
  const handleSelect = (emoji: string) => {
    onSelect(emoji);
    onClose();
  };

  return createPortal(
    <>
      {/* Backdrop для закрытия по клику вне */}
      <div
        className="fixed inset-0 z-[9998]"
        onClick={onClose}
      />
      
      {/* Picker */}
      <div
        data-reaction-picker
        onClick={(e) => e.stopPropagation()}
        className="fixed z-[9999] p-1.5 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
      >
        <div className="flex gap-0.5">
          {EMOJI_LIST.map((emoji) => {
            const isSelected = selectedEmojis[emoji];
            return (
              <button
                key={emoji}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSelect(emoji);
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
      </div>
    </>,
    document.body
  );
}
