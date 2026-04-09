import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import {
  ProfileHeader,
  ProfileAvatar,
  ProfileInfo,
  ProfileStats,
  ProfileLanguages,
  ProfileGroupCard,
  ProfileSkills,
  ProfileVisitors,
  ProfilePhotoGallery,
  ProfileAchievements,
  ProfileGifts,
} from "../components/ProfileComponents";
import { toast } from "sonner";

// Флаги
const RussiaFlag = () => (
  <svg className="w-4 h-4 rounded-sm" viewBox="0 0 30 20">
    <rect width="30" height="6.67" fill="#fff" />
    <rect y="6.67" width="30" height="6.67" fill="#0039a6" />
    <rect y="13.33" width="30" height="6.67" fill="#d52b1e" />
  </svg>
);

const ChinaFlag = () => (
  <svg className="w-4 h-4 rounded-sm" viewBox="0 0 30 20">
    <rect width="30" height="20" fill="#de2910" />
    <g fill="#ffde00">
      <polygon points="6,2 7.5,6.5 3,4 9,4 4.5,6.5" />
      <polygon points="12,1 12.6,2.8 10.5,1.8 13.5,1.8 11.4,2.8" />
      <polygon points="14,4 14.6,5.8 12.5,4.8 15.5,4.8 13.4,5.8" />
      <polygon points="14,7 14.6,8.8 12.5,7.8 15.5,7.8 13.4,8.8" />
      <polygon points="12,10 12.6,11.8 10.5,10.8 13.5,10.8 11.4,11.8" />
    </g>
  </svg>
);

const LANGUAGES = {
  ru: { flag: RussiaFlag, name: "Русский" },
  zh: { flag: ChinaFlag, name: "中文" },
};

const AVATAR_FRAMES = [
  {
    id: "default",
    name: "Стандартная",
    color: "from-gray-400 to-gray-600",
    unlocked: true,
  },
  {
    id: "gold",
    name: "Золотая",
    color: "from-yellow-400 to-amber-600",
    unlocked: true,
  },
  {
    id: "fire",
    name: "Огненная",
    color: "from-orange-500 to-red-600",
    unlocked: false,
  },
  {
    id: "ice",
    name: "Ледяная",
    color: "from-cyan-400 to-blue-600",
    unlocked: false,
  },
];

