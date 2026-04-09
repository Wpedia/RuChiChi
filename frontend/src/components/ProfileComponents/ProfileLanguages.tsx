import { Crown, Zap } from "lucide-react";
import { ReactNode } from "react";

interface Props {
  nativeFlag: ReactNode;
  learningFlag: ReactNode;
  level: string;
  xp: number;
}

export function ProfileLanguages({
  nativeFlag,
  learningFlag,
  level,
  xp,
}: Props) {
  return (
    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
        {/* Native Language */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <span className="text-lg">{nativeFlag}</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Родной</span>
        </div>
        
        {/* Learning Language */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg">
          <span className="text-lg">{learningFlag}</span>
          <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Изучаю</span>
        </div>

        {/* Level */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-500/10 rounded-lg">
          <Crown className="text-amber-500" size={16} />
          <span className="text-sm font-medium text-amber-700 dark:text-amber-300">{level}</span>
        </div>

        {/* XP */}
        <div className="md:ml-auto flex items-center gap-2">
          <Zap className="text-yellow-500 fill-current" size={20} />
          <span className="text-xl font-bold text-gray-900 dark:text-white">{xp.toLocaleString()}</span>
          <span className="text-sm text-gray-500">XP</span>
        </div>
      </div>
    </div>
  );
}