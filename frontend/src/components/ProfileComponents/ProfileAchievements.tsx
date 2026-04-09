import { Award } from "lucide-react";

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface Props {
  achievements: Achievement[];
  onAchievementClick?: (id: number) => void;
}

export function ProfileAchievements({ achievements, onAchievementClick }: Props) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg shadow-gray-200/30 dark:shadow-black/30 p-6">
      <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Award className="text-amber-500" size={20} />
        Достижения
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {achievements.map((ach) => (
          <div 
            key={ach.id} 
            onClick={() => onAchievementClick?.(ach.id)}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
              ach.unlocked 
                ? 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 border-amber-200 dark:border-amber-500/30 hover:shadow-lg' 
                : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700 opacity-60 grayscale'
            }`}
          >
            <div className="text-3xl mb-2">{ach.icon}</div>
            <p className={`font-semibold text-sm ${ach.unlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
              {ach.name}
            </p>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ach.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}