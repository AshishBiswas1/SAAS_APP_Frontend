import React, { useEffect, useState } from 'react';
import authService from '../../services/authService';
import apiClient from '../../config/api';
import { useToast } from '../../components/ToastProvider';
import LazyImage from '../../components/LazyImage';

export default function DashboardOverview() {
  const { show } = useToast();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '' });

  useEffect(() => {
    let mounted = true;
    async function load() {
      const me = await authService.getMe();
      if (!mounted) return;
      setUser(me);
      setForm({ full_name: me?.name || '', email: me?.email || '' });
    }
    load();
    return () => (mounted = false);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('image', file);
    try {
      const resp = await apiClient.patch('/user/updateMe', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUser(resp.data?.user || resp.user || resp.data || user);
      window.dispatchEvent(new Event('authChanged'));
      show('Profile picture updated', 'success');
    } catch (err) {
      show(err?.message || 'Failed to upload image', 'error');
    }
  };

  const handleSave = async () => {
    try {
      const resp = await apiClient.patch('/user/updateMe', {
        full_name: form.full_name,
        email: form.email
      });
      setUser(resp.data?.user || resp.user || resp.data || user);
      window.dispatchEvent(new Event('authChanged'));
      setEditing(false);
      show('Profile updated', 'success');
    } catch (err) {
      show(err?.message || 'Failed to update profile', 'error');
    }
  };

  if (!user)
    return (
      <div className="text-slate-400">Loading profile or not logged in.</div>
    );

  return (
    <div className="bg-gradient-to-br from-[#181b28] via-[#23204d] to-[#12182c] rounded-2xl p-8 shadow-2xl animate-fadeIn min-h-[400px]">
      <h2 className="text-3xl font-extrabold mb-4 text-white tracking-tight">
        Welcome back,
        <span className="text-indigo-400 ml-2">{user.name?.split(' ')[0]}</span>
      </h2>
      <div className="flex flex-col md:flex-row gap-10 items-start">
        {/* Profile photo */}
        <div className="flex flex-col items-center">
          <LazyImage
            src={
              user.image ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user.name || user.email || 'User'
              )}&background=6366f1&color=fff`
            }
            alt={user.name}
            className="w-32 h-32 rounded-full object-cover border-4 border-indigo-600 shadow-lg bg-white/10"
          />
          <div className="mt-4">
            <label
              className="block text-sm font-medium text-indigo-200 mb-1 text-center"
              htmlFor="change-photo"
            >
              Change photo
            </label>
            <input
              id="change-photo"
              type="file"
              accept="image/*"
              className="block w-full text-sm text-slate-300
                file:mr-3 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-xs file:font-semibold
                file:bg-indigo-600 file:text-white
                hover:file:bg-indigo-700"
              onChange={handleFile}
            />
          </div>
        </div>

        {/* User info */}
        <div className="flex-1 w-full max-w-xl mt-6 md:mt-0">
          {!editing ? (
            <div className="space-y-2">
              <div className="text-2xl font-bold text-white mb-1">
                {user.name}
              </div>
              <div className="text-md text-indigo-100">{user.email}</div>
              <button
                onClick={() => setEditing(true)}
                className="mt-5 px-5 py-2 rounded-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-500 shadow text-white hover:scale-105 transition"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-sm text-indigo-200 mb-1">
                  Full name
                </label>
                <input
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-900/60 border border-slate-700 rounded-lg text-white focus:bg-slate-800 focus:border-indigo-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm text-indigo-200 mb-1">
                  Email
                </label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-900/60 border border-slate-700 rounded-lg text-white focus:bg-slate-800 focus:border-indigo-500 outline-none transition"
                />
              </div>
              <div className="flex gap-2 mt-1">
                <button
                  onClick={handleSave}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-indigo-600 rounded-lg font-semibold text-white shadow hover:scale-105 transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-5 py-2 bg-slate-700 rounded-lg font-semibold text-white shadow hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
