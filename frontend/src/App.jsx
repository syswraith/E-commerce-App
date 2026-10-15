import { useState } from 'react';
import { Toaster } from 'sonner';
import AuthPage from './components/AuthPage';
import EcommerceDashboard from './components/EcommerceDashboard';

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aetheria_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentView, setCurrentView] = useState(() => {
    const saved = localStorage.getItem('aetheria_current_user');
    return saved ? 'dashboard' : 'auth';
  });

  // Handle successful login or registration
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    localStorage.setItem('aetheria_current_user', JSON.stringify(userData));
    setCurrentView('dashboard');
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('aetheria_current_user');
    setCurrentUser(null);
    setCurrentView('auth');
  };

  return (
    <div className="flex min-h-screen flex-col">
      {currentView === 'auth' || !currentUser ? (
        <AuthPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <EcommerceDashboard user={currentUser} onLogout={handleLogout} />
      )}
      <Toaster position="bottom-right" theme="dark" richColors />
    </div>
  );
}
