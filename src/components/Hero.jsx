import React from 'react';
import { ArrowRight, Sparkles, Play } from 'lucide-react';

export default function Hero() {
  const scrollToCourses = () => {
    const coursesSection = document.getElementById('courses');
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-r from-indigo-600/10 via-purple-600/10 to-pink-600/10 border border-indigo-500/20 p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl">
          {/* Animated background elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
          <div
            className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"
            style={{ animationDelay: '2s' }}
          ></div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6 text-indigo-400 animate-slideDown">
              <Sparkles size={20} className="animate-pulse" />
              <span className="text-sm font-semibold uppercase tracking-wide">
                Transform Your Career
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 leading-tight animate-slideUp">
              Master In-Demand Skills
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                at Your Own Pace
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl leading-relaxed animate-slideUp">
              Learn from industry experts. Build real-world projects. Get
              certified. Start your journey with SkillForge today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-slideUp">
              <button
                onClick={scrollToCourses}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transition transform hover:scale-105 shadow-lg shadow-indigo-500/50"
              >
                Explore Courses
                <ArrowRight size={20} />
              </button>
              <button className="px-8 py-4 border-2 border-indigo-500 text-indigo-400 hover:bg-indigo-500/10 rounded-xl font-semibold transition flex items-center justify-center gap-2 group">
                <Play size={20} className="group-hover:scale-110 transition" />
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 mt-12 pt-8 sm:pt-12 border-t border-slate-700/50">
              <div className="text-center sm:text-left">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  5K+
                </div>
                <div className="text-slate-400 text-xs sm:text-sm mt-1">
                  Active Learners
                </div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  500+
                </div>
                <div className="text-slate-400 text-xs sm:text-sm mt-1">
                  Expert Courses
                </div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent">
                  4.8★
                </div>
                <div className="text-slate-400 text-xs sm:text-sm mt-1">
                  Average Rating
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
