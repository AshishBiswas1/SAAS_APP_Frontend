import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dashboard/enrolled', label: 'Enrolled Courses' },
  { to: '/dashboard/your-courses', label: 'Your Courses' },
  { to: '/dashboard/create', label: 'Create Course' }
];

export default function DashboardLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-[#101729] via-[#20176d] to-[#18142a] text-white">
      <div className="max-w-7xl mx-auto px-2 sm:px-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="col-span-12 lg:col-span-3 mb-8 lg:mb-0">
            <nav className="bg-gradient-to-br from-slate-900/90 via-indigo-900/70 to-slate-700/60 border border-slate-800 rounded-2xl p-6 shadow-xl glass-strong relative overflow-hidden animate-fadeIn">
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-500 opacity-10 rounded-full blur-2xl z-0"></div>
              <div className="relative z-10 flex flex-col space-y-1">
                {navLinks.map((item) => {
                  const active = location.pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      tabIndex={0}
                      className={`block px-4 py-2 my-1 rounded-lg font-semibold text-md transition-all ${
                        active
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-500 text-white shadow-lg scale-105'
                          : 'bg-slate-900/30 hover:bg-indigo-700/40 hover:text-indigo-100 text-indigo-200'
                      } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      aria-current={active ? 'page' : undefined}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="col-span-12 lg:col-span-9">
            <section className="bg-gradient-to-br from-slate-900/70 to-slate-900/80 border border-indigo-800 rounded-2xl p-7 shadow-2xl min-h-[60vh] animate-fadeIn glass mt-2">
              <div className="mb-4">
                <BackToHome />
              </div>
              <Outlet />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

function BackToHome() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate('/')}
      className="inline-flex items-center gap-2 text-sm text-indigo-300 hover:text-indigo-400 font-semibold"
    >
      ← Back to courses
    </button>
  );
}
