import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { MessageReactions } from "../../Message/Reactions";
import { StatusIcon } from "../../../../shared/StatusIcon";
import { formatTime, formatDuration } from "../../../../utils/formatters";
import type { Message } from "../../../../store/chatStore";

interface VoiceMessageProps {
  message: Message;
  isMe: boolean;
  currentUserId?: string;
  onAddReaction?: (emoji: string) => void;
  onRemoveReaction?: () => void;
}

export function VoiceMessage({
  message,
  isMe,
  currentUserId,
  onAddReaction,
  onRemoveReaction,
}: VoiceMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!message.attachmentUrl) return null;

  const handlePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(message.attachmentUrl);
      audioRef.current.addEventListener("ended", () => {
        setIsPlaying(false);
        setProgress(0);
      });
      audioRef.current.addEventListener("timeupdate", () => {
        if (audioRef.current) {
          setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        }
      });
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex flex-col max-w-[80%]">
      <div className={`inline-flex items-center gap-3 px-4 py-3 rounded-2xl shadow-md ${
        isMe 
          ? "bg-indigo-600 text-white rounded-br-md" 
          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md"
      }`}>
        <button
          onClick={handlePlay}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
            isMe
              ? "bg-white/20 hover:bg-white/30 text-white"
              : "bg-indigo-100 dark:bg-indigo-900/50 hover:bg-indigo-200 dark:hover:bg-indigo-800 text-indigo-600 dark:text-indigo-400"
          }`}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>
        
        <div className="flex flex-col gap-1 min-w-[80px]">
          <div className={`h-1.5 rounded-full overflow-hidden w-24 ${
            isMe ? "bg-white/20" : "bg-gray-300 dark:bg-gray-600"
          }`}>
            <div
              className={`h-full rounded-full transition-all ${isMe ? "bg-white" : "bg-indigo-500"}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className={`text-xs leading-none ${isMe ? "text-indigo-200" : "text-gray-500"}`}>
            {formatDuration(message.voiceDuration || 0)}
          </span>
        </div>

        <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-white/20 dark:border-gray-600">
          <span className={`text-xs ${isMe ? "text-indigo-200" : "text-gray-500"}`}>
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
