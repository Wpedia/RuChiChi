import { Gift } from "lucide-react";

interface GiftItem {
  id: number;
  name: string;
  icon: string;
  count: number;
  from: string;
}

interface Props {
  gifts: GiftItem[];
  onSendGift?: () => void;
}

export function ProfileGifts({ gifts, onSendGift }: Props) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg shadow-gray-200/30 dark:shadow-black/30 p-6">
      <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Gift className="text-rose-500" size={20} />
        Подарки
      </h3>
      <div className="flex flex-wrap gap-3">
        {gifts.map((gift) => (
          <div 
            key={gift.id} 
            className="flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-500/10 rounded-xl border border-rose-100 dark:border-rose-500/20"
          >
            <span className="text-2xl">{gift.icon}</span>
            <div>
              <p className="font-semibold text-rose-900 dark:text-rose-100 text-sm">{gift.name}</p>
              <p className="text-xs text-rose-600 dark:text-rose-400">x{gift.count} от {gift.from}</p>
            </div>
          </div>
        ))}
        <button 
          onClick={onSendGift}
          className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-500 hover:border-indigo-500 hover:text-indigo-500 transition"
        >
          <Gift size={20} />
          <span className="text-sm font-medium">Отправить</span>
        </button>
      </div>
    </div>
  );
}