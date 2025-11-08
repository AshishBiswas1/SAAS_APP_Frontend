import React from 'react';
import { Facebook, Twitter, Linkedin, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900/80 backdrop-blur-lg border-t border-slate-700/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg shadow-indigo-500/50"></div>
              <span className="font-bold text-lg bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                SkillForge
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Forge your skills. Shape your future.
              <br />
              Learn. Build. Succeed.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <a href="#" className="hover:text-indigo-400 transition">
                  Browse Courses
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400 transition">
                  Become Instructor
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400 transition">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <a href="#" className="hover:text-indigo-400 transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400 transition">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-indigo-400 transition">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all duration-300 transform hover:scale-110"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all duration-300 transform hover:scale-110"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all duration-300 transform hover:scale-110"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all duration-300 transform hover:scale-110"
              >
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm">
            © 2025 SkillForge. All rights reserved.
          </p>
          <div className="flex gap-6 text-slate-500 text-sm mt-4 md:mt-0">
            <a href="#" className="hover:text-indigo-400 transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-indigo-400 transition">
              Terms of Service
            </a>
            <a href="#" className="hover:text-indigo-400 transition">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
