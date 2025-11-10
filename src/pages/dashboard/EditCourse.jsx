import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import courseService from '../../services/courseService';
import { useToast } from '../../components/ToastProvider';
import LazyImage from '../../components/LazyImage';

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { show } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    title: '',
    price: '',
    description: '',
    requirements: [],
    category: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await courseService.getCourseById(id);
        if (!mounted) return;
        const course = data?.course || data || {};
        setCurrentImage(course.image || null);
        setForm({
          title: course.title || '',
          price: course.price || '',
          description: course.description || '',
          requirements: Array.isArray(course.requirements)
            ? course.requirements
            : course.requirements
            ? [course.requirements]
            : [],
          category: course.category || ''
        });
      } catch (err) {
        console.error(err);
        setError(err?.message || 'Failed to load course');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleReqChange = (idx, value) => {
    setForm((s) => {
      const r = [...s.requirements];
      r[idx] = value;
      return { ...s, requirements: r };
    });
  };

  const addRequirement = () =>
    setForm((s) => ({ ...s, requirements: [...s.requirements, ''] }));
  const removeRequirement = (idx) =>
    setForm((s) => ({
      ...s,
      requirements: s.requirements.filter((_, i) => i !== idx)
    }));

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      // If an imageFile is selected, submit as FormData so the backend
      // upload middlewares run and set the course image.
      if (imageFile) {
        const fd = new FormData();
        fd.append('title', form.title);
        fd.append('price', form.price);
        fd.append('description', form.description);
        fd.append('requirements', JSON.stringify(form.requirements));
        fd.append('category', form.category);
        fd.append('image', imageFile);

        await courseService.updateMyCourse(id, fd);
      } else {
        // No new banner; send JSON payload
        const payload = {
          title: form.title,
          price: form.price,
          description: form.description,
          requirements: form.requirements,
          category: form.category
        };

        await courseService.updateMyCourse(id, payload);
      }
      show('Course updated', 'success');
      navigate('/dashboard/your-courses');
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Failed to update course');
      show(err?.message || 'Failed to update course', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-[40vh] w-full flex items-center justify-center bg-slate-900 text-indigo-200">
        Loading course...
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-950 py-10 px-2">
      <div className="w-full max-w-xl glass rounded-2xl shadow-2xl border border-indigo-700 bg-gradient-to-br from-indigo-900/90 to-slate-900/80 px-8 py-8 animate-fadeIn">
        <h2 className="text-3xl font-bold text-white mb-5 text-center">
          Edit Course
        </h2>
        {error && (
          <div className="mb-4 text-rose-400 text-center font-semibold">
            {String(error)}
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-base text-indigo-200 mb-2">
              Current Banner
            </label>
            <div className="mb-2">
              {currentImage ? (
                <LazyImage
                  src={currentImage}
                  alt="banner"
                  className="w-full h-40 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-40 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400">
                  No banner
                </div>
              )}
            </div>
            <label className="block text-base text-indigo-200 mb-2">
              Upload New Banner (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0] || null)}
              className="block w-full text-sm text-slate-300
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-600 file:text-white
                hover:file:bg-indigo-700"
            />
          </div>
          <div>
            <label className="block text-base text-indigo-200 mb-1">
              Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/70 border border-transparent rounded-lg outline-none transition ring-2 ring-indigo-900 focus:bg-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-white mb-0.5"
              placeholder="Course title"
            />
          </div>
          <div>
            <label className="block text-base text-indigo-200 mb-1">
              Price (₹)
            </label>
            <input
              name="price"
              value={form.price}
              type="number"
              min="0"
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/70 border border-transparent rounded-lg outline-none transition ring-2 ring-indigo-900 focus:bg-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-white mb-0.5"
              placeholder="Price in INR"
            />
          </div>
          <div>
            <label className="block text-base text-indigo-200 mb-1">
              Category
            </label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/70 border border-transparent rounded-lg outline-none transition ring-2 ring-indigo-900 focus:bg-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-white mb-0.5"
              placeholder="E.g. Web Development"
            />
          </div>
          <div>
            <label className="block text-base text-indigo-200 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-slate-900/70 border border-transparent rounded-lg outline-none transition ring-2 ring-indigo-900 focus:bg-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-white mb-0.5 resize-none"
              placeholder="Course description"
            />
          </div>
          <div>
            <label className="block text-base text-indigo-200 mb-2">
              Requirements
            </label>
            <div className="space-y-2 mb-1">
              {form.requirements.map((r, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    value={r}
                    onChange={(e) => handleReqChange(i, e.target.value)}
                    className="flex-1 px-4 py-2 bg-slate-900/70 border border-slate-800 rounded-lg text-white focus:bg-slate-800 focus:border-indigo-500 outline-none transition"
                    placeholder={`Requirement ${i + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeRequirement(i)}
                    className="px-3 py-2 bg-rose-600 rounded-lg text-white font-semibold shadow hover:scale-105 transition active:scale-100"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addRequirement}
                className="mt-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-500 text-white font-semibold rounded-lg shadow hover:scale-105 transition"
              >
                + Add Requirement
              </button>
            </div>
          </div>
          <div className="flex gap-3 pt-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`w-full py-3 rounded-lg font-bold transition shadow-lg ${
                saving
                  ? 'bg-slate-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-500 hover:scale-105'
              } text-lg text-white`}
            >
              {saving ? 'Saving...' : 'Update Course'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard/your-courses')}
              className="w-full py-3 rounded-lg font-semibold bg-slate-700 hover:bg-slate-800 text-white shadow"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
