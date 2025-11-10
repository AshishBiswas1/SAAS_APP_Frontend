import React, { useEffect, useState } from 'react';
import paymentService from '../../services/paymentService';
import LazyImage from '../../components/LazyImage';
import { useNavigate } from 'react-router-dom';

export default function EnrolledCourses() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await paymentService.getMyPayments();
        if (!mounted) return;
        setPayments(data || []);
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
        Loading your enrolled courses...
      </div>
    );

  if (!payments || payments.length === 0)
    return (
      <div className="text-lg text-slate-400 text-center py-12">
        You have not enrolled in any courses.
      </div>
    );

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-white text-center md:text-left">
        Enrolled Courses
      </h2>
      <div className="space-y-6">
        {payments.map((p) => (
          <div
            key={p.payment_id}
            className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-tr from-[#1e2137] via-[#232b4d] to-[#232043] border border-indigo-800/40 shadow-md rounded-2xl p-6 hover:shadow-lg hover:border-indigo-500 transition animate-fadeIn"
          >
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <div className="min-w-[58px] min-h-[58px] max-w-[58px] max-h-[58px] rounded-xl overflow-hidden shadow ring-2 ring-indigo-700 bg-slate-800 flex items-center justify-center">
                {p.courses?.image ? (
                  <LazyImage
                    src={p.courses.image}
                    alt={p.courses.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-lg text-indigo-300 font-bold">
                    {p.courses?.title
                      ? p.courses.title[0]
                      : String(p.course_id).charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <div className="text-lg font-bold text-indigo-100 truncate">
                  {p.courses?.title || p.course_id}
                </div>
                <div className="text-sm text-slate-400 mt-1">
                  Paid:{' '}
                  <span className="text-indigo-300 font-semibold">
                    ₹{p.amount}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex-shrink-0">
              <button
                onClick={() => navigate(`/course/${p.course_id}`)}
                className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold shadow hover:scale-[1.04] transition"
              >
                Open Course
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
