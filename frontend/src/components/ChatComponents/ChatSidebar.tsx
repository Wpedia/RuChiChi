import { Search } from "lucide-react";
import type { User } from "../../store/chatStore";

interface ChatSidebarProps {
  users: User[];
  activeUserId: string | null;
  searchQuery: string;
  unreadCounts: Record<string, number>;
  onSearchChange: (query: string) => void;
  onUserSelect: (userId: string) => void;
}

export function ChatSidebar({
  users,
  activeUserId,
  searchQuery,
  unreadCounts,
  onSearchChange,
  onUserSelect,
}: ChatSidebarProps) {
  const filteredUsers = users.filter((u) =>
    (u.firstName || u.phoneOrLogin)
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="p-5 border-b border-gray-200 dark:border-gray-800 shrink-0">
        <div className="relative flex items-center justify-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Сообщения
          </h2>
        </div>
        <div className="relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
            size={18}
          />
          <input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200 text-sm placeholder:text-gray-400 dark:text-gray-200 dark:placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {filteredUsers.length === 0 && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              Пользователей не найдено
            </p>
          </div>
        )}

        {filteredUsers.map((user) => (
          <div
            key={user.id}
            onClick={() => onUserSelect(user.id)}
            className={`flex items-center gap-3 p-3 mx-2 rounded-2xl cursor-pointer transition-all duration-200 ${
              user.id === activeUserId
                ? "bg-indigo-50 dark:bg-indigo-500/10 shadow-sm"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <div className="relative shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                {(user.firstName || user.phoneOrLogin).charAt(0).toUpperCase()}
              </div>
              {user.isOnline && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4
                className={`font-semibold truncate ${
                  user.id === activeUserId
                    ? "text-indigo-900 dark:text-indigo-100"
                    : "text-gray-900 dark:text-gray-100"
                }`}
              >
                {user.firstName || user.phoneOrLogin}
              </h4>
            </div>
            {unreadCounts[user.id] > 0 && (
              <span className="bg-indigo-600 text-white text-xs font-bold rounded-full min-w-[22px] h-5.5 flex items-center justify-center px-1.5 shadow-sm">
                {unreadCounts[user.id] > 99
                  ? "99+"
                  : unreadCounts[user.id]}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
