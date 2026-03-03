import { Routes, Route, Navigate } from 'react-router-dom';

import { useAuthStore } from './store/authStore';

// Pages
import Home from './pages/Home';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Layout from './components/Layout/Layout';

// Placeholder pages (заглушки для будущего)
function Streams() {
  return (
    <div className="text-center py-20">
      <h2 className="text-3xl font-bold mb-4">Стримы</h2>
      <p className="text-gray-500">Скоро здесь появятся стримы по изучению языков!</p>
    </div>
  );
}

function Leaderboard() {
  return (
    <div className="text-center py-20">
      <h2 className="text-3xl font-bold mb-4">Таблица лидеров</h2>
      <p className="text-gray-500">Рейтинг самых активных пользователей</p>
    </div>
  );
}

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Login />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        
        {/* Protected routes */}
        <Route 
          path="chat" 
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="streams" 
          element={
            <ProtectedRoute>
              <Streams />
            </ProtectedRoute>
          } 
        />
      </Route>
    </Routes>
  );
}

export default App;