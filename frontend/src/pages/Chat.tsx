import { useEffect, useState, useRef } from 'react';
import { Search, Send, User } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { useAuthStore } from '../store/authStore';
import { useSocket } from '../hooks/useSocket';
import api from '../services/api';

export default function Chat() {
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { user: currentUser } = useAuthStore();
  const { 
    users, 
    messages, 
    activeUserId, 
    setActiveUser, 
    addMessage, 
    setMessages,
    setUsers 
  } = useChatStore();
  
  const { sendMessage, getHistory, on } = useSocket();

  // Загружаем реальных пользователей с API
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const { data } = await api.get('/auth/users');
        setUsers(data);
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUsers();
  }, [setUsers]);

  // Подписываемся на WebSocket события
  useEffect(() => {
    const unsubSent = on('message_sent', ({ message }) => {
      addMessage(message);
    });

    const unsubNew = on('new_message', ({ message }) => {
      addMessage(message);
    });

    const unsubHistory = on('message_history', ({ messages: history }) => {
      if (activeUserId) {
        setMessages(activeUserId, history);
      }
    });

    return () => {
      unsubSent();
      unsubNew();
      unsubHistory();
    };
  }, [on, addMessage, setMessages, activeUserId]);

  // Загружаем историю при смене собеседника
  useEffect(() => {
    if (activeUserId) {
      getHistory(activeUserId);
    }
  }, [activeUserId, getHistory]);

  // Автоскролл к новым сообщениям
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeUserId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeUserId) return;
    
    sendMessage(activeUserId, input);
    setInput('');
  };

  const activeUser = users.find(u => u.id === activeUserId);
  const currentMessages = activeUserId ? messages[activeUserId] || [] : [];
  
  const filteredUsers = users.filter(u => 
    (u.firstName || u.phoneOrLogin).toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-48px)]">
        <div className="text-gray-500">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm h-[calc(100vh-48px)] flex overflow-hidden">
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
          {filteredUsers.length === 0 && (
            <div className="p-4 text-center text-gray-500">Нет пользователей</div>
          )}
          
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => setActiveUser(user.id)}
              className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 ${
                user.id === activeUserId ? 'bg-blue-50' : ''
              }`}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User size={24} className="text-gray-500" />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <h4 className="font-medium">{user.firstName || user.phoneOrLogin}</h4>
                <p className="text-sm text-gray-500">онлайн</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeUser ? (
          <>
            {/* Header */}
            <div className="border-b p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <User size={20} className="text-gray-500" />
              </div>
              <div>
                <h3 className="font-semibold">{activeUser.firstName || activeUser.phoneOrLogin}</h3>
                <span className="text-sm text-green-600">онлайн</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {currentMessages.length === 0 && (
                <div className="text-center text-gray-400 mt-8">
                  Начните общение с {activeUser.firstName || activeUser.phoneOrLogin}
                </div>
              )}
              
              {currentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                      msg.senderId === currentUser?.id
                        ? 'bg-blue-600 text-white rounded-br-md'
                        : 'bg-white text-gray-900 rounded-bl-md shadow-sm'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <span className={`text-xs mt-1 block ${
                      msg.senderId === currentUser?.id ? 'text-blue-200' : 'text-gray-400'
                    }`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
            Выберите пользователя для начала общения
          </div>
        )}
      </div>
    </div>
  );
}