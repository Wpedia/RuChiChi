export const MOCK_DATA = {
  group: {
    id: 1,
    name: "Китайский для начинающих",
    avatar: "🇨🇳",
    members: 1247,
    lastPost: {
      author: "Преподаватель Ван",
      preview: "Новые материалы для урока 5...",
      time: "10 мин назад"
    }
  },
  skills: [
    { name: "Грамматика", level: 75, max: 100, color: "from-blue-500 to-cyan-500" },
    { name: "Словарный запас", level: 60, max: 100, color: "from-purple-500 to-pink-500" },
    { name: "Произношение", level: 45, max: 100, color: "from-orange-500 to-red-500" },
    { name: "Понимание", level: 80, max: 100, color: "from-green-500 to-emerald-500" },
  ],
  visitors: [
    { id: 1, name: "Anna P.", avatar: "A", time: "2 мин назад" },
    { id: 2, name: "Li Wei", avatar: "L", time: "15 мин назад" },
    { id: 3, name: "Zhang M.", avatar: "Z", time: "1 ч назад" },
    { id: 4, name: "Ivan S.", avatar: "I", time: "3 ч назад" },
  ],
  photos: [
    { id: 1, url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400", likes: 24, comments: 3 },
    { id: 2, url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400", likes: 18, comments: 1 },
    { id: 3, url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400", likes: 31, comments: 5 },
    { id: 4, url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400", likes: 12, comments: 0 },
  ],
  achievements: [
    { id: 1, name: "Первые шаги", description: "Отправьте первое сообщение", icon: "🎯", unlocked: true, rarity: "common" as const },
    { id: 2, name: "Коммуникатор", description: "100 сообщений в чате", icon: "💬", unlocked: true, rarity: "rare" as const },
    { id: 3, name: "Огненный стрик", description: "7 дней подряд", icon: "🔥", unlocked: true, rarity: "epic" as const },
    { id: 4, name: "Полиглот", description: "Выучите 100 слов", icon: "🧠", unlocked: false, rarity: "legendary" as const },
    { id: 5, name: "Звезда стримов", description: "Проведите первый стрим", icon: "⭐", unlocked: false, rarity: "rare" as const },
  ],
  gifts: [
    { id: 1, name: "Золотая роза", icon: "🌹", count: 5, from: "Anna P." },
    { id: 2, name: "Кристалл", icon: "💎", count: 2, from: "Li Wei" },
    { id: 3, name: "Корона", icon: "👑", count: 1, from: "Zhang M." },
  ],
};