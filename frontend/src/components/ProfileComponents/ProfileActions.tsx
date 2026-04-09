import { MessageCircle, Heart, Gift } from "lucide-react";

interface Props {
  onMessage?: () => void;
  onLike?: () => void;
  onGift?: () => void;
}

export function ProfileActions({ onMessage, onLike, onGift }: Props) {
  return (
    <div className="flex gap-3 mt-6">
      <button 
        onClick={onMessage}
        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
      >
        <MessageCircle size={20} />
        Написать
      </button>
      <button 
        onClick={onLike}
        className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
      >
        <Heart size={20} />
        Лайк
      </button>
      <button 
        onClick={onGift}
        className="px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition"
      >
        <Gift size={20} className="text-amber-500" />
      </button>
    </div>
  );
}