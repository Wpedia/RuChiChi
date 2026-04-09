import { TextMessage } from "./Text";
import { ImageMessage } from "./Image";
import { VoiceMessage } from "./Voice";
import type { Message as MessageType } from "../../../store/chatStore";

interface MessageProps {
  message: MessageType;
  isMe: boolean;
  currentUserId?: string;
  onAddReaction?: (emoji: string) => void;
  onRemoveReaction?: () => void;
}

export function Message({
  message,
  isMe,
  currentUserId,
  onAddReaction,
  onRemoveReaction,
}: MessageProps) {
  const commonProps = {
    message,
    isMe,
    currentUserId,
    onAddReaction,
    onRemoveReaction,
  };

  switch (message.type) {
    case "image":
      return <ImageMessage {...commonProps} />;
    case "voice":
      return <VoiceMessage {...commonProps} />;
    case "text":
    default:
      return <TextMessage {...commonProps} />;
  }
}

export { TextMessage, ImageMessage, VoiceMessage };