const MOCK_DATA = {
  group: {
    id: 1,
    name: "Китайский для начинающих",
    avatar: "🇨🇳",
    members: 1247,
    lastPost: {
      author: "Преподаватель Ван",
      preview: "Новые материалы для урока 5...",
      time: "10 мин назад",
    },
  },
  skills: [
    {
      name: "Грамматика",
      level: 75,
      max: 100,
      color: "from-blue-500 to-cyan-500",
    },
    {
      name: "Словарный запас",
      level: 60,
      max: 100,
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "Произношение",
      level: 45,
      max: 100,
      color: "from-orange-500 to-red-500",
    },
    {
      name: "Понимание",
      level: 80,
      max: 100,
      color: "from-green-500 to-emerald-500",
    },
  ],
  visitors: [
    { id: 1, name: "Anna P.", avatar: "A" },
    { id: 2, name: "Li Wei", avatar: "L" },
    { id: 3, name: "Zhang M.", avatar: "Z" },
    { id: 4, name: "Ivan S.", avatar: "I" },
  ],
  photos: [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
      likes: 24,
      comments: 3,
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400",
      likes: 18,
      comments: 1,
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400",
      likes: 31,
      comments: 5,
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400",
      likes: 12,
      comments: 0,
    },
  ],
  achievements: [
    {
      id: 1,
      name: "Первые шаги",
      description: "Отправьте первое сообщение",
      icon: "🎯",
      unlocked: true,
      rarity: "common" as const,
    },
    {
      id: 2,
      name: "Коммуникатор",
      description: "100 сообщений в чате",
      icon: "💬",
      unlocked: true,
      rarity: "rare" as const,
    },
    {
      id: 3,
      name: "Огненный стрик",
      description: "7 дней подряд",
      icon: "🔥",
      unlocked: true,
      rarity: "epic" as const,
    },
    {
      id: 4,
      name: "Полиглот",
      description: "Выучите 100 слов",
      icon: "🧠",
      unlocked: false,
      rarity: "legendary" as const,
    },
    {
      id: 5,
      name: "Звезда стримов",
      description: "Проведите первый стрим",
      icon: "⭐",
      unlocked: false,
      rarity: "rare" as const,
    },
  ],
  gifts: [
    { id: 1, name: "Золотая роза", icon: "🌹", count: 5, from: "Anna P." },
    { id: 2, name: "Кристалл", icon: "💎", count: 2, from: "Li Wei" },
    { id: 3, name: "Корона", icon: "👑", count: 1, from: "Zhang M." },
  ],
};

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFrame, setSelectedFrame] = useState("gold");

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    bio: user?.bio || "",
    country: user?.country || "",
    city: user?.city || "",
    nativeLanguage: user?.nativeLanguage || "ru",
    learningLanguage: user?.learningLanguage || "zh",
  });

  const isOwnProfile = true;
  const currentFrame =
    AVATAR_FRAMES.find((f) => f.id === selectedFrame) || AVATAR_FRAMES[0];

  const NativeFlag =
    LANGUAGES[formData.nativeLanguage as keyof typeof LANGUAGES]?.flag ||
    RussiaFlag;
  const LearningFlag =
    LANGUAGES[formData.learningLanguage as keyof typeof LANGUAGES]?.flag ||
    ChinaFlag;

  const handleSave = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading("Сохранение...");

    try {
      await updateUser(formData);
      toast.success("Профиль обновлен!", { id: toastId });
      setIsEditing(false);
    } catch (error) {
      toast.error("Не удалось сохранить", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <ProfileHeader
        coverColor={currentFrame.color}
        isEditing={isEditing}
        isOwnProfile={isOwnProfile}
        isSaving={isSaving}
        onEditToggle={handleSave}
      />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Main Profile Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-black/50 p-6 md:p-8 mb-6 -mt-16 md:-mt-20">
          <div className="flex flex-col md:flex-row gap-6">
            <ProfileAvatar
              initial={
                formData.firstName?.charAt(0) ||
                user?.phoneOrLogin?.charAt(0) ||
                "?"
              }
              frameColor={currentFrame.color}
              isEditing={isEditing}
              nativeFlag={<NativeFlag />}
            />

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <ProfileInfo
                  name={formData.firstName || user?.phoneOrLogin || ""}
                  username={user?.phoneOrLogin || ""}
                  bio={formData.bio}
                  country={formData.country}
                  city={formData.city}
                  nativeFlag={<NativeFlag />}
                  learningFlag={<LearningFlag />}
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <ProfileStats likes={128} views="1.2k" streak={12} />
              </div>

              <ProfileLanguages
                nativeFlag={<NativeFlag />}
                learningFlag={<LearningFlag />}
                level="B1"
                xp={2450}
              />
            </div>
          </div>
        </div>

        {/* Group Card */}
        <ProfileGroupCard
          group={MOCK_DATA.group}
          onClick={() => {
            /* TODO: navigate to group */
          }}
        />

        {/* Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <ProfileSkills skills={MOCK_DATA.skills} />
            <ProfileVisitors visitors={MOCK_DATA.visitors} />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            <ProfilePhotoGallery
              photos={MOCK_DATA.photos}
              isEditing={isEditing}
              onAddPhoto={() => {
                /* TODO: add photo */
              }}
            />
            <ProfileAchievements achievements={MOCK_DATA.achievements} />
            <ProfileGifts gifts={MOCK_DATA.gifts} />
          </div>
        </div>
      </div>
    </div>
  );
}
