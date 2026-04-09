import { useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { useChat } from "../components/ChatComponents/useChat";
import { ChatHeader } from "../components/ChatComponents/ChatHeader";
import { ChatInput } from "../components/ChatComponents/ChatInput";
import { ChatMessages } from "../components/ChatComponents/ChatMessages";
import { ChatSidebar } from "../components/ChatComponents/ChatSidebar";
import { EmptyChat } from "../components/ChatComponents/EmptyChat";
import { ErrorBoundary } from "../components/shared/ErrorBoundary";

export default function Chat() {
  const [highlightMessageId, setHighlightMessageId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const {
    input,
    searchQuery: sidebarSearchQuery,
    isLoading,
    users,
    currentUser,
    activeUser,
    activeUserId,
    currentMessages,
    isSomeoneTyping,
    unreadCounts,
    isDark,
    hasMoreMessages,
    isLoadingMore,
    setSearchQuery: setSidebarSearchQuery,
    setActiveUser,
    handleInputChange,
    handleSend,
    handleSendImage,
    handleSendVoice,
    handleMarkAsRead,
    handleAddReaction,
    handleRemoveReaction,
    loadMoreMessages,
  } = useChat();

  const handleJumpToMessage = useCallback((messageId: string) => {
    setHighlightMessageId(messageId);
    // Reset after animation
    setTimeout(() => setHighlightMessageId(null), 3000);
  }, []);

  const handleSearchQueryChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-950">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-gray-50 dark:bg-gray-950">
      <ChatSidebar
        users={users}
        activeUserId={activeUserId}
        searchQuery={sidebarSearchQuery}
        unreadCounts={unreadCounts}
        onSearchChange={setSidebarSearchQuery}
        onUserSelect={setActiveUser}
      />

      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 min-w-0">
        {activeUser ? (
          <>
            <ErrorBoundary>
              <ChatHeader 
                user={activeUser} 
                isSomeoneTyping={isSomeoneTyping}
                messages={currentMessages}
                onJumpToMessage={handleJumpToMessage}
              />
            </ErrorBoundary>
            
            <ErrorBoundary>
              <ChatMessages
                messages={currentMessages}
                currentUserId={currentUser?.id}
                activeUser={activeUser}
                isSomeoneTyping={isSomeoneTyping}
                isDark={isDark}
                onMarkAsRead={handleMarkAsRead}
                onAddReaction={handleAddReaction}
                onRemoveReaction={handleRemoveReaction}
                highlightMessageId={highlightMessageId || undefined}
                searchQuery={searchQuery}
                onLoadMore={loadMoreMessages}
                hasMore={hasMoreMessages}
                isLoadingMore={isLoadingMore}
              />
            </ErrorBoundary>
            
            <ErrorBoundary>
              <ChatInput
                value={input}
                onChange={handleInputChange}
                onSubmit={handleSend}
                onSendImage={handleSendImage}
                onSendVoice={handleSendVoice}
              />
            </ErrorBoundary>
          </>
        ) : (
          <EmptyChat />
        )}
      </div>
    </div>
  );
}
