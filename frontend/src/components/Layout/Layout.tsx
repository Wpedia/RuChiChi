import { Link, Outlet, useLocation } from "react-router-dom";
import {
  MessageCircle,
  User,
  Trophy,
  Video,
  Home,
  Search,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";
import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { SettingsModal } from "../../shared/SettingsModal";

const navItems = [
  { path: "/profile", icon: User, label: "Профиль" },
  { path: "/chat", icon: MessageCircle, label: "Чаты" },
  { path: "/", icon: Home, label: "Главная" },
  { path: "/streams", icon: Video, label: "Стримы" },
  { path: "/leaderboard", icon: Trophy, label: "Рейтинг" },
];

export default function Layout() {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const isActive = (path: string) => location.pathname === path;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Применяем тему к html элементу
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  // Закрытие при клике вне сайдбара
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const sidebar = document.getElementById("sidebar");
      const toggleBtn = document.getElementById("sidebar-toggle");
      if (
        isExpanded &&
        sidebar &&
        !sidebar.contains(e.target as Node) &&
        !toggleBtn?.contains(e.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [isExpanded]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex overflow-x-hidden transition-colors duration-300">
      {/* Overlay */}
      {isExpanded && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-20 transition-opacity duration-300" />
      )}

      {/* Toggle Button */}
      {!isExpanded && (
        <button
          id="sidebar-toggle"
          onClick={() => setIsExpanded(true)}
          className="fixed left-4 top-4 z-30 p-3 bg-white dark:bg-gray-900 rounded-xl shadow-lg shadow-gray-200/50 dark:shadow-black/50 hover:shadow-xl hover:scale-105 transition-all duration-200 group"
        >
          <Menu
            size={22}
            className="text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
          />
        </button>
      )}

    

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`fixed h-full z-40 bg-white dark:bg-gray-900 shadow-2xl shadow-gray-200/50 dark:shadow-black/50 transition-all duration-300 ease-out flex flex-col ${
          isExpanded ? "translate-x-0" : "-translate-x-full"
        } w-80`}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
          <Link
            to="/"
            className="flex items-center gap-3 group"
            onClick={() => setIsExpanded(false)}
          >
            <div className="w-11 h-11 bg-gradient-to-br from-indigo-600 via-purple-600 to-rose-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/25">
              R
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-500 bg-clip-text text-transparent">
              RusChi
            </span>
          </Link>

          <button
            onClick={() => setIsExpanded(false)}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Search */}
        <div className="p-5">
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Поиск..."
              className="w-full pl-11 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white dark:focus:bg-gray-700 transition-all duration-200 text-sm placeholder:text-gray-400 dark:text-gray-200 dark:placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map(({ path, icon: Icon, label }) => {
            const active = isActive(path);
            return (
              <Link
                key={path}
                to={path}
                onClick={() => setIsExpanded(false)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  active
                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg transition-colors ${
                    active
                      ? "bg-white dark:bg-gray-800 shadow-sm"
                      : "group-hover:bg-white dark:group-hover:bg-gray-800 group-hover:shadow-sm"
                  }`}
                >
                  <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                </div>
                <span className="text-[15px]">{label}</span>
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 space-y-2 border-t border-gray-100 dark:border-gray-800">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3.5 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 rounded-xl transition-all duration-200"
          >
            <div className="p-1.5 rounded-lg">
              {isDark ? (
                <Sun size={20} className="text-amber-500" />
              ) : (
                <Moon size={20} />
              )}
            </div>
            <span className="text-[15px]">
              {isDark ? "Светлая тема" : "Тёмная тема"}
            </span>
          </button>

          {/* Notifications */}
          <button className="w-full flex items-center gap-3.5 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 rounded-xl transition-all duration-200 group">
            <div className="relative p-1.5 rounded-lg group-hover:bg-white dark:group-hover:bg-gray-800 group-hover:shadow-sm transition-all">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-gray-900" />
            </div>
            <span className="text-[15px]">Уведомления</span>
          </button>

          {/* Settings - ИСПРАВЛЕНО: одна кнопка с onClick */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="w-full flex items-center gap-3.5 px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 rounded-xl transition-all duration-200 group"
          >
            <div className="p-1.5 rounded-lg group-hover:bg-white dark:group-hover:bg-gray-800 group-hover:shadow-sm transition-all">
              <Settings size={20} />
            </div>
            <span className="text-[15px]">Настройки</span>
          </button>

          <div className="h-px bg-gray-200 dark:bg-gray-800 my-3" />

          {/* User / Auth */}
          {isAuthenticated ? (
            <div className="px-2">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                  {user?.phoneOrLogin?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {user?.phoneOrLogin}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Онлайн
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all duration-200"
                  title="Выйти"
                >
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsExpanded(false)}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <User size={18} strokeWidth={2.5} />
              <span>Войти</span>
            </Link>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: isDark ? "#1f2937" : "#ffffff",
            color: isDark ? "#ffffff" : "#1f2937",
            border: "1px solid #e5e7eb",
          },
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}