import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  MessageCircle, 
  Video, 
  Trophy, 
  Users, 
  TrendingUp,
  ArrowRight,
  Flame,
  Sparkles
} from 'lucide-react';

const LEADERBOARD_DATA = [
  { rank: 1, name: 'Li Wei', username: 'liwei', xp: 15420, streak: 45, language: 'zh', avatar: null },
  { rank: 2, name: 'Anna Petrova', username: 'anna_p', xp: 12350, streak: 32, language: 'ru', avatar: null },
  { rank: 3, name: 'Zhang Ming', username: 'zhangming', xp: 11200, streak: 28, language: 'zh', avatar: null },
  { rank: 4, name: 'Ivan Sidorov', username: 'ivan_s', xp: 9800, streak: 21, language: 'ru', avatar: null },
  { rank: 5, name: 'Wang Fang', username: 'wangfang', xp: 8750, streak: 18, language: 'zh', avatar: null },
];

const FEATURES = [
  {
    icon: MessageCircle,
    title: 'Чаты с переводом',
    description: 'Общайтесь с носителями языка с мгновенным AI-переводом',
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30',
    link: '/chat'
  },
  {
    icon: Video,
    title: 'Обучающие стримы',
    description: 'Смотрите и проводите стримы по изучению языков',
    gradient: 'from-rose-500 to-orange-500',
    bgGradient: 'from-rose-50 to-orange-50 dark:from-rose-950/30 dark:to-orange-950/30',
    link: '/streams'
  },
  {
    icon: Trophy,
    title: 'Таблица лидеров',
    description: 'Соревнуйтесь с другими учениками и получайте награды',
    gradient: 'from-amber-500 to-yellow-500',
    bgGradient: 'from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30',
    link: '/leaderboard'
  },
];

export default function Home() {
  const { isAuthenticated, user } = useAuthStore();

  const isUserInLeaderboard = user && LEADERBOARD_DATA.some(u => u.username === user.username);
  const userRank = isUserInLeaderboard 
    ? LEADERBOARD_DATA.findIndex(u => u.username === user?.username) + 1 
    : null;

  return (
    <div className="space-y-16 max-w-6xl mx-auto pb-12">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-rose-50 dark:from-indigo-950/20 dark:via-purple-950/20 dark:to-rose-950/20 rounded-3xl -z-10" />
        <div className="px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-6 shadow-sm dark:shadow-gray-900/50">
              <Sparkles size={16} />
              <span>Платформа для изучения языков</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
              Мост между{' '}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-500 bg-clip-text text-transparent">
                культурами
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed max-w-2xl">
              Общайтесь, учитесь и развивайтесь вместе с носителями русского и китайского языков. AI-перевод, стримы и соревнования.
            </p>
            
            {!isAuthenticated ? (
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/register" 
                  className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-xl shadow-gray-900/20 dark:shadow-white/10"
                >
                  Начать путь
                  <ArrowRight size={20} />
                </Link>
                <Link 
                  to="/login" 
                  className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all duration-200"
                >
                  Уже есть аккаунт
                </Link>
              </div>
            ) : (
              <div className="inline-flex items-center gap-3 bg-emerald-100/80 dark:bg-emerald-500/10 backdrop-blur-sm text-emerald-800 dark:text-emerald-400 px-6 py-4 rounded-2xl shadow-sm">
                <div className="p-2 bg-emerald-200 dark:bg-emerald-500/20 rounded-xl">
                  <TrendingUp size={20} className="text-emerald-700 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold">С возвращением, {user?.phoneOrLogin}!</p>
                  <Link to="/chat" className="text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 font-medium text-sm">
                    Продолжить обучение →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-6">
        {FEATURES.map((feature) => (
          <Link 
            key={feature.title}
            to={feature.link}
            className="group relative bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm dark:shadow-gray-900/50 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            
            <div className="relative">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                <feature.icon size={28} />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                {feature.description}
              </p>
              
              <span className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold group-hover:gap-3 transition-all duration-200">
                Перейти
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>
        ))}
      </section>

      {/* Leaderboard Section */}
      <section className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm dark:shadow-gray-900/50 overflow-hidden">
        <div className="p-8 border-b border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl shadow-lg shadow-amber-500/25">
              <Trophy className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Таблица лидеров</h2>
              <p className="text-gray-500 dark:text-gray-400">Топ активных пользователей этого месяца</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {isUserInLeaderboard && (
              <div className="flex items-center gap-2 bg-amber-100 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 px-4 py-2 rounded-xl font-medium">
                <Trophy size={16} />
                Вы на {userRank} месте!
              </div>
            )}
            <Link 
              to="/leaderboard" 
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold hover:underline"
            >
              Весь рейтинг
            </Link>
          </div>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {LEADERBOARD_DATA.map((userData, index) => (
            <div 
              key={userData.username} 
              className={`p-6 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 ${
                index < 3 ? 'bg-gradient-to-r ' + 
                  (index === 0 ? 'from-amber-50/50 dark:from-amber-950/20' : 
                   index === 1 ? 'from-gray-50/50 dark:from-gray-900/30' : 
                   'from-orange-50/50 dark:from-orange-950/20') + ' to-transparent' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                index === 0 ? 'bg-amber-400 text-amber-900 shadow-lg shadow-amber-400/30' :
                index === 1 ? 'bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-200' :
                index === 2 ? 'bg-orange-400 text-orange-900' :
                'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                {userData.rank}
              </div>

              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                {userData.name.charAt(0)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900 dark:text-white truncate">{userData.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                    {userData.language === 'ru' ? '🇷🇺 RU' : '🇨🇳 CN'}
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">@{userData.username}</span>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <div className="font-bold text-gray-900 dark:text-white text-lg">{userData.xp.toLocaleString()}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">XP</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 font-bold text-orange-600 dark:text-orange-400">
                    <Flame size={16} className="fill-orange-600 dark:fill-orange-400" />
                    {userData.streak}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">дней</div>
                </div>
              </div>

              <Link 
                to="/chat" 
                className="p-3 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-all duration-200"
              >
                <MessageCircle size={22} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Пользователей', value: '12,847', icon: Users, color: 'blue' },
          { label: 'Сообщений', value: '1.2M', icon: MessageCircle, color: 'indigo' },
          { label: 'Стримов', value: '342', icon: Video, color: 'rose' },
          { label: 'Языковых пар', value: 'RU ↔ CN', icon: Trophy, color: 'amber' },
        ].map((stat) => (
          <div 
            key={stat.label} 
            className="group bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm dark:shadow-gray-900/50 hover:shadow-lg hover:shadow-gray-200/50 dark:hover:shadow-black/50 hover:-translate-y-0.5 transition-all duration-300 text-center"
          >
            <div className={`w-12 h-12 mx-auto mb-4 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
              <stat.icon className={`text-${stat.color}-600 dark:text-${stat.color}-400`} size={24} />
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
            <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">{stat.label}</div>
          </div>
        ))}
      </section>
    </div>
  );
}