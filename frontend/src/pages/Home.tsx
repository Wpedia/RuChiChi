import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  MessageCircle, 
  Video, 
  Trophy, 
  Users, 
  TrendingUp,
  ArrowRight
} from 'lucide-react';

// Моковые данные для таблицы лидеров
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
    color: 'bg-blue-500',
    link: '/chat'
  },
  {
    icon: Video,
    title: 'Обучающие стримы',
    description: 'Смотрите и проводите стримы по изучению языков',
    color: 'bg-red-500',
    link: '/streams'
  },
  {
    icon: Trophy,
    title: 'Таблица лидеров',
    description: 'Соревнуйтесь с другими учениками и получайте награды',
    color: 'bg-yellow-500',
    link: '/leaderboard'
  },
];

export default function Home() {
  const { isAuthenticated, user } = useAuthStore();

  // Проверяем, есть ли пользователь в топ-5 (для уведомления)
  const isUserInLeaderboard = user && LEADERBOARD_DATA.some(u => u.username === user.username);
  const userRank = isUserInLeaderboard 
    ? LEADERBOARD_DATA.findIndex(u => u.username === user?.username) + 1 
    : null;

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="text-center py-12">
        <div className="mb-6">
          <span className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 bg-clip-text text-transparent">
            RusChi
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
          Мост между культурами
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Общайтесь, учитесь и развивайтесь вместе с носителями русского и китайского языков
        </p>
        
        {!isAuthenticated ? (
          <div className="flex gap-4 justify-center">
            <Link 
              to="/register" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
            >
              Начать путь
            </Link>
            <Link 
              to="/login" 
              className="bg-white text-gray-700 border border-gray-300 px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-50 transition"
            >
              Уже есть аккаунт
            </Link>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-6 py-3 rounded-lg">
            <TrendingUp size={20} />
            <span>С возвращением, {user?.name}! Продолжим обучение?</span>
            <Link to="/chat" className="underline font-medium">В чат</Link>
          </div>
        )}
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-6">
        {FEATURES.map((feature) => (
          <Link 
            key={feature.title}
            to={feature.link}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition group"
          >
            <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition`}>
              <feature.icon size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600 mb-4">{feature.description}</p>
            <span className="text-blue-600 flex items-center gap-1 group-hover:gap-2 transition">
              Подробнее <ArrowRight size={16} />
            </span>
          </Link>
        ))}
      </section>

      {/* Leaderboard Section */}
      <section className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="text-yellow-500" size={28} />
            <div>
              <h2 className="text-2xl font-bold">Таблица лидеров</h2>
              <p className="text-gray-500 text-sm">Топ активных пользователей этого месяца</p>
            </div>
          </div>
          
          {/* Уведомление если пользователь в рейтинге */}
          {isUserInLeaderboard && (
            <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg flex items-center gap-2">
              <Trophy size={16} />
              <span className="font-medium">Вы на {userRank} месте!</span>
            </div>
          )}
          
          <Link to="/leaderboard" className="text-blue-600 hover:underline">
            Весь рейтинг
          </Link>
        </div>

        <div className="divide-y">
          {LEADERBOARD_DATA.map((user, index) => (
            <div 
              key={user.username} 
              className={`p-4 flex items-center gap-4 hover:bg-gray-50 transition ${
                index === 0 ? 'bg-yellow-50' : index === 1 ? 'bg-gray-50' : index === 2 ? 'bg-orange-50' : ''
              }`}
            >
              {/* Rank */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                index === 0 ? 'bg-yellow-400 text-yellow-900' :
                index === 1 ? 'bg-gray-300 text-gray-700' :
                index === 2 ? 'bg-orange-400 text-orange-900' :
                'bg-gray-100 text-gray-600'
              }`}>
                {user.rank}
              </div>

              {/* Avatar */}
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-lg font-medium text-gray-500">
                  {user.name.charAt(0)}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{user.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    user.language === 'ru' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {user.language === 'ru' ? '🇷🇺' : '🇨🇳'}
                  </span>
                </div>
                <span className="text-sm text-gray-500">@{user.username}</span>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <div className="font-bold text-gray-900">{user.xp.toLocaleString()}</div>
                  <div className="text-gray-500">XP</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-orange-600">{user.streak}</div>
                  <div className="text-gray-500">дней</div>
                </div>
              </div>

              {/* Action */}
              <Link 
                to={`/chat`} 
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
              >
                <MessageCircle size={20} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid md:grid-cols-4 gap-6">
        {[
          { label: 'Пользователей', value: '12,847', icon: Users },
          { label: 'Сообщений', value: '1.2M', icon: MessageCircle },
          { label: 'Стримов', value: '342', icon: Video },
          { label: 'Языковых пар', value: '2', icon: Trophy },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm text-center">
            <stat.icon className="mx-auto mb-3 text-blue-600" size={28} />
            <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-gray-500">{stat.label}</div>
          </div>
        ))}
      </section>
    </div>
  );
}