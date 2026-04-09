import { Check, CheckCheck } from "lucide-react";
import type { MessageStatus } from "../store/chatStore";

interface StatusIconProps {
  status: MessageStatus;
  isDark: boolean;
}

export function StatusIcon({ status, isDark }: StatusIconProps) {
  const baseClass = isDark ? "text-indigo-300" : "text-indigo-200";
  
  switch (status) {
    case "sent":
      return <Check size={14} className="opacity-60" />;
    case "delivered":
      return <CheckCheck size={14} className="opacity-60" />;
    case "read":
      return <CheckCheck size={14} className={baseClass} />;
    default:
      return null;
  }
}
