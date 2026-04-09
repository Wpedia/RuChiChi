// Основные компоненты чата
export { ChatHeader } from "./ChatHeader";
export { ChatInput } from "./ChatInput";
export { ChatMessages } from "./ChatMessages";
export { ChatSidebar } from "./ChatSidebar";
export { EmptyChat } from "./EmptyChat";
export { MessageSearch } from "./MessageSearch";

// Хуки и утилиты
export { useChat } from "./useChat";
export * from "./utils";

// Реэкспорты из новой структуры для удобства
export { Message, MessageReactions } from "../Chat";
