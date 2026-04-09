import { Camera, Edit2, Save, X } from "lucide-react";

interface Props {
  coverGradient?: string;
  avatarUrl?: string;
  avatarInitial: string;
  frameColor: string;
  isEditing: boolean;
  isOwnProfile: boolean;
  onEditToggle: () => void;
  onAvatarChange?: () => void;
}

export function ProfileHeader({
  coverGradient = "from-indigo-600 via-purple-600 to-pink-600",
  avatarInitial,
  frameColor,
  isEditing,
  isOwnProfile,
  onEditToggle,
  onAvatarChange,
}: Props) {
  return (
    <div className={`h-48 md:h-64 bg-gradient-to-br ${coverGradient} relative overflow-hidden`}>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 dark:from-gray-950 to-transparent" />
      
      {isOwnProfile && (
        <button 
          onClick={onEditToggle}
          className="absolute top-4 right-4 flex items-center gap-2 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-4 py-2 rounded-xl transition-all"
        >
          {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
          {isEditing ? "Сохранить" : "Редактировать"}
        </button>
      )}
    </div>
  );
}