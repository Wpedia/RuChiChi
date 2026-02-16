import { useState, useEffect, useRef } from "react";
import { useChatStore } from "../store/chatStore";
import { CheckCheck, Search, Send, User } from "lucide-react";

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

function ConversationItem({ 
  conversation, 
  isActive, 
  onClick 
}: { 
  conversation: any; 
  isActive: boolean; 
  onClick: () => void;
}) {
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
            {lastMessage ? (
              <>
                {lastMessage.senderId === 'current-user' && (
                  <span className="text-gray-400 mr-1">
                    <CheckCheck size={14} className="inline" />
                  </span>
                )}
                {lastMessage.content}
              </>
            ) : (
              'Нет сообщений'
            )}
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

// Моковые данные для теста


export default function Chat() {
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
  ); //фильтрую диалоги

  
 
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeConversationId) return;
    
    sendMessage(activeConversationId, input);
    setInput('');
    
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
    <div className="bg-white rounded-xl shadow-sm h-[calc(100vhц)] flex overflow-hidden">
      {/* Sidebar - Список диалогов */}
      <div className="w-80 border-r flex flex-col">
        {/* Поиск */}
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
        
        {/* Список */}
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
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            {/* Header */}
            <div className="border-b p-4 flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <User size={20} className="text-gray-500" />
                </div>
                {activeParticipant?.isOnline && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div>
                <h3 className="font-semibold">{activeParticipant?.name}</h3>
                <span className="text-sm text-green-600">
                  {activeParticipant?.isOnline ? 'онлайн' : 'был недавно'}
                </span>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {currentMessages.length === 0 && (
                <div className="text-center text-gray-400 mt-8">
                  Начните общение с {activeParticipant?.name}
                </div>
              )}
              
              {currentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                      msg.senderId === 'current-user'
                        ? 'bg-blue-600 text-white rounded-br-md'
                        : 'bg-white text-gray-900 rounded-bl-md shadow-sm'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <span className={`text-xs mt-1 block ${
                      msg.senderId === 'current-user' ? 'text-blue-200' : 'text-gray-400'
                    }`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <form onSubmit={handleSend} className="border-t p-4 flex gap-2 bg-white">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Введите сообщение..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Send size={20} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Выберите диалог для начала общения
          </div>
        )}
      </div>
    </div>
  );
}
