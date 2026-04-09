import { Heart, Eye, Flame } from "lucide-react";

interface Props {
  likes: number;
  views: string;
  streak: number;
}

export function ProfileStats({ likes, views, streak }: Props) {
  return (
    <div className="flex items-center gap-6">
      <div className="text-center">
        <div className="flex items-center gap-1 text-rose-500">
          <Heart size={20} className="fill-current" />
          <span className="text-xl font-bold">{likes}</span>
        </div>
        <span className="text-xs text-gray-500">лайков</span>
      </div>
      <div className="text-center">
        <div className="flex items-center gap-1 text-indigo-500">
          <Eye size={20} />
          <span className="text-xl font-bold">{views}</span>
        </div>
        <span className="text-xs text-gray-500">просмотров</span>
      </div>
      <div className="text-center">
        <div className="flex items-center gap-1 text-amber-500">
          <Flame size={20} className="fill-current" />
          <span className="text-xl font-bold">{streak}</span>
        </div>
        <span className="text-xs text-gray-500">дней streak</span>
      </div>
    </div>
  );
}