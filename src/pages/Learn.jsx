import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import videoService from '../services/videoService';
import authService from '../services/authService';
import courseService from '../services/courseService';
import { generateCertificateBlob } from '../utils/certificate';
import Navbar from '../components/Navbar';
import { useToast } from '../components/ToastProvider';
import { Play, Clock } from 'lucide-react';

function formatSeconds(sec = 0) {
  const s = Number(sec) || 0;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
}

export default function Learn() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all'); // 'all' or 'progress'
  const { show } = useToast();

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await videoService.getVideosWithProgress(id);
        if (!mounted) return;
        setVideos(data || []);
      } catch (err) {
        console.error('Failed to load videos', err);
        setVideos([]);
      }
      setLoading(false);
    }
    load();
    return () => (mounted = false);
  }, [id]);

  const filtered =
    tab === 'all'
      ? videos
      : videos.filter((v) => v.progress && v.progress.status !== 'not_started');

  return (
    <div>
      <Navbar />
      <div className="min-h-screen pt-20 bg-gradient-to-br from-[#0b1020] to-[#14132b] text-white">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Course Lectures</h2>
            <div className="flex gap-2">
              <button
                className={`px-3 py-1 rounded ${
                  tab === 'all' ? 'bg-indigo-600' : 'bg-slate-800'
                }`}
                onClick={() => setTab('all')}
              >
                All Lectures
              </button>
              <button
                className={`px-3 py-1 rounded ${
                  tab === 'progress' ? 'bg-indigo-600' : 'bg-slate-800'
                }`}
                onClick={() => setTab('progress')}
              >
                In Progress / Watched
              </button>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center">Loading videos...</div>
          ) : (
            <div className="space-y-3">
              {filtered.length === 0 ? (
                <div className="p-6 bg-slate-800 rounded">No videos found.</div>
              ) : (
                filtered.map((v) => (
                  <div
                    key={v.video_id}
                    className="p-4 bg-slate-800 rounded flex items-center gap-4 hover:bg-slate-700 transition"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-white">
                        {v.video_title}
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-3 mt-1">
                        <Clock size={14} /> {formatSeconds(v.video_duration)}
                        {v.progress && v.progress.status !== 'not_started' && (
                          <span className="ml-2 px-2 py-0.5 bg-emerald-600 text-xs rounded">
                            {v.progress.status}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          navigate(`/learn/${id}/video/${v.video_id}`)
                        }
                        className="px-3 py-2 bg-indigo-600 rounded flex items-center gap-2"
                      >
                        <Play size={16} /> Play
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          {/* Certificate CTA for course completion */}
          {videos.length > 0 &&
            videos.every((v) => v.progress?.status === 'completed') && (
              <div className="max-w-5xl mx-auto px-4 py-6">
                <button
                  onClick={async () => {
                    try {
                      const me = await authService.getMe();
                      const course = await courseService.getCourseById(id);
                      const name = me?.name || me?.email || 'Student';
                      const title =
                        course?.title ||
                        course?.course_title ||
                        course?.name ||
                        'Course';

                      const blob = await generateCertificateBlob({
                        name,
                        courseTitle: title
                      });

                      if (!blob)
                        throw new Error('Failed to generate certificate');

                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      const safeName = name
                        .replace(/[^a-z0-9]/gi, '_')
                        .toLowerCase();
                      a.download = `certificate-${safeName}-${id}.png`;
                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                      window.URL.revokeObjectURL(url);
                      show('Certificate generated & downloaded', 'success');
                    } catch (err) {
                      console.error('Certificate generation failed', err);
                      show('Failed to generate certificate', 'error');
                    }
                  }}
                  className="mt-4 px-4 py-2 bg-emerald-600 rounded text-white font-semibold"
                >
                  Claim Certificate
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
