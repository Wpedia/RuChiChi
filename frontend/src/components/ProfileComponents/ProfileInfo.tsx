import { MapPin } from "lucide-react";

interface Props {
  name: string;
  username: string;
  bio: string;
  country?: string;
  city?: string;
  isEditing: boolean;
  onChange?: (field: string, value: string) => void;
}

export function ProfileInfo({
  name,
  username,
  bio,
  country,
  city,
  isEditing,
  onChange,
}: Props) {
  return (
    <div className="flex-1 min-w-0">
      <div className="mb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
          {name}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">@{username}</p>
      </div>

      {/* Location */}
      {(country || isEditing) && (
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
          <MapPin size={18} className="text-gray-400" />
          {isEditing ? (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Страна"
                value={country || ""}
                onChange={(e) => onChange?.("country", e.target.value)}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm w-32 text-gray-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Город"
                value={city || ""}
                onChange={(e) => onChange?.("city", e.target.value)}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm w-32 text-gray-900 dark:text-white"
              />
            </div>
          ) : (
            <span>{city && country ? `${city}, ${country}` : "Местоположение не указано"}</span>
          )}
        </div>
      )}

      {/* Bio */}
      {isEditing ? (
        <textarea
          value={bio}
          onChange={(e) => onChange?.("bio", e.target.value)}
          className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
          rows={3}
          placeholder="Расскажите о себе..."
        />
      ) : (
        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed max-w-2xl">
          {bio || "🎯 Изучаю китайский для путешествий и работы. Люблю культуру и историю Китая!"}
        </p>
      )}
    </div>
  );
}