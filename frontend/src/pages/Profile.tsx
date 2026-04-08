import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import {
  Camera,
  Edit2,
  Save,
  X,
  Globe,
  User,
  BookOpen,
  Award,
} from "lucide-react";

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    nativeLanguage: user?.nativeLanguage || "ru",
    learningLanguage: user?.learningLanguage || "zh",
    bio: user?.bio || "",
  });

  const handleSave = async () => {
    setIsSaving(true);
    setError("");

    try {
      await updateUser({
        firstName: formData.firstName,
        bio: formData.bio,
        nativeLanguage: formData.nativeLanguage,
        learningLanguage: formData.learningLanguage,
      });
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Ошибка сохранения");
    } finally {
      setIsSaving(false);
    }
  };

  const languages = {
    ru: { flag: "🇷🇺", name: "Русский" },
    zh: { flag: "🇨🇳", name: "中文" },
  };

  const levels = [
    { value: "beginner", label: "Начинающий", color: "bg-green-500" },
    { value: "intermediate", label: "Средний", color: "bg-yellow-500" },
    { value: "advanced", label: "Продвинутый", color: "bg-red-500" },
  ];

  return (
    <div className="max-w-4xl mx-auto pt-10">
      {/* Header с аватаром */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 mb-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />

        <div className="flex items-center gap-6 relative z-10">
          <div className="relative">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-4xl backdrop-blur-sm border-2 border-white/30">
              {user?.firstName?.charAt(0) ||
                user?.phoneOrLogin?.charAt(0) ||
                "?"}
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition">
                <Camera size={16} />
              </button>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-1">
              {user?.firstName || user?.phoneOrLogin}
            </h1>
            <p className="text-white/80">@{user?.phoneOrLogin}</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-white/70">
              <span className="flex items-center gap-1">
                <Globe size={14} />
                На сайте с {new Date(user?.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            disabled={isSaving}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition disabled:opacity-50"
          >
            {isEditing ? (
              <>
                <Save size={18} /> {isSaving ? "Сохранение..." : "Сохранить"}
              </>
            ) : (
              <>
                <Edit2 size={18} /> Редактировать
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Основная информация */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="text-blue-600" size={20} />
            Основная информация
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Имя</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ваше имя"
                />
              ) : (
                <p className="text-gray-900 font-medium">
                  {user?.firstName || "Не указано"}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-500 mb-1 block">Логин</label>
              <p className="text-gray-900 font-medium">{user?.phoneOrLogin}</p>
            </div>

            <div>
              <label className="text-sm text-gray-500 mb-1 block">О себе</label>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                  placeholder="Расскажите о себе..."
                />
              ) : (
                <p className="text-gray-900">
                  {user?.bio || "Пока ничего не рассказал..."}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Языки */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="text-purple-600" size={20} />
            Языки
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500 mb-2 block">
                Родной язык
              </label>
              {isEditing ? (
                <select
                  value={formData.nativeLanguage}
                  onChange={(e) =>
                    setFormData({ ...formData, nativeLanguage: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ru">🇷🇺 Русский</option>
                  <option value="zh">🇨🇳 中文</option>
                </select>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl">
                    {
                      languages[user?.nativeLanguage as keyof typeof languages]
                        ?.flag
                    }
                  </span>
                  <span className="font-medium">
                    {
                      languages[user?.nativeLanguage as keyof typeof languages]
                        ?.name
                    }
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-500 mb-2 block">Изучаю</label>
              {isEditing ? (
                <select
                  value={formData.learningLanguage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      learningLanguage: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="zh">🇨🇳 中文</option>
                  <option value="ru">🇷🇺 Русский</option>
                </select>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl">
                    {
                      languages[
                        user?.learningLanguage as keyof typeof languages
                      ]?.flag
                    }
                  </span>
                  <span className="font-medium">
                    {
                      languages[
                        user?.learningLanguage as keyof typeof languages
                      ]?.name
                    }
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-500 mb-2 block">
                Уровень
              </label>
              <div className="flex gap-2">
                {levels.map((level) => (
                  <div
                    key={level.value}
                    className={`flex-1 p-3 rounded-lg text-center ${
                      user?.level === level.value
                        ? `${level.color} text-white`
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    <Award size={16} className="mx-auto mb-1" />
                    <span className="text-xs font-medium">{level.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Статистика */}
      <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Статистика</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">0</div>
            <div className="text-sm text-gray-500">Сообщений</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-500">Дней streak</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-500">Слов выучено</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">#0</div>
            <div className="text-sm text-gray-500">В рейтинге</div>
          </div>
        </div>
      </div>
    </div>
  );
}
