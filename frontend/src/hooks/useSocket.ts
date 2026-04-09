import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;
    
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    socketRef.current = io('http://localhost:3000/chat', {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user]);

  const sendMessage = useCallback((receiverId: string, content: string) => {
    socketRef.current?.emit('send_message', { receiverId, content });
  }, []);

  const getHistory = useCallback((userId: string, limit?: number, offset?: number) => {
    socketRef.current?.emit('get_history', { userId, limit, offset });
  }, []);

  const startTyping = useCallback((conversationId: string) => {
    socketRef.current?.emit('typing_start', { conversationId });
  }, []);

  const stopTyping = useCallback((conversationId: string) => {
    socketRef.current?.emit('typing_stop', { conversationId });
  }, []);

  const markAsRead = useCallback((messageId: string) => {
    socketRef.current?.emit('mark_read', { messageId });
  }, []);

  const on = useCallback((event: string, callback: (data: any) => void) => {
    socketRef.current?.on(event, callback);
    return () => socketRef.current?.off(event, callback);
  }, []);

  return { 
    sendMessage, 
    getHistory, 
    startTyping, 
    stopTyping, 
    markAsRead, 
    on,
    socket: socketRef.current 
  };
};