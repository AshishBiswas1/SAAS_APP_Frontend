import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import courseService from '../services/courseService';
import { useToast } from '../components/ToastProvider';
import Navbar from '../components/Navbar';

export default function PostReview() {
  const { id } = useParams(); // course id
  const navigate = useNavigate();
  const { show } = useToast();
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSkip = () => {
    navigate('/');
  };

  const handlePost = async () => {
    setSubmitting(true);
    try {
      await courseService.createReview({
        course_id: id,
        rating,
        review: review || undefined
      });
      show('Review posted', 'success');
      navigate(`/course/${id}`);
    } catch (err) {
      console.error('Post review failed', err);
      const msg = err?.message || err?.error || err || 'Failed to post review';
      show(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen pt-20 bg-gradient-to-br from-[#041024] to-[#08142a] text-white">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-gradient-to-br from-slate-900/60 to-slate-800/40 border border-slate-700 rounded-2xl p-8 shadow-lg glass">
            <h2 className="text-2xl font-bold mb-3">Leave a review</h2>
            <p className="text-sm text-slate-300 mb-6">
              Thanks for completing the course — your feedback helps others and
              the instructor.
            </p>

            <div className="mb-4">
              <label className="block text-sm mb-2">Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full p-2 rounded bg-slate-900"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} star{r > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-2">
                Your review (optional)
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={6}
                className="w-full p-3 rounded bg-slate-900 text-slate-100"
                placeholder="Share what you liked or what could be improved..."
              ></textarea>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSkip}
                className="px-4 py-2 bg-slate-700 rounded text-sm"
              >
                Skip review
              </button>
              <button
                onClick={handlePost}
                disabled={submitting}
                className="ml-auto px-4 py-2 bg-emerald-600 rounded text-sm font-semibold"
              >
                {submitting ? 'Posting...' : 'Post review'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
