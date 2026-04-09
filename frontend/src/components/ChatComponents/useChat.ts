import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useAuthStore } from "../../store/authStore";
import { useSocket } from "../../hooks/useSocket";
import api from "../../services/api";
import {
  useChatStore,
  type Message,
} from "../../store/chatStore";
import { getConversationId } from "./utils";

export function useChat() {
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { user: currentUser } = useAuthStore();
  const {
    users,
    messages,
    activeUserId,
    typingUsers,
    unreadCounts,
    messagesOffset,
    hasMoreMessages,
    setUsers,
    updateUserStatus,
    setActiveUser,
    addMessage,
    updateMessageStatus,
    setMessages,
    prependMessages,
    addTypingUser,
    removeTypingUser,
    setTypingUsers,
    addReaction,
    removeReaction,
  } = useChatStore();

  const { sendMessage, getHistory, startTyping, stopTyping, markAsRead, on } =
    useSocket();

  const activeConversationId =
    activeUserId && currentUser
      ? getConversationId(currentUser.id, activeUserId)
      : null;

  const currentMessages = activeConversationId
    ? messages[activeConversationId] || []
    : [];

  const activeTypingUsers = activeConversationId
    ? typingUsers[activeConversationId] || []
    : [];

  const isSomeoneTyping =
    activeTypingUsers.length > 0 &&
    !activeTypingUsers.includes(currentUser?.id || "");

  // Load users on mount
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const { data } = await api.get("/auth/users");
        setUsers(data || []);
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUsers();
  }, [setUsers]);

  // Socket event listeners
  useEffect(() => {
    const unsubSent = on(
      "message_sent",
      ({ message }: { message: Message }) => {
        addMessage(message);
      }
    );

    const unsubNew = on("new_message", ({ message }: { message: Message }) => {
      addMessage(message);
      if (message.senderId === activeUserId) {
        markAsRead(message.id);
      }
    });

    const unsubHistory = on(
      "message_history",
      ({ messages: history, offset }: { messages: Message[]; offset?: number }) => {
        if (activeUserId && currentUser) {
          if (offset && offset > 0) {
            // Подгружены старые сообщения
            prependMessages(currentUser.id, activeUserId, history);
          } else {
            // Первичная загрузка
            setMessages(currentUser.id, activeUserId, history);
          }
        }
      }
    );

    const unsubDelivered = on(
      "message_delivered",
      ({ messageId }: { messageId: string }) => {
        updateMessageStatus(messageId, "delivered");
      }
    );

    const unsubRead = on(
      "message_read",
      ({ messageId, readAt }: { messageId: string; readAt: string }) => {
        updateMessageStatus(messageId, "read", readAt);
      }
    );

    const unsubTyping = on(
      "typing",
      ({ userId, isTyping }: { userId: string; isTyping: boolean }) => {
        if (activeUserId && currentUser) {
          const convId = getConversationId(currentUser.id, activeUserId);
          if (isTyping) {
            addTypingUser(convId, userId);
          } else {
            removeTypingUser(convId, userId);
          }
        }
      }
    );

    const unsubUserOnline = on(
      "user_online",
      ({ userId }: { userId: string }) => {
        updateUserStatus(userId, true);
      }
    );

    const unsubUserOffline = on(
      "user_offline",
      ({ userId, lastSeen }: { userId: string; lastSeen: number }) => {
        updateUserStatus(userId, false, lastSeen);
      }
    );

    return () => {
      unsubSent();
      unsubNew();
      unsubHistory();
      unsubDelivered();
      unsubRead();
      unsubTyping();
      unsubUserOnline();
      unsubUserOffline();
    };
  }, [
    on,
    addMessage,
    updateMessageStatus,
    setMessages,
    prependMessages,
    addTypingUser,
    removeTypingUser,
    updateUserStatus,
    activeUserId,
    currentUser,
    markAsRead,
  ]);

  // Load message history when active user changes
  useEffect(() => {
    if (activeUserId && currentUser) {
      getHistory(activeUserId);
      const convId = getConversationId(currentUser.id, activeUserId);
      setTypingUsers(convId, []);
    }
  }, [activeUserId, getHistory, currentUser, setTypingUsers]);

  const handleInputChange = (value: string) => {
    setInput(value);

    if (activeUserId && currentUser) {
      const convId = getConversationId(currentUser.id, activeUserId);
      startTyping(convId);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        stopTyping(convId);
      }, 3000);
    }
  };

  const handleSend = () => {
    if (!input.trim() || !activeUserId || !currentUser) return;

    const convId = getConversationId(currentUser.id, activeUserId);
    stopTyping(convId);

    sendMessage(activeUserId, input);
    setInput("");
  };

  const handleSendImage = useCallback(
    (imageBase64: string) => {
      if (!activeUserId || !currentUser) return;

      const newMessage: Message = {
        id: crypto.randomUUID(),
        senderId: currentUser.id,
        receiverId: activeUserId,
        content: "Изображение",
        type: "image",
        attachmentUrl: imageBase64,
        status: "sent",
        isRead: false,
        createdAt: new Date().toISOString(),
      };

      addMessage(newMessage);
    },
    [activeUserId, currentUser, addMessage]
  );

  const handleSendVoice = useCallback(
    (voiceBlob: Blob, duration: number) => {
      if (!activeUserId || !currentUser) return;

      const audioUrl = URL.createObjectURL(voiceBlob);
      
      const newMessage: Message = {
        id: crypto.randomUUID(),
        senderId: currentUser.id,
        receiverId: activeUserId,
        content: "Голосовое сообщение",
        type: "voice",
        attachmentUrl: audioUrl,
        voiceDuration: duration,
        status: "sent",
        isRead: false,
        createdAt: new Date().toISOString(),
      };

      addMessage(newMessage);
    },
    [activeUserId, currentUser, addMessage]
  );

  const handleMarkAsRead = useCallback(
    (messageId: string) => {
      markAsRead(messageId);
    },
    [markAsRead]
  );

  const loadMoreMessages = useCallback(() => {
    if (!activeUserId || !currentUser || isLoadingMore) return;
    setIsLoadingMore(true);
    const convId = getConversationId(currentUser.id, activeUserId);
    const offset = messagesOffset[convId] || 0;
    getHistory(activeUserId, 50, offset);
    // Сбросим флаг через небольшую задержку (имитация ответа сервера)
    setTimeout(() => setIsLoadingMore(false), 500);
  }, [activeUserId, currentUser, getHistory, messagesOffset, isLoadingMore]);

  const activeConvHasMore = useMemo(() => {
    if (!activeUserId || !currentUser) return false;
    const convId = getConversationId(currentUser.id, activeUserId);
    return hasMoreMessages[convId] || false;
  }, [activeUserId, currentUser, hasMoreMessages]);

  const handleAddReaction = useCallback(
    (messageId: string, emoji: string) => {
      if (currentUser) {
        addReaction(messageId, emoji, currentUser.id);
      }
    },
    [addReaction, currentUser]
  );

  const handleRemoveReaction = useCallback(
    (messageId: string) => {
      if (currentUser) {
        removeReaction(messageId, currentUser.id);
      }
    },
    [removeReaction, currentUser]
  );

  const activeUser = users.find((u) => u.id === activeUserId);

  return {
    // State
    input,
    searchQuery,
    isLoading,
    users,
    currentUser,
    activeUser,
    activeUserId,
    currentMessages,
    isSomeoneTyping,
    unreadCounts,
    isDark: document.documentElement.classList.contains("dark"),
    hasMoreMessages: activeConvHasMore,
    isLoadingMore,

    // Actions
    setSearchQuery,
    setActiveUser,
    handleInputChange,
    handleSend,
    handleSendImage,
    handleSendVoice,
    handleMarkAsRead,
    handleAddReaction,
    handleRemoveReaction,
    loadMoreMessages,
  };
}
