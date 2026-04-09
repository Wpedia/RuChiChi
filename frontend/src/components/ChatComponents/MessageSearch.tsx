import { useState, useEffect, useCallback } from "react";
import { Search, X, ChevronUp, ChevronDown } from "lucide-react";
import type { Message } from "../../store/chatStore";

interface MessageSearchProps {
  messages: Message[];
  onJumpToMessage?: (messageId: string) => void;
}

export function MessageSearch({ messages, onJumpToMessage }: MessageSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setCurrentIndex(-1);
      return;
    }

    const indices: number[] = [];
    const lowerQuery = query.toLowerCase();
    
    messages.forEach((msg, index) => {
      if (msg.content.toLowerCase().includes(lowerQuery)) {
        indices.push(index);
      }
    });
    
    setResults(indices);
    setCurrentIndex(indices.length > 0 ? 0 : -1);
  }, [query, messages]);

  const handleNext = useCallback(() => {
    if (results.length === 0) return;
    const newIndex = (currentIndex + 1) % results.length;
    setCurrentIndex(newIndex);
    const messageId = messages[results[newIndex]]?.id;
    if (messageId) onJumpToMessage?.(messageId);
  }, [currentIndex, results, messages, onJumpToMessage]);

  const handlePrev = useCallback(() => {
    if (results.length === 0) return;
    const newIndex = currentIndex <= 0 ? results.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    const messageId = messages[results[newIndex]]?.id;
    if (messageId) onJumpToMessage?.(messageId);
  }, [currentIndex, results, messages, onJumpToMessage]);

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
    setCurrentIndex(-1);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "f") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
      if (isOpen && results.length > 0) {
        if (e.key === "Enter") {
          e.shiftKey ? handlePrev() : handleNext();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results.length, handleNext, handlePrev]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-all"
        title="Поиск по сообщениям (Ctrl+F)"
      >
        <Search size={20} />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-2xl px-3 py-2 animate-in fade-in slide-in-from-right-4 duration-200">
      <Search size={18} className="text-gray-400" />
      
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Поиск..."
        autoFocus
        className="bg-transparent border-0 outline-none text-sm w-32 sm:w-48 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
      />
      
      {results.length > 0 && (
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span>{currentIndex + 1}</span>
          <span>/</span>
          <span>{results.length}</span>
        </div>
      )}
      
      {results.length > 0 && (
        <div className="flex items-center">
          <button
            onClick={handlePrev}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Предыдущее (Shift+Enter)"
          >
            <ChevronUp size={16} />
          </button>
          <button
            onClick={handleNext}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Следующее (Enter)"
          >
            <ChevronDown size={16} />
          </button>
        </div>
      )}
      
      <button
        onClick={handleClose}
        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title="Закрыть (Esc)"
      >
        <X size={16} />
      </button>
    </div>
  );
}
