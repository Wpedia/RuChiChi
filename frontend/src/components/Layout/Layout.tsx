import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
    MessageCircle, 
    User, 
    Trophy, 
    Video, 
    Home,
    Search,
    Bell,
    Settings,
    LogOut
  } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
  



const navItems = [
    { path: '/', icon: Home, label: 'Главная' },
    { path: '/chat', icon: MessageCircle, label: 'Чаты' },
    { path: '/streams', icon: Video, label: 'Стримы' },
    { path: '/leaderboard', icon: Trophy, label: 'Рейтинг' },
    { path: '/profile', icon: User, label: 'Профиль' },
  ];

export default function Layout() {
    const location = useLocation()
    const { user, isAuthenticated, logout } = useAuthStore();  
    const isActive = (path: string) => location.pathname === path;
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col fixed h-full z-10">
        {/* Logo */}
        <div className="p-4 border-b">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-red-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
              R
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
              RusChi
            </span>
          </Link>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Поиск..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive(path) 
                  ? 'bg-blue-50 text-blue-600 font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t space-y-3">
          {/* Notifications */}
          <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
            <div className="relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
            <span>Уведомления</span>
          </button>

          {/* Settings */}
          <button className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
            <Settings size={20} />
            <span>Настройки</span>
          </button>

          {/* User / Auth */}
          {isAuthenticated ? (
            <div className="pt-2 border-t">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User size={16} className="text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">@{user?.username}</p>
                </div>
                <button 
                  onClick={logout}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          ) : (
            <Link 
              to="/login"
              className="flex items-center justify-center gap-2 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <User size={18} />
              <span>Войти</span>
            </Link>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <Outlet />
      </main>
    </div>
  )
}
