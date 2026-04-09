import { Toaster as SonnerToaster } from "sonner";
import { useThemeStore } from "../store/themeStore";

export function Toaster() {
  const { isDark } = useThemeStore();

  return (
    <SonnerToaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        style: {
          background: isDark ? "#1f2937" : "#ffffff",
          color: isDark ? "#ffffff" : "#1f2937",
          border: `1px solid ${isDark ? "#374151" : "#e5e7eb"}`,
        },
      }}
    />
  );
}