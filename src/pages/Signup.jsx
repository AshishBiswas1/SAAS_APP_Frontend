import React, { useState } from 'react';
import authService from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
    try {
      const res = await authService.signup({ name, email, password });
      console.log('Signup response:', res);
      setLoading(false);
      // Show success message instead of redirecting
      setSuccess(true);
    } catch (err) {
      setLoading(false);
      setError(err?.response?.message || err?.message || 'Signup failed');
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
        <h2 className="text-2xl font-bold text-white mb-4">
          Create an account
        </h2>
        {error && (
          <div className="mb-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
            <div className="font-semibold mb-1">
              Account created successfully!
            </div>
            <div className="text-sm text-emerald-300">
              A confirmation email has been sent to your email address. Please
              check your inbox and verify your account.
            </div>
            <Link
              to="/login"
              className="inline-block mt-3 text-sm text-indigo-400 hover:text-indigo-300 underline"
            >
              Go to Login →
            </Link>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-300">Full name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-sm text-white"
              placeholder="John Doe"
            />
          </div>
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
              placeholder="Choose a strong password"
            />
          </div>
          <button
            type="submit"
            disabled={loading || success}
            className={`w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-md ${
              loading || success
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:from-indigo-700 hover:to-purple-700'
            } transition-all`}
          >
            {loading
              ? 'Creating...'
              : success
              ? 'Account Created'
              : 'Create account'}
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-400">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-400">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
