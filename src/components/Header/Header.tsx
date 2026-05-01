import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const clearToken = useAuthStore((state) => state.clearToken);

  const handleLogout = () => {
    clearToken();
    localStorage.removeItem('profile');
    localStorage.removeItem('profile_expiry');
    localStorage.removeItem('videos');
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-[#1a1a1a] border-b border-gray-700 shadow-md">
      <Link to="/" className="flex items-center gap-2">
        <img src="/vite.svg" alt="Logo" className="h-8 w-8" />
        <span className="text-lg font-semibold text-white">Sell Videos</span>
      </Link>

      <nav className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <Link
              to="/profile"
              className="text-sm text-gray-300 hover:text-white transition"
            >
              Meu Perfil
            </Link>
            <Link
              to="/orders"
              className="text-sm text-gray-300 hover:text-white transition"
            >
              Meus Pedidos
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md bg-red-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Sair
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="rounded-md bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Fazer Login
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
