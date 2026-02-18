import { User } from 'lucide-react';
import type { Conversation } from '../../types';

interface Props {
  conversation: Conversation;
  isActive: boolean;
  onClick: () => void;
}

function formatTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86400000);
  
  if (days === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (days === 1) {
    return 'Вчера';
  } else {
    return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
  }
}

export function ConversationItem({ conversation, isActive, onClick }: Props) {
  const participant = conversation.participants[0];
  const lastMessage = conversation.lastMessage;

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 cursor-pointer transition hover:bg-gray-100 ${
        isActive ? 'bg-blue-50 hover:bg-blue-50' : ''
      }`}
    >
      {/* Аватар */}
      <div className="relative">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
          <User size={24} className="text-gray-500" />
        </div>
        {participant.isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
        )}
      </div>
      
      {/* Инфо */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-900 truncate">{participant.name}</h4>
          {lastMessage && (
            <span className="text-xs text-gray-500">{formatTime(lastMessage.timestamp)}</span>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-0.5">
          <p className={`text-sm truncate ${conversation.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
            {lastMessage ? lastMessage.content : 'Нет сообщений'}
          </p>
          
          {conversation.unreadCount > 0 && (
            <span className="bg-blue-600 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}