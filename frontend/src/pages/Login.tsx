import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Eye, EyeOff, MessageCircle, Globe, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
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
      navigate("/chat");
    } catch (err: any) {
      setLocalError(err.response?.data?.message || "Ошибка");
    }
  };

  const languages = [
    { value: "ru", label: "🇷🇺 Русский", flag: "🇷🇺" },
    { value: "zh", label: "🇨🇳 中文", flag: "🇨🇳" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-rose-500/20 to-orange-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl shadow-gray-200/50 dark:shadow-black/50 p-8 border border-gray-100 dark:border-gray-800">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-rose-500 rounded-2xl shadow-lg shadow-indigo-500/25 mb-4">
              <span className="text-2xl font-bold text-white">R</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-500 bg-clip-text text-transparent">
              RusChi
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              Мост между культурами
            </p>
          </div>

          {/* Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                isLogin
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Вход
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                !isLogin
                  ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              Регистрация
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Имя
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white dark:focus:bg-gray-700 transition-all text-gray-900 dark:text-white placeholder:text-gray-400"
                  placeholder="Как вас зовут?"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Телефон или логин
              </label>
              <input
                type="text"
                value={formData.phoneOrLogin}
                onChange={(e) =>
                  setFormData({ ...formData, phoneOrLogin: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white dark:focus:bg-gray-700 transition-all text-gray-900 dark:text-white placeholder:text-gray-400"
                placeholder="+7 999 123-45-67"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Пароль
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white dark:focus:bg-gray-700 transition-all text-gray-900 dark:text-white placeholder:text-gray-400 pr-12"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Повторите пароль
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white dark:focus:bg-gray-700 transition-all text-gray-900 dark:text-white placeholder:text-gray-400"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Родной язык
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.value}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, nativeLanguage: lang.value })
                        }
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                          formData.nativeLanguage === lang.value
                            ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <span className="text-sm font-medium">{lang.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {(localError || storeError) && (
              <div className="p-3 bg-rose-50 dark:bg-rose-500/10 rounded-xl">
                <p className="text-rose-600 dark:text-rose-400 text-sm text-center">
                  {localError || storeError}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                "Загрузка..."
              ) : (
                <>
                  {isLogin ? "Войти" : "Создать аккаунт"}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
            <span className="px-4 text-gray-400 text-sm">или</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
          </div>

          {/* Demo access */}
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Нет доступа? Свяжитесь с нами
            </p>
            <a
              href="https://t.me/unihanna"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
            >
              <MessageCircle size={18} />
              Написать в Telegram
            </a>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-xs mt-6">
          Нажимая кнопку, вы соглашаетесь с{" "}
          <Link to="/terms" className="underline hover:text-gray-600 dark:hover:text-gray-300">
            правилами использования
          </Link>
        </p>
      </div>
    </div>
  );
}