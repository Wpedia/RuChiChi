import { ImageIcon, Heart, MessageCircle } from "lucide-react";

interface Photo {
  id: number;
  url: string;
  likes: number;
  comments: number;
}

interface Props {
  photos: Photo[];
  isEditing: boolean;
  onAddPhoto?: () => void;
  onPhotoClick?: (id: number) => void;
}

export function ProfilePhotoGallery({ photos, isEditing, onAddPhoto, onPhotoClick }: Props) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg shadow-gray-200/30 dark:shadow-black/30 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <ImageIcon className="text-indigo-500" size={20} />
          Альбом
        </h3>
        {isEditing && (
          <button 
            onClick={onAddPhoto}
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            + Добавить
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {photos.map((photo) => (
          <div 
            key={photo.id} 
            onClick={() => onPhotoClick?.(photo.id)}
            className="relative group aspect-square rounded-xl overflow-hidden cursor-pointer"
          >
            <img 
              src={photo.url} 
              alt="" 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
              <div className="flex items-center gap-3 text-white">
                <span className="flex items-center gap-1">
                  <Heart size={16} className="fill-current" /> {photo.likes}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle size={16} /> {photo.comments}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}