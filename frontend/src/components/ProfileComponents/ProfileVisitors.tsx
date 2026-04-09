interface Visitor {
  id: number;
  name: string;
  avatar: string;
}

interface Props {
  visitors: Visitor[];
  onVisitorClick?: (id: number) => void;
}

export function ProfileVisitors({ visitors, onVisitorClick }: Props) {
  // Показываем максимум 4 (контролирует бэкенд)
  const displayVisitors = visitors.slice(0, 4);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg shadow-gray-200/30 dark:shadow-black/30 p-6">
      <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <span className="w-5 h-5 flex items-center justify-center">
          <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </span>
        Недавние гости
      </h3>
      
      <div className="flex items-center gap-3">
        {displayVisitors.map((visitor) => (
          <div 
            key={visitor.id} 
            onClick={() => onVisitorClick?.(visitor.id)}
            className="group cursor-pointer flex flex-col items-center gap-2"
            title={visitor.name}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md group-hover:scale-110 transition-transform">
              {visitor.avatar}
            </div>
            <span className="text-xs text-gray-600 dark:text-gray-400 max-w-[60px] truncate">
              {visitor.name}
            </span>
          </div>
        ))}
        
        {/* Плейсхолдер если меньше 4 */}
        {displayVisitors.length < 4 && (
          <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center">
            <span className="text-gray-400 text-xs">?</span>
          </div>
        )}
      </div>
    </div>
  );
}