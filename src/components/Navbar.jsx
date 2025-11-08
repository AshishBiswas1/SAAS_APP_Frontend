import React, { useState, useEffect } from 'react';
import { Menu, X, Search } from 'lucide-react';
import useCourseStore from '../store/courseStore';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ searchQuery, setSearchQuery }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      setIsSearching(true);
      setTimeout(() => setIsSearching(false), 500);
    }
  };

  const navigate = useNavigate();
  // user state derived from localStorage (authUser set at login)
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('authUser');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'authUser') {
        try {
          setUser(e.newValue ? JSON.parse(e.newValue) : null);
        } catch (err) {
          setUser(null);
        }
      }
      if (e.key === 'authToken' && !e.newValue) {
        // token removed in another tab
        setUser(null);
      }
    };

    const onAuthChanged = () => {
      try {
        const raw = localStorage.getItem('authUser');
        setUser(raw ? JSON.parse(raw) : null);
      } catch (err) {
        setUser(null);
      }
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener('authChanged', onAuthChanged);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('authChanged', onAuthChanged);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-900/95 backdrop-blur-lg border-b border-indigo-500/20 shadow-lg shadow-indigo-500/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/50 group-hover:scale-110 transition-transform duration-300">
              SF
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent hidden sm:block">
              SkillForge
            </span>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={handleSearchSubmit}
                className="w-full px-4 py-2 pl-10 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all duration-300 placeholder:text-slate-500"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-slate-300 hover:text-indigo-400 transition text-sm font-medium"
            >
              Browse
            </Link>
            <a
              href="#"
              className="text-slate-300 hover:text-indigo-400 transition text-sm font-medium"
            >
              Categories
            </a>

            {!user ? (
              <Link
                to="/login"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm"
              >
                Login
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <img
                  src={
                    user.image ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.name || user.full_name || user.email || 'User'
                    )}&background=0D9488&color=fff&rounded=true`
                  }
                  alt={user.name || user.full_name || 'User'}
                  className="w-9 h-9 rounded-full object-cover border-2 border-slate-700"
                />
                <span className="text-sm font-medium text-white max-w-[160px] truncate">
                  {user.name || user.full_name || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="ml-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
                >
                  Logout
                </button>
              </div>
            )}

            {!user && (
              <Link
                to="/signup"
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md text-sm"
              >
                Sign up
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-4 border-t border-slate-700 pt-4 animate-slideDown">
            <div className="px-4 flex items-center gap-3">
              {user ? (
                <>
                  <img
                    src={
                      user.image ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        user.name || user.full_name || user.email || 'User'
                      )}&background=0D9488&color=fff&rounded=true`
                    }
                    alt={user.name || user.full_name || 'User'}
                    className="w-10 h-10 rounded-full object-cover border-2 border-slate-700"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white truncate">
                      {user.name || user.full_name || user.email}
                    </div>
                    <div className="text-xs text-slate-400">View profile</div>
                  </div>
                  <div>
                    <button
                      onClick={handleLogout}
                      className="px-3 py-1 bg-red-600 rounded-md text-sm text-white"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-indigo-600 rounded-lg text-white font-medium"
                >
                  Login
                </Link>
              )}
            </div>
            <div className="px-2">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyPress={handleSearchSubmit}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm"
              />
            </div>
            <a
              href="#"
              className="block text-slate-300 hover:text-indigo-400 px-2"
            >
              Browse
            </a>
            <a
              href="#"
              className="block text-slate-300 hover:text-indigo-400 px-2"
            >
              Categories
            </a>
            {!user ? (
              <Link
                to="/login"
                className="w-full block px-4 py-2 bg-indigo-600 rounded-lg text-white font-medium text-center"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 bg-red-600 rounded-lg text-white font-medium"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
