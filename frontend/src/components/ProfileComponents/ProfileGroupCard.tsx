import { Users, ChevronRight } from "lucide-react";

interface Group {
  id: number;
  name: string;
  avatar: string;
  members: number;
  lastPost: {
    author: string;
    preview: string;
    time: string;
  };
}

interface Props {
  group: Group;
  onClick?: () => void;
}

export function ProfileGroupCard({ group, onClick }: Props) {
  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg shadow-gray-200/30 dark:shadow-black/30 p-5 mb-6 cursor-pointer hover:shadow-xl transition-shadow"
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-yellow-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
          {group.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">{group.name}</h3>
            <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs rounded-full">Участник</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Users size={14} /> {group.members.toLocaleString()}</span>
            <span className="truncate">Последнее: {group.lastPost.preview}</span>
          </div>
        </div>
        <ChevronRight className="text-gray-400" size={24} />
      </div>
    </div>
  );
}