import { Camera } from "lucide-react";
import { ReactNode } from "react";

interface Props {
  initial: string;
  frameColor: string;
  isEditing: boolean;
  nativeFlag: ReactNode;
  onPhotoChange?: () => void;
}

export function ProfileAvatar({
  initial,
  frameColor,
  isEditing,
  nativeFlag,
  onPhotoChange,
}: Props) {
  return (
    <div className="relative flex-shrink-0 self-center md:self-start">
      <div className={`w-28 h-28 md:w-36 md:h-36 rounded-full p-1.5 bg-gradient-to-br ${frameColor} shadow-2xl relative`}>
        <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-4xl md:text-5xl font-bold text-gray-400 overflow-hidden">
          {initial}
        </div>
        
        {isEditing && (
          <button 
            onClick={onPhotoChange}
            className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full text-white opacity-0 hover:opacity-100 transition-opacity"
          >
            <Camera size={32} />
          </button>
        )}
      </div>
      
      {/* Только родной язык */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-900 rounded-full shadow-lg">
        {nativeFlag}
      </div>
    </div>
  );
}