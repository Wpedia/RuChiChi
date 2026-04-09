import { MessageCircle } from "lucide-react";

export function EmptyChat() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-950">
      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
        <MessageCircle size={48} className="text-gray-300 dark:text-gray-600" />
      </div>
      <p className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">
        Выберите чат
      </p>
      <p className="text-sm">Начните общение с другими пользователями</p>
    </div>
  );
}
