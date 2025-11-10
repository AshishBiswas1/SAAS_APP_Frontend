import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courseService from '../services/courseService';
import paymentService from '../services/paymentService';
import { useToast } from '../components/ToastProvider';
import {
  Star,
  IndianRupee,
  Award,
  ChevronLeft,
  Heart,
  Share2,
  BookOpen,
  Clock,
  Tag,
  CheckCircle,
  Smartphone,
  Tv,
  BadgeCheck,
  PlayCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';
import LazyImage from '../components/LazyImage';

// Helper for default avatar
function getAvatar(str = '') {
  if (!str) return '?';
  return str
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [checkingEnrollment, setCheckingEnrollment] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { show } = useToast();

  const avgFromReviews =
    reviews && reviews.length > 0
      ? reviews.reduce((s, r) => s + Number(r.rating || 0), 0) / reviews.length
      : null;

  const displayAvg = avgFromReviews
    ? avgFromReviews.toFixed(1)
    : course && course.ratingavg
    ? Number(course.ratingavg).toFixed(1)
    : '0.0';

  const totalReviews = reviews?.length || course?.reviews || 0;
  const ratingDistribution = (() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    (reviews || []).forEach((r) => {
      const v = Math.round(Number(r.rating || 0));
      if (v >= 1 && v <= 5) counts[v] = (counts[v] || 0) + 1;
    });
    return counts;
  })();

  async function loadData() {
    setError(null);
    setLoading(true);

    // Check if user is logged in by checking for authToken in localStorage
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);

    try {
      // Always load course and reviews
      const [data, reviewsData] = await Promise.all([
        courseService.getCourseById(id),
        courseService.getCourseReviews(id)
      ]);

      const theCourse = data?.course || data;
      setCourse(theCourse);
      setReviews(reviewsData || []);

      // Only check enrollment if user is logged in
      if (token) {
        setCheckingEnrollment(true);
        try {
          const enrollmentData = await paymentService.checkEnrollment(id);
          setIsEnrolled(enrollmentData?.isEnrolled || false);
        } catch (enrollErr) {
          // If enrollment check fails, assume not enrolled
          setIsEnrolled(false);
        }
        setCheckingEnrollment(false);
      }

      setLoading(false);
    } catch (err) {
      setLoading(false);
      setCheckingEnrollment(false);
      setError(
        err?.response?.message || err?.message || 'Failed to load course'
      );
    }
  }

  async function handleEnrollClick() {
    // If user is not logged in, redirect to login page
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    setProcessingPayment(true);
    try {
      const session = await paymentService.createCheckoutSession(id);
      if (session?.session?.url) {
        // Redirect to Stripe checkout page
        window.location.href = session.session.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      setProcessingPayment(false);
      show(err?.message || 'Failed to create checkout session', 'error');
    }
  }

  function handleStartCourse() {
    // Navigate to course learning page
    navigate(`/learn/${id}`);
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-rose-400 text-lg">
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
    <div>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="min-h-screen bg-gradient-to-br from-[#151629] via-[#1e1b4b] to-[#232046] px-2 py-5 text-white animate-fadeIn pt-20">
        <div className="max-w-7xl mx-auto relative">
          {/* Decorative Background */}
          <div className="pointer-events-none absolute -right-40 -top-44 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-400"></div>

          {/* Back button */}
          <div className="mb-2">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-indigo-300 font-semibold hover:text-indigo-400 transition"
            >
              <ChevronLeft size={19} /> Back to Courses
            </button>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-12 gap-10 mt-3">
            {/* LEFT */}
            <div className="lg:col-span-8">
              {/* Course Headings */}
              <div className="mb-4 lg:mb-6">
                <div className="text-3xl lg:text-4xl font-extrabold mb-2 leading-tight drop-shadow-lg">
                  {course.title}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-slate-300 mb-1 text-lg font-medium">
                  By{' '}
                  <span className="text-indigo-100">
                    {course.author || 'Instructor'}
                  </span>
                  <span className="hidden lg:inline">&middot;</span>
                  <span className="text-sm lg:text-base px-2 lg:px-3 py-1 rounded-full bg-indigo-800/40 border border-indigo-500/30 text-indigo-300 ml-1">
                    {course.category || 'General'}
                  </span>
                  <span className="hidden md:inline-block">&middot;</span>
                  <span className="text-slate-400 text-sm">
                    {course.updated_at && (
                      <>
                        Last updated{' '}
                        {new Date(course.updated_at).toLocaleDateString()}
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Star ratings/summary */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex gap-1 items-center">
                  <span className="text-yellow-400 font-bold text-xl mr-1">
                    {displayAvg}
                  </span>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < Math.round(Number(displayAvg))
                          ? 'text-yellow-400'
                          : 'text-slate-700'
                      }
                      size={20}
                    />
                  ))}
                  <span className="text-slate-300 ml-3">
                    {totalReviews} ratings
                  </span>
                </div>
                {(course.ratingavg || 0) >= 4.5 &&
                  (course.reviews || 0) >= 30 && (
                    <span className="inline-flex items-center px-2 py-1 ml-3 rounded bg-amber-500/20 text-amber-300 text-xs font-bold uppercase shadow-sm gap-1">
                      <Award size={15} />
                      Bestseller
                    </span>
                  )}
                <button className="ml-auto rounded-full p-2 bg-white/10 hover:bg-white/20 text-white">
                  <Share2 size={17} />
                </button>
                <button className="rounded-full p-2 bg-white/10 hover:bg-white/20 text-rose-400">
                  <Heart size={17} />
                </button>
              </div>

              {/* What you'll learn */}
              <div className="rounded-xl bg-gradient-to-br from-black/40 to-slate-900/40 border border-slate-700 p-6 mb-6">
                <div className="font-bold text-xl mb-3 text-white">
                  What you'll learn
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 text-slate-100 list-disc pl-6">
                  {Array.isArray(course.requirements) &&
                  course.requirements.length > 0 ? (
                    course.requirements.map((r, i) => <li key={i}>{r}</li>)
                  ) : (
                    <li>No prerequisites</li>
                  )}
                </ul>
              </div>

              {/* Course Description */}
              <div className="mb-6">
                <div className="font-semibold text-lg text-white mb-2">
                  Course overview
                </div>
                <div className="text-slate-300 leading-relaxed whitespace-pre-line">
                  {course.description}
                </div>
              </div>

              {/* Ratings breakdown */}
              <div className="mb-7">
                <div className="font-bold text-lg mb-2">Ratings breakdown</div>
                <div className="space-y-1 max-w-md">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const cnt = ratingDistribution[star] || 0;
                    const pct =
                      totalReviews > 0
                        ? Math.round((cnt / totalReviews) * 100)
                        : 0;
                    return (
                      <div
                        key={star}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div className="w-8 text-indigo-200">{star}★</div>
                        <div className="flex-1 bg-slate-800 rounded h-3 overflow-hidden">
                          <div
                            className="h-3 bg-gradient-to-r from-amber-400 to-yellow-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="w-10 text-right text-indigo-300">
                          {cnt}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reviews */}
              <div className="mb-10">
                <div className="font-bold text-lg mb-2">Student feedback</div>
                {reviews.length === 0 ? (
                  <div className="text-slate-400">No reviews yet.</div>
                ) : (
                  <div className="grid gap-5 md:grid-cols-2">
                    {reviews
                      .filter((r, i) => i < 4)
                      .map((r) => (
                        <div
                          key={r.review_id}
                          className="border border-slate-700 bg-slate-800/60 rounded-xl p-5 flex flex-col gap-2 shadow hover:shadow-xl transition-shadow"
                        >
                          <div className="flex items-center gap-3 mb-1">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold">
                              {getAvatar(r.users?.full_name || r.users?.email)}
                            </div>
                            <div>
                              <div className="font-semibold text-white">
                                {r.users?.full_name ||
                                  r.users?.email ||
                                  'Anonymous'}
                              </div>
                              <div className="text-xs text-slate-400">
                                {new Date(r.created_at).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="ml-auto flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  className={
                                    i < Math.round(Number(r.rating))
                                      ? 'text-yellow-400'
                                      : 'text-slate-700'
                                  }
                                />
                              ))}
                              <span className="ml-1 text-xs text-yellow-200 font-semibold">
                                {Number(r.rating).toFixed(1)}
                              </span>
                            </div>
                          </div>
                          {r.review && (
                            <div className="italic text-slate-100 mt-1">
                              "{r.review}"
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Sticky Purchase */}
            <aside className="lg:col-span-4 lg:sticky lg:top-8 h-fit bg-gradient-to-br from-indigo-800/80 to-slate-950/70 border border-slate-700 rounded-2xl p-6 shadow-2xl">
              <div className="rounded-xl overflow-hidden shadow mb-5 h-48 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                {course.image ? (
                  <LazyImage
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <BookOpen size={64} className="text-slate-700" />
                )}
              </div>

              <div className="text-4xl font-extrabold flex items-center gap-2 mb-2 text-white">
                <IndianRupee />
                {course.price || 0}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300 mb-4">
                <span>One-time purchase</span>
                <span className="mx-2">·</span>
                <span>Lifetime access</span>
              </div>

              {checkingEnrollment ? (
                <button
                  disabled
                  className="w-full py-3 mb-4 bg-slate-700 rounded-xl font-bold text-lg shadow-lg cursor-not-allowed opacity-50"
                >
                  Checking enrollment...
                </button>
              ) : isEnrolled ? (
                <button
                  onClick={handleStartCourse}
                  className="w-full py-3 mb-4 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-500 rounded-xl font-bold text-lg shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
                >
                  <PlayCircle size={22} />
                  Start Course
                </button>
              ) : (
                <button
                  onClick={handleEnrollClick}
                  disabled={processingPayment}
                  className={`w-full py-3 mb-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 rounded-xl font-bold text-lg shadow-lg ${
                    processingPayment
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:scale-105'
                  } transition-transform`}
                >
                  {processingPayment ? 'Processing...' : 'Enroll Now'}
                </button>
              )}

              <ul className="space-y-2 text-base text-slate-200 border-t border-indigo-800 pt-5">
                <li className="flex items-center gap-3">
                  <BadgeCheck size={20} className="text-emerald-400" />{' '}
                  Certificate of Completion
                </li>
                <li className="flex items-center gap-3">
                  <Smartphone size={18} className="text-pink-400" /> Access on
                  Mobile
                </li>
                <li className="flex items-center gap-3">
                  <Tv size={18} className="text-yellow-300" /> Watch on TV
                </li>
                <li className="flex items-center gap-3">
                  <Tag size={18} className="text-indigo-400" />{' '}
                  {course.category || 'General'}
                </li>
              </ul>
              <div className="text-emerald-400 text-xs mt-5 italic">
                30-day money back guarantee
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
