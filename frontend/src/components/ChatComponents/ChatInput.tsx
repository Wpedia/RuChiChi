import { useState, useRef, useCallback, useEffect } from "react";
import { Send, Image, Mic, X, Trash2 } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onSendImage?: (imageBase64: string) => void;
  onSendVoice?: (voiceBlob: Blob, duration: number) => void;
  disabled?: boolean;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  onSendImage,
  onSendVoice,
  disabled,
}: ChatInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const recordingStartTimeRef = useRef<number>(0);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [value]);

  // Image handling
  const handleImageSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("Изображение слишком большое (макс. 10MB)");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageSelect(file);
  };

  const clearSelectedImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendImage = () => {
    if (selectedImage && onSendImage) {
      onSendImage(selectedImage);
      clearSelectedImage();
    }
  };

  // Voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      
      mediaRecorder.onstop = () => {
        const duration = Math.floor((Date.now() - recordingStartTimeRef.current) / 1000);
        if (duration > 1) {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          onSendVoice?.(audioBlob, duration);
        }
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      recordingStartTimeRef.current = Date.now();
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Failed to start recording:", err);
      alert("Не удалось получить доступ к микрофону");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      audioChunksRef.current = [];
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedImage) {
      handleSendImage();
    } else if (value.trim()) {
      onSubmit();
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() || selectedImage) {
        handleSubmit(e as unknown as React.FormEvent);
      }
    }
  };

  const canSend = (value.trim() || selectedImage) && !disabled && !isRecording;

  return (
    <div
      className={`border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0 transition-colors ${
        isDragging ? "bg-indigo-50 dark:bg-indigo-900/20" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Image preview */}
      {selectedImage && (
        <div className="px-5 pt-4 pb-2">
          <div className="relative inline-block">
            <img
              src={selectedImage}
              alt="Preview"
              className="max-h-32 rounded-xl border border-gray-200 dark:border-gray-700"
            />
            <button
              onClick={clearSelectedImage}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Recording indicator */}
      {isRecording && (
        <div className="px-5 pt-4 pb-2 flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 rounded-full">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-600 dark:text-red-400 font-medium">
              Запись {formatTime(recordingTime)}
            </span>
          </div>
          <button
            onClick={cancelRecording}
            className="p-2 text-gray-500 hover:text-red-500 transition-colors"
            title="Отменить"
          >
            <Trash2 size={20} />
          </button>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="p-4"
      >
        <div className="flex gap-2 items-end max-w-4xl mx-auto bg-gray-100 dark:bg-gray-800 rounded-3xl px-2 py-2 transition-all duration-200 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:bg-white dark:focus-within:bg-gray-700">
          {/* Image button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isRecording || !!selectedImage}
            className="p-2.5 text-gray-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-gray-700 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            title="Прикрепить изображение"
          >
            <Image size={20} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Text input - textarea для многострочного ввода */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isDragging ? "Отпустите для загрузки..." : "Сообщение..."}
            disabled={disabled || isRecording || !!selectedImage}
            rows={1}
            className="flex-1 bg-transparent border-0 outline-none resize-none min-h-[40px] max-h-[120px] py-2.5 px-1 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-[15px] disabled:opacity-50 disabled:cursor-not-allowed scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
            style={{ height: "auto" }}
          />

          {/* Voice button / Recording */}
          {!value.trim() && !selectedImage && (
            <button
              type="button"
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onMouseLeave={isRecording ? stopRecording : undefined}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              disabled={disabled}
              className={`p-2.5 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0 ${
                isRecording
                  ? "bg-red-500 text-white animate-pulse"
                  : "text-gray-500 hover:text-red-500 hover:bg-white dark:hover:bg-gray-700"
              }`}
              title="Удерживайте для записи голосового"
            >
              <Mic size={20} />
            </button>
          )}

          {/* Send button - красивая круглая кнопка с градиентом */}
          {canSend && (
            <button
              type="submit"
              disabled={disabled || isRecording}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/30 flex items-center justify-center shrink-0"
            >
              <Send size={18} className="ml-0.5" />
            </button>
          )}
        </div>

        {/* Drag overlay */}
        {isDragging && (
          <div className="absolute inset-0 bg-indigo-500/10 dark:bg-indigo-900/30 border-2 border-dashed border-indigo-500 rounded-lg flex items-center justify-center pointer-events-none">
            <span className="text-indigo-600 dark:text-indigo-400 font-medium">
              Отпустите изображение здесь
            </span>
          </div>
        )}
      </form>
    </div>
  );
}
