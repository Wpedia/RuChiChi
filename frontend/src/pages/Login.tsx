// src/pages/LoginPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true); // true = вход, false = регистрация
  const [formData, setFormData] = useState({
    phoneOrLogin: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    nativeLanguage: "ru",
  });

  const navigate = useNavigate();
  const { login, register, isLoading, error: storeError } = useAuthStore();
  const [localError, setLocalError] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setLocalError("Пароли не совпадают");
      return;
    }

    try {
      if (isLogin) {
        await login(formData.phoneOrLogin, formData.password);
      } else {
        await register({
          phoneOrLogin: formData.phoneOrLogin,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          firstName: formData.firstName || undefined,
          nativeLanguage: formData.nativeLanguage,
        });
      }
      navigate("/chat"); // После успеха в чат
    } catch (err: any) {
      setLocalError(err.response?.data?.message || "Ошибка");
    }
  };

  const handleTelegramContact = () => {
    window.open("https://t.me/unihanna", "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20 shadow-2xl">
        {/* Лого */}
        <h1 className="text-4xl font-bold text-white text-center mb-2">
          RusChi
        </h1>
        <p className="text-gray-300 text-center mb-8">
          Общайся на русском и китайском
        </p>

        {/* Переключатель вход/регистрация */}
        <div className="flex bg-black/20 rounded-lg p-1 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
              isLogin
                ? "bg-white/20 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Вход
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
              !isLogin
                ? "bg-white/20 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Регистрация
          </button>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Телефон или логин
            </label>
            <input
              type="text"
              value={formData.phoneOrLogin}
              onChange={(e) =>
                setFormData({ ...formData, phoneOrLogin: e.target.value })
              }
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="+7 999 123-45-67 или username"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Пароль</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Повторите пароль
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          )}

          {(localError || storeError) && (
            <p className="text-red-400 text-sm text-center">
              {localError || storeError}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? "Загрузка..."
              : isLogin
                ? "Войти"
                : "Зарегистрироваться"}
          </button>
        </form>

        {/* Разделитель */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="px-4 text-gray-400 text-sm">или</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        {/* Telegram кнопка */}
        <button
          onClick={handleTelegramContact}
          className="w-full bg-[#0088cc] hover:bg-[#0099dd] text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
          </svg>
          Написать в Telegram для доступа
        </button>

        {/* Футер */}
        <p className="text-gray-400 text-xs text-center mt-6">
          Нажимая кнопку, вы соглашаетесь с правилами использования
        </p>
      </div>
    </div>
  );
}
