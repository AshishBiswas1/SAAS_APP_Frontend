import React, { useEffect, useState } from 'react';
import reviewService from '../../services/reviewService';
import { useToast } from '../../components/ToastProvider';
import { format } from 'date-fns';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editText, setEditText] = useState('');
  const { show } = useToast();

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await reviewService.getMyReviews();
        if (!mounted) return;
        setReviews(data || []);
      } catch (err) {
        console.error('Failed to load reviews', err);
        show('Failed to load reviews', 'error');
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  const startEdit = (r) => {
    setEditingId(r.review_id);
    setEditRating(Number(r.rating) || 5);
    setEditText(r.review || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const saveEdit = async (id) => {
    try {
      await reviewService.updateReview(id, {
        rating: editRating,
        review: editText
      });
      setReviews((prev) =>
        prev.map((r) =>
          r.review_id === id
            ? { ...r, rating: editRating, review: editText }
            : r
        )
      );
      show('Review updated', 'success');
      cancelEdit();
    } catch (err) {
      console.error('Update failed', err);
      show(err?.message || 'Failed to update', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this review?')) return;
    try {
      await reviewService.deleteReview(id);
      setReviews((prev) => prev.filter((r) => r.review_id !== id));
      show('Review deleted', 'success');
    } catch (err) {
      console.error('Delete failed', err);
      show(err?.message || 'Failed to delete', 'error');
    }
  };

  if (loading) return <div>Loading your reviews...</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold mb-2">Your Reviews</h3>
      {reviews.length === 0 ? (
        <div className="p-6 bg-slate-800 rounded">
          You haven't posted any reviews yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reviews.map((r) => (
            <div
              key={r.review_id}
              className="p-4 bg-gradient-to-br from-slate-900/60 to-slate-800/40 border border-slate-700 rounded-2xl shadow glass flex flex-col md:flex-row gap-4"
            >
              <div
                className="w-24 h-24 bg-cover rounded-md overflow-hidden flex-shrink-0"
                style={{
                  backgroundImage: `url(${
                    r.courses?.image || '/placeholder.png'
                  })`
                }}
              />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold">
                      {r.courses?.title || 'Course'}
                    </div>
                    <div className="text-xs text-slate-400">
                      Posted: {format(new Date(r.created_at), 'PPP p')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">{r.rating}★</div>
                  </div>
                </div>

                <div className="mt-3">
                  {editingId === r.review_id ? (
                    <div className="space-y-2">
                      <select
                        value={editRating}
                        onChange={(e) => setEditRating(Number(e.target.value))}
                        className="p-2 rounded bg-slate-900"
                      >
                        {[5, 4, 3, 2, 1].map((n) => (
                          <option key={n} value={n}>
                            {n} star{n > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                      <textarea
                        rows={4}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full p-2 rounded bg-slate-900"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEdit(r.review_id)}
                          className="px-3 py-1 bg-emerald-600 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="px-3 py-1 bg-slate-700 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-200 whitespace-pre-wrap">
                      {r.review || (
                        <span className="text-slate-400">(No review text)</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-3 flex gap-2">
                  {editingId !== r.review_id && (
                    <>
                      <button
                        onClick={() => startEdit(r)}
                        className="px-3 py-1 bg-indigo-600 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(r.review_id)}
                        className="px-3 py-1 bg-red-600 rounded"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
