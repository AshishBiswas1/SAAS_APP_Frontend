import React, { useState } from 'react';
import authService from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authService.login({ email, password });
      console.log('Login response:', res);
      // backend returns token in token field
      const token = res?.token || res?.data?.token;
      if (token) {
        localStorage.setItem('authToken', token);

        // Set cookie so backend protect() (which checks req.cookies.jwt) accepts the session.
        try {
          let cookie = `jwt=${token}; path=/; max-age=${
            24 * 60 * 60
          }; SameSite=Strict`;
          if (window.location.protocol === 'https:') cookie += '; Secure';
          document.cookie = cookie;
        } catch (e) {
          console.warn('Failed to set cookie:', e);
        }

        // Normalize the returned user into a small profile used by Navbar
        const rawUser = res?.data?.user || res?.user || null;
        const userObj = rawUser
          ? {
              id: rawUser.id,
              email: rawUser.email || rawUser.user_metadata?.email,
              name:
                rawUser.user_metadata?.name ||
                rawUser.user_metadata?.full_name ||
                rawUser.email ||
                rawUser.user_metadata?.sub ||
                '',
              image:
                rawUser.user_metadata?.avatar_url ||
                rawUser.user_metadata?.image ||
                null
            }
          : null;

        if (userObj) {
          try {
            localStorage.setItem('authUser', JSON.stringify(userObj));
            try {
              window.dispatchEvent(new Event('authChanged'));
            } catch (e) {}
          } catch (e) {
            console.warn('Failed to store authUser in localStorage', e);
          }
        }
      }
      setLoading(false);
      navigate('/');
    } catch (err) {
      setLoading(false);
      setError(err?.response?.message || err?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 p-6">
      <div className="w-full max-w-md bg-slate-800/60 border border-slate-700 rounded-xl p-8 shadow-lg">
        <div className="mb-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">Back</span>
          </Link>
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Welcome back</h2>
        {error && <div className="text-red-400 mb-3">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-300">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-sm text-white"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm text-slate-300">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-sm text-white"
              placeholder="Your password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-md"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-400">
          New here?{' '}
          <a href="/signup" className="text-indigo-400">
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}
