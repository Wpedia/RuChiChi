import { useState } from 'react';
import { Search } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { ConversationItem } from '../components/ChatComponents/ConversationItems';
import { ChatWindow } from '../components/ChatComponents/ChatWindow';

export default function Chat() {
  const [searchQuery, setSearchQuery] = useState('');
  const { 
    conversations, 
    activeConversationId, 
    messages, 
    sendMessage, 
    setActiveConversation 
  } = useChatStore();

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const currentMessages = activeConversationId ? messages[activeConversationId] || [] : [];
  const activeParticipant = activeConversation?.participants[0];

  const filteredConversations = conversations.filter(conv => 
    conv.participants[0].name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = (content: string) => {
    if (!activeConversationId) return;
    sendMessage(activeConversationId, content);
    
    // Имитация ответа
    setTimeout(() => {
      if (activeParticipant) {
        useChatStore.getState().receiveMessage({
          id: Date.now().toString(),
          conversationId: activeConversationId,
          senderId: activeParticipant.id,
          sender: { id: activeParticipant.id, name: activeParticipant.name, avatar: activeParticipant.avatar },
          content: 'Спасибо за сообщение! 👋',
          originalLanguage: 'zh',
          timestamp: new Date(),
          isRead: false,
        });
      }
    }, 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm h-[calc(100vh-140px)] flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={conv.id === activeConversationId}
              onClick={() => setActiveConversation(conv.id)}
            />
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {activeConversation && activeParticipant ? (
        <ChatWindow
          messages={currentMessages}
          participantName={activeParticipant.name}
          isOnline={activeParticipant.isOnline || false}
          onSend={handleSend}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-400">
          Выберите диалог для начала общения
        </div>
      )}
    </div>
  );
}