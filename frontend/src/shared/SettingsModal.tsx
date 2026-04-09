import { useEffect, useState } from "react";
import { 
  X, 
  Moon, 
  Sun, 
  Bell, 
  Globe, 
  Shield, 
  User, 
  ChevronRight,
  Smartphone,
  Mail,
  LogOut,
  Trash2,
  Palette,
  Volume2,
  Vibrate,
  Lock,
  Eye,
  EyeOff,
  Database,
  Wifi,
  Battery,
  Circle,
  Check,
  ChevronLeft,
  Camera,
  Image as ImageIcon,
  FileText,
  HelpCircle,
  Star,
  MessageCircle,
  Users,
  Zap,
  Clock,
  MapPin,
  CreditCard,
  Gift,
  Crown
} from "lucide-react";
import { useThemeStore } from "../store/themeStore";
import { useAuthStore } from "../store/authStore";

type SettingsView = "main" | "notifications" | "privacy" | "appearance" | "data" | "language" | "devices" | "help";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: Props) {
  const { isDark, toggleTheme } = useThemeStore();
  const { logout, user } = useAuthStore();
  const [currentView, setCurrentView] = useState<SettingsView>("main");
  
  // Настройки с сохранением в localStorage (в будущем — на бэкенд)
  const [settings, setSettings] = useState(() => ({
    // Уведомления
    pushEnabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
    previewEnabled: true,
    mentionsEnabled: true,
    reactionsEnabled: true,
    storyNotifications: true,
    messageNotifications: true,
    emailDigest: "weekly", // "daily" | "weekly" | "never"
    
    // Приватность
    lastSeen: "everyone", // "everyone" | "contacts" | "nobody"
    profilePhoto: "everyone",
    onlineStatus: true,
    readReceipts: true,
    storyPrivacy: "contacts",
    callsAllowed: "everyone",
    forwardedFrom: true,
    
    // Внешний вид
    theme: isDark ? "dark" : "light",
    accentColor: "indigo", // "indigo" | "rose" | "emerald" | "amber" | "cyan"
    fontSize: "medium", // "small" | "medium" | "large"
    animationsReduced: false,
    chatBackground: "default",
    
    // Данные
    autoDownload: {
      photos: "wifi",
      videos: "wifi", 
      files: "never",
      audio: "wifi"
    },
    storageUsage: {
      used: 2.4, // GB
      total: 5,
      cache: 0.3
    },
    dataSaver: false,
    proxyEnabled: false,
    
    // Язык
    language: "ru",
    languages: [
      { code: "ru", name: "Русский", flag: "🇷🇺" },
      { code: "zh", name: "中文", flag: "🇨🇳" },
      { code: "en", name: "English", flag: "🇬🇧" },
      { code: "de", name: "Deutsch", flag: "🇩🇪" },
      { code: "es", name: "Español", flag: "🇪🇸" },
    ]
  }));

  // Сброс view при закрытии
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setCurrentView("main"), 300);
    }
  }, [isOpen]);

  // Закрытие по ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (currentView !== "main") {
          setCurrentView("main");
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, currentView]);

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    // TODO: Сохранить на бэкенд
  };

  const toggleSetting = (key: string) => {
    updateSetting(key, !settings[key as keyof typeof settings]);
  };

  if (!isOpen) return null;

  // Цвета акцента
  const accentColors = [
    { id: "indigo", color: "from-indigo-500 to-purple-600", hex: "#6366f1" },
    { id: "rose", color: "from-rose-500 to-pink-600", hex: "#f43f5e" },
    { id: "emerald", color: "from-emerald-500 to-teal-600", hex: "#10b981" },
    { id: "amber", color: "from-amber-500 to-orange-600", hex: "#f59e0b" },
    { id: "cyan", color: "from-cyan-500 to-blue-600", hex: "#06b6d4" },
  ];

  // Главное меню настроек
  const mainMenuItems = [
    {
      icon: Bell,
      label: "Уведомления и звуки",
      value: settings.pushEnabled ? "Включены" : "Выключены",
      onClick: () => setCurrentView("notifications"),
      badge: settings.messageNotifications ? undefined : "!"
    },
    {
      icon: Shield,
      label: "Конфиденциальность",
      value: settings.lastSeen === "nobody" ? "Ограничено" : "Стандартно",
      onClick: () => setCurrentView("privacy"),
    },
    {
      icon: Palette,
      label: "Оформление",
      value: isDark ? "Тёмная тема" : "Светлая тема",
      onClick: () => setCurrentView("appearance"),
    },
    {
      icon: Database,
      label: "Данные и память",
      value: `${settings.storageUsage.used.toFixed(1)} ГБ использовано`,
      onClick: () => setCurrentView("data"),
    },
    {
      icon: Globe,
      label: "Язык",
      value: settings.languages.find(l => l.code === settings.language)?.name,
      onClick: () => setCurrentView("language"),
    },
    {
      icon: Smartphone,
      label: "Устройства",
      value: "3 активных",
      onClick: () => setCurrentView("devices"),
    },
    {
      icon: HelpCircle,
      label: "Помощь",
      value: "FAQ и поддержка",
      onClick: () => setCurrentView("help"),
    },
  ];

  // Рендер подменю уведомлений
  const renderNotifications = () => (
    <div className="space-y-6">
      {/* Приватность уведомлений */}
      <div className="bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl">
            <Eye size={20} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">Предпросмотр сообщений</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Показывать текст сообщений в уведомлениях
            </p>
          </div>
          <button
            onClick={() => toggleSetting("previewEnabled")}
            className={`ml-auto w-12 h-7 rounded-full transition-colors relative ${
              settings.previewEnabled ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"
            }`}
          >
            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${
              settings.previewEnabled ? "translate-x-6" : "translate-x-1"
            }`} />
          </button>
        </div>
      </div>

      {/* Основные уведомления */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
          Сообщения
        </h3>
        <div className="space-y-1 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-2">
          {[
            { key: "messageNotifications", label: "Уведомления о сообщениях", icon: MessageCircle },
            { key: "mentionsEnabled", label: "Упоминания и ответы", icon: Zap },
            { key: "reactionsEnabled", label: "Реакции на сообщения", icon: Star },
            { key: "storyNotifications", label: "Истории", icon: ImageIcon },
          ].map(({ key, label, icon: Icon }) => (
            <div key={key} className="flex items-center gap-3 p-3 rounded-xl">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <Icon size={18} className="text-gray-600 dark:text-gray-400" />
              </div>
              <span className="flex-1 font-medium text-gray-900 dark:text-white">{label}</span>
              <button
                onClick={() => toggleSetting(key)}
                className={`w-11 h-6 rounded-full transition-colors relative ${
                  settings[key as keyof typeof settings] ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  settings[key as keyof typeof settings] ? "translate-x-5" : "translate-x-0.5"
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Звуки и вибрация */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
          Звуки и вибрация
        </h3>
        <div className="space-y-1 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-2">
          <div className="flex items-center gap-3 p-3 rounded-xl">
            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <Volume2 size={18} className="text-gray-600 dark:text-gray-400" />
            </div>
            <span className="flex-1 font-medium text-gray-900 dark:text-white">Звуки</span>
            <button
              onClick={() => toggleSetting("soundEnabled")}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                settings.soundEnabled ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                settings.soundEnabled ? "translate-x-5" : "translate-x-0.5"
              }`} />
            </button>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl">
            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <Vibrate size={18} className="text-gray-600 dark:text-gray-400" />
            </div>
            <span className="flex-1 font-medium text-gray-900 dark:text-white">Вибрация</span>
            <button
              onClick={() => toggleSetting("vibrationEnabled")}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                settings.vibrationEnabled ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                settings.vibrationEnabled ? "translate-x-5" : "translate-x-0.5"
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Email-рассылка */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
          Email-рассылка
        </h3>
        <div className="space-y-1 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-2">
          {[
            { value: "daily", label: "Каждый день" },
            { value: "weekly", label: "Раз в неделю" },
            { value: "never", label: "Никогда" },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => updateSetting("emailDigest", value)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-colors"
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                settings.emailDigest === value 
                  ? "border-indigo-600 bg-indigo-600" 
                  : "border-gray-300 dark:border-gray-600"
              }`}>
                {settings.emailDigest === value && <Check size={12} className="text-white" />}
              </div>
              <span className="flex-1 text-left font-medium text-gray-900 dark:text-white">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Рендер приватности
  const renderPrivacy = () => (
    <div className="space-y-6">
      {/* Статус онлайн */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
          Статус онлайн
        </h3>
        <div className="space-y-1 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-2">
          {[
            { value: "everyone", label: "Все", desc: "Все пользователи видят, когда вы онлайн" },
            { value: "contacts", label: "Только контакты", desc: "Только из вашего списка контактов" },
            { value: "nobody", label: "Никто", desc: "Статус онлайн скрыт от всех" },
          ].map(({ value, label, desc }) => (
            <button
              key={value}
              onClick={() => updateSetting("lastSeen", value)}
              className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-colors text-left"
            >
              <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                settings.lastSeen === value 
                  ? "border-indigo-600 bg-indigo-600" 
                  : "border-gray-300 dark:border-gray-600"
              }`}>
                {settings.lastSeen === value && <Check size={12} className="text-white" />}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">{label}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Фото профиля */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
          Фото профиля
        </h3>
        <div className="space-y-1 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-2">
          {[
            { value: "everyone", label: "Все" },
            { value: "contacts", label: "Только контакты" },
            { value: "nobody", label: "Никто" },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => updateSetting("profilePhoto", value)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white dark:hover:bg-gray-800 transition-colors"
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                settings.profilePhoto === value 
                  ? "border-indigo-600 bg-indigo-600" 
                  : "border-gray-300 dark:border-gray-600"
              }`}>
                {settings.profilePhoto === value && <Check size={12} className="text-white" />}
              </div>
              <span className="flex-1 text-left font-medium text-gray-900 dark:text-white">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Дополнительно */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
          Дополнительно
        </h3>
        <div className="space-y-1 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-2">
          <div className="flex items-center gap-3 p-3 rounded-xl">
            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <Check size={18} className="text-gray-600 dark:text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">Статус прочтения</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Показывать двойные галочки</p>
            </div>
            <button
              onClick={() => toggleSetting("readReceipts")}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                settings.readReceipts ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                settings.readReceipts ? "translate-x-5" : "translate-x-0.5"
              }`} />
            </button>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl">
            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <Users size={18} className="text-gray-600 dark:text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">Пересылка сообщений</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Показывать ссылку на профиль</p>
            </div>
            <button
              onClick={() => toggleSetting("forwardedFrom")}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                settings.forwardedFrom ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"
              }`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                settings.forwardedFrom ? "translate-x-5" : "translate-x-0.5"
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Блокировка */}
      <div className="bg-rose-50 dark:bg-rose-500/10 rounded-2xl p-4">
        <h4 className="font-semibold text-rose-900 dark:text-rose-100 mb-2">Заблокированные</h4>
        <p className="text-sm text-rose-700 dark:text-rose-300 mb-3">
          2 пользователя заблокированы
        </p>
        <button className="text-sm font-medium text-rose-600 dark:text-rose-400 hover:underline">
          Показать список
        </button>
      </div>
    </div>
  );

  // Рендер внешнего вида
  const renderAppearance = () => (
    <div className="space-y-6">
      {/* Тема */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
          Тема
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => { updateSetting("theme", "light"); if (isDark) toggleTheme(); }}
            className={`p-4 rounded-2xl border-2 transition-all ${
              !isDark 
                ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10" 
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="w-12 h-12 mx-auto mb-3 bg-white rounded-xl shadow-lg flex items-center justify-center">
              <Sun size={24} className="text-amber-500" />
            </div>
            <p className="font-medium text-gray-900 dark:text-white">Светлая</p>
          </button>
          <button
            onClick={() => { updateSetting("theme", "dark"); if (!isDark) toggleTheme(); }}
            className={`p-4 rounded-2xl border-2 transition-all ${
              isDark 
                ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10" 
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-900 rounded-xl shadow-lg flex items-center justify-center">
              <Moon size={24} className="text-indigo-400" />
            </div>
            <p className="font-medium text-gray-900 dark:text-white">Тёмная</p>
          </button>
        </div>
      </div>

      {/* Цвет акцента */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
          Цвет акцента
        </h3>
        <div className="flex gap-3 flex-wrap">
          {accentColors.map(({ id, color, hex }) => (
            <button
              key={id}
              onClick={() => updateSetting("accentColor", id)}
              className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} shadow-lg transition-transform hover:scale-110 ${
                settings.accentColor === id ? "ring-4 ring-offset-2 ring-indigo-500" : ""
              }`}
            >
              {settings.accentColor === id && <Check size={20} className="mx-auto text-white" />}
            </button>
          ))}
        </div>
      </div>

      {/* Размер шрифта */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
          Размер текста
        </h3>
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
          {[
            { value: "small", label: "Мелкий", size: "text-sm" },
            { value: "medium", label: "Средний", size: "text-base" },
            { value: "large", label: "Крупный", size: "text-lg" },
          ].map(({ value, label, size }) => (
            <button
              key={value}
              onClick={() => updateSetting("fontSize", value)}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                settings.fontSize === value
                  ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              <span className={size}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Анимации */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <Zap size={18} className="text-gray-600 dark:text-gray-400" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900 dark:text-white">Уменьшить анимации</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Для экономии заряда батареи</p>
        </div>
        <button
          onClick={() => toggleSetting("animationsReduced")}
          className={`w-11 h-6 rounded-full transition-colors relative ${
            settings.animationsReduced ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"
          }`}
        >
          <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
            settings.animationsReduced ? "translate-x-5" : "translate-x-0.5"
          }`} />
        </button>
      </div>
    </div>
  );

  // Рендер данных и памяти
  const renderData = () => (
    <div className="space-y-6">
      {/* Использование памяти */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900 dark:text-white">Использование памяти</h4>
          <span className="text-2xl font-bold text-indigo-600">
            {settings.storageUsage.used.toFixed(1)} <span className="text-sm text-gray-500">/ {settings.storageUsage.total} ГБ</span>
          </span>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
            style={{ width: `${(settings.storageUsage.used / settings.storageUsage.total) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Кэш: {settings.storageUsage.cache} ГБ</span>
          <button className="text-indigo-600 hover:underline">Очистить</button>
        </div>
      </div>

      {/* Автозагрузка */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
          Автозагрузка медиа
        </h3>
        <div className="space-y-3">
          {[
            { key: "photos", label: "Фото", icon: ImageIcon },
            { key: "videos", label: "Видео", icon: Video },
            { key: "files", label: "Файлы", icon: FileText },
            { key: "audio", label: "Голосовые сообщения", icon: Volume2 },
          ].map(({ key, label, icon: Icon }) => (
            <div key={key} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <Icon size={18} className="text-gray-600 dark:text-gray-400" />
              </div>
              <span className="flex-1 font-medium text-gray-900 dark:text-white">{label}</span>
              <select 
                value={settings.autoDownload[key as keyof typeof settings.autoDownload]}
                onChange={(e) => updateSetting("autoDownload", {
                  ...settings.autoDownload,
                  [key]: e.target.value
                })}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm"
              >
                <option value="always">Всегда</option>
                <option value="wifi">Только Wi-Fi</option>
                <option value="never">Никогда</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Экономия трафика */}
      <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-500/10 rounded-2xl">
        <div className="p-2 bg-amber-100 dark:bg-amber-500/20 rounded-xl">
          <Wifi size={20} className="text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-amber-900 dark:text-amber-100">Экономия трафика</p>
          <p className="text-sm text-amber-700 dark:text-amber-300">Сжимать изображения и видео</p>
        </div>
        <button
          onClick={() => toggleSetting("dataSaver")}
          className={`w-11 h-6 rounded-full transition-colors relative ${
            settings.dataSaver ? "bg-amber-500" : "bg-gray-300 dark:bg-gray-600"
          }`}
        >
          <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
            settings.dataSaver ? "translate-x-5" : "translate-x-0.5"
          }`} />
        </button>
      </div>

      {/* Прокси */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <Shield size={18} className="text-gray-600 dark:text-gray-400" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900 dark:text-white">Прокси</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Подключение через прокси-сервер</p>
        </div>
        <button
          onClick={() => toggleSetting("proxyEnabled")}
          className={`w-11 h-6 rounded-full transition-colors relative ${
            settings.proxyEnabled ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"
          }`}
        >
          <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
            settings.proxyEnabled ? "translate-x-5" : "translate-x-0.5"
          }`} />
        </button>
      </div>
    </div>
  );

  // Рендер языка
  const renderLanguage = () => (
    <div className="space-y-2">
      {settings.languages.map(({ code, name, flag }) => (
        <button
          key={code}
          onClick={() => updateSetting("language", code)}
          className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
            settings.language === code
              ? "bg-indigo-50 dark:bg-indigo-500/10 border-2 border-indigo-200 dark:border-indigo-500/30"
              : "hover:bg-gray-50 dark:hover:bg-gray-800 border-2 border-transparent"
          }`}
        >
          <span className="text-3xl">{flag}</span>
          <div className="flex-1 text-left">
            <p className={`font-semibold ${
              settings.language === code 
                ? "text-indigo-900 dark:text-indigo-100" 
                : "text-gray-900 dark:text-white"
            }`}>
              {name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{code.toUpperCase()}</p>
          </div>
          {settings.language === code && (
            <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
              <Check size={14} className="text-white" />
            </div>
          )}
        </button>
      ))}
      
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Хотите помочь с переводом? 
          <a href="#" className="text-indigo-600 hover:underline ml-1">Присоединяйтесь</a>
        </p>
      </div>
    </div>
  );

  // Рендер устройств
  const renderDevices = () => (
    <div className="space-y-4">
      <div className="bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl p-4">
        <p className="text-sm text-indigo-700 dark:text-indigo-300">
          Вы вошли в аккаунт на 3 устройствах. 
          <button className="font-semibold underline ml-1">Завершить все сеансы</button>
        </p>
      </div>

      {[
        { name: "iPhone 15 Pro", location: "Москва, Россия", active: true, current: true, time: "Сейчас" },
        { name: "MacBook Air", location: "Москва, Россия", active: true, current: false, time: "2 часа назад" },
        { name: "Chrome на Windows", location: "Санкт-Петербург, Россия", active: false, current: false, time: "3 дня назад" },
      ].map((device, i) => (
        <div 
          key={i} 
          className={`flex items-center gap-4 p-4 rounded-2xl border-2 ${
            device.current 
              ? "border-indigo-200 dark:border-indigo-500/30 bg-indigo-50 dark:bg-indigo-500/10" 
              : "border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700"
          }`}
        >
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            device.active ? "bg-emerald-100 dark:bg-emerald-500/20" : "bg-gray-100 dark:bg-gray-800"
          }`}>
            <Smartphone size={24} className={device.active ? "text-emerald-600" : "text-gray-400"} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-900 dark:text-white">{device.name}</p>
              {device.current && (
                <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs rounded-full">
                  Это устройство
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{device.location} • {device.time}</p>
          </div>
          {!device.current && (
            <button className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors">
              <X size={20} />
            </button>
          )}
        </div>
      ))}
    </div>
  );

  // Рендер помощи
  const renderHelp = () => (
    <div className="space-y-4">
      {[
        { icon: HelpCircle, label: "FAQ", desc: "Часто задаваемые вопросы" },
        { icon: MessageCircle, label: "Поддержка", desc: "Написать в службу поддержки" },
        { icon: FileText, label: "Условия использования", desc: "Пользовательское соглашение" },
        { icon: Shield, label: "Политика конфиденциальности", desc: "Как мы обрабатываем данные" },
      ].map(({ icon: Icon, label, desc }) => (
        <button
          key={label}
          className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
        >
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <Icon size={24} className="text-gray-600 dark:text-gray-400" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </button>
      ))}

      <div className="mt-6 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-2xl text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
          <Crown size={32} className="text-white" />
        </div>
        <h4 className="font-bold text-gray-900 dark:text-white mb-2">RusChi Premium</h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Расширенные функции, больше облачного хранилища и уникальные стикеры
        </p>
        <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25">
          Подробнее
        </button>
      </div>
    </div>
  );

  // Заголовки для подменю
  const viewTitles: Record<SettingsView, string> = {
    main: "Настройки",
    notifications: "Уведомления и звуки",
    privacy: "Конфиденциальность",
    appearance: "Оформление",
    data: "Данные и память",
    language: "Язык",
    devices: "Устройства",
    help: "Помощь",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md max-h-[90vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center gap-3 p-5 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
          {currentView !== "main" && (
            <button
              onClick={() => setCurrentView("main")}
              className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-500" />
            </button>
          )}
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex-1">
            {viewTitles[currentView]}
          </h2>
          {currentView === "main" && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
          {currentView === "main" && (
            <>
              {/* User Card */}
              <div className="p-5">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-2xl">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {user?.firstName?.charAt(0) || user?.phoneOrLogin?.charAt(0) || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                      {user?.firstName || user?.phoneOrLogin}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user?.phoneOrLogin}
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-medium rounded-full">
                    Pro
                  </div>
                </div>
              </div>

              {/* Main Menu */}
              <div className="px-5 pb-5 space-y-1">
                {mainMenuItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                  >
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-xl">
                      <item.icon size={20} className="text-gray-600 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                        {item.badge && (
                          <span className="w-5 h-5 bg-rose-500 text-white text-xs rounded-full flex items-center justify-center">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.value && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.value}</p>
                      )}
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </button>
                ))}
              </div>
            </>
          )}

          {currentView === "notifications" && renderNotifications()}
          {currentView === "privacy" && renderPrivacy()}
          {currentView === "appearance" && renderAppearance()}
          {currentView === "data" && renderData()}
          {currentView === "language" && renderLanguage()}
          {currentView === "devices" && renderDevices()}
          {currentView === "help" && renderHelp()}

          {/* Footer */}
          {currentView === "main" && (
            <div className="text-center py-6 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                RusChi v2.0.0 • Build 2024.04.08
              </p>
              <div className="flex justify-center gap-4 text-xs text-gray-400">
                <a href="#" className="hover:text-indigo-600">О приложении</a>
                <span>•</span>
                <a href="#" className="hover:text-indigo-600">Лицензии</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}