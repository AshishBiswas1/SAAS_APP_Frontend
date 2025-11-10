import React, { useEffect, useState } from 'react';
import courseService from '../../services/courseService';
import { useToast } from '../../components/ToastProvider';
import { useNavigate } from 'react-router-dom';

export default function YourCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { show } = useToast();

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await courseService.getMyCourses();
        if (!mounted) return;
        setCourses(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  if (loading)
    return (
      <div className="min-h-[200px] flex items-center justify-center text-xl text-white bg-slate-900 rounded-xl shadow">
        Loading your courses...
      </div>
    );

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white mb-4 md:mb-0">
          Your Courses
        </h2>
        <button
          onClick={() => navigate('/dashboard/create')}
          className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-indigo-500 text-white rounded-lg font-semibold shadow hover:scale-105 transition"
        >
          Create Course
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="text-lg text-slate-400 text-center py-12">
          You have not created any courses.
        </div>
      ) : (
        <div className="space-y-6">
          {courses.map((c) => (
            <div
              key={c.courseid}
              className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-tr from-[#1e2137] via-[#232b4d] to-[#232043] border border-indigo-800/40 shadow-md rounded-2xl p-6 hover:shadow-lg hover:border-indigo-500 transition animate-fadeIn"
            >
              <div className="flex items-center space-x-4 w-full md:w-auto">
                <div className="min-w-[58px] min-h-[58px] max-w-[58px] max-h-[58px] rounded-xl overflow-hidden shadow ring-2 ring-indigo-700 bg-slate-800 flex items-center justify-center">
                  <span className="text-lg text-indigo-300 font-bold">
                    {c.title ? c.title[0] : 'C'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="text-lg font-bold text-indigo-100 truncate">
                    {c.title}
                  </div>
                  <div className="text-sm text-slate-400 mt-1">
                    Price:{' '}
                    <span className="text-indigo-300 font-semibold">
                      ₹{c.price}
                    </span>
                  </div>
                  <div className="text-sm text-slate-400 mt-1">
                    Published: {c.published ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                {!c.published && (
                  <button
                    onClick={() =>
                      courseService.publishCourse(c.courseid).then(() => {
                        show('Course published', 'success');
                        // update local state
                        setCourses((s) =>
                          s.map((cc) =>
                            cc.courseid === c.courseid
                              ? { ...cc, published: true }
                              : cc
                          )
                        );
                      })
                    }
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold shadow hover:scale-105 transition"
                  >
                    Publish
                  </button>
                )}
                {c.published && (
                  <button
                    onClick={() =>
                      courseService
                        .unpublishCourse(c.courseid)
                        .then(() => {
                          show('Course unpublished', 'success');
                          setCourses((s) =>
                            s.map((cc) =>
                              cc.courseid === c.courseid
                                ? { ...cc, published: false }
                                : cc
                            )
                          );
                        })
                        .catch((err) => {
                          // errors will be shown by interceptor, but show fallback
                          show(err?.message || 'Failed to unpublish', 'error');
                        })
                    }
                    className="px-4 py-2 bg-rose-600 text-white rounded-lg font-semibold shadow hover:scale-105 transition"
                  >
                    Unpublish
                  </button>
                )}
                <button
                  onClick={() => navigate(`/dashboard/edit/${c.courseid}`)}
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg font-semibold shadow hover:bg-slate-800 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => navigate(`/dashboard/upload/${c.courseid}`)}
                  className="px-4 py-2 bg-slate-700 text-white rounded-lg font-semibold shadow hover:bg-slate-800 transition"
                >
                  Upload Videos
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
