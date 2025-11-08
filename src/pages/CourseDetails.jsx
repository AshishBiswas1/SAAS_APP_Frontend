import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courseService from '../services/courseService';
import { Star, Users, IndianRupee } from 'lucide-react';

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCourse() {
      setError(null);
      setLoading(true);
      try {
        const data = await courseService.getCourseById(id);
        // courseService may return the course object directly or nested
        const theCourse = data?.course || data;
        setCourse(theCourse);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(
          err?.response?.message || err?.message || 'Failed to load course'
        );
      }
    }
    fetchCourse();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        {error}
      </div>
    );

  if (!course)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Course not found
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-slate-800 rounded-lg overflow-hidden mb-6">
            {course.image ? (
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-96 object-cover"
              />
            ) : (
              <div className="w-full h-96 flex items-center justify-center bg-slate-700">
                No Image
              </div>
            )}
          </div>

          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <p className="text-slate-300 mb-4">By {course.author}</p>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={
                      i < Math.floor(course.ratingavg || 0)
                        ? 'text-yellow-400'
                        : 'text-slate-600'
                    }
                  />
                ))}
              </div>
              <div className="text-sm text-slate-300">
                {(course.ratingavg || 0).toFixed(1)}
              </div>
            </div>
            <div className="text-sm text-slate-400 flex items-center gap-1">
              <Users size={16} /> {course.reviews || 0} reviews
            </div>
          </div>

          <div className="prose prose-invert max-w-none text-slate-200">
            <h2>What you'll learn</h2>
            <ul>
              {Array.isArray(course.requirements) ? (
                course.requirements.map((r, idx) => <li key={idx}>{r}</li>)
              ) : (
                <li>{course.requirements || 'No prerequisites'}</li>
              )}
            </ul>

            <h2 className="mt-6">Description</h2>
            <p>{course.description}</p>
          </div>
        </div>

        <aside className="bg-slate-800 rounded-lg p-6 h-fit">
          <div className="text-3xl font-bold mb-4 flex items-center gap-2">
            <IndianRupee /> {course.price || 0}
          </div>
          <button className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-md font-semibold">
            Buy now
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full mt-3 py-2 border border-slate-700 rounded-md text-sm"
          >
            Back
          </button>
        </aside>
      </div>
    </div>
  );
}
