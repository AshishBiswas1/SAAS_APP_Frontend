import React, { useState } from 'react';
import courseService from '../../services/courseService';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/ToastProvider';

export default function CreateCourse() {
  const { show } = useToast();

  const [form, setForm] = useState({
    title: '',
    price: '',
    description: '',
    requirements: [''],
    category: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleReqChange = (idx, value) => {
    const r = [...form.requirements];
    r[idx] = value;
    setForm({ ...form, requirements: r });
  };

  const addReq = () =>
    setForm({ ...form, requirements: [...form.requirements, ''] });

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = new FormData();
      data.append('title', form.title);
      data.append('price', form.price);
      data.append('description', form.description);
      data.append('requirements', JSON.stringify(form.requirements));
      data.append('category', form.category);
      if (imageFile) data.append('image', imageFile);

      await courseService.createCourse(data);
      show('Course created', 'success');
      navigate('/dashboard/your-courses');
    } catch (err) {
      show(err?.message || 'Failed to create course', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 py-10 px-2">
      <div className="w-full max-w-lg bg-gradient-to-br from-indigo-900/95 to-slate-800/90 border border-indigo-700 shadow-xl rounded-2xl p-8 backdrop-blur-sm animate-fadeIn">
        <h2 className="text-3xl font-bold text-white mb-5 text-center">
          Create a New Course
        </h2>
        <div className="space-y-5">
          <div>
            <label className="block text-base text-indigo-200 mb-1">
              Title
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/70 border border-transparent rounded-lg outline-none transition ring-2 ring-indigo-900 focus:bg-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-white mb-0.5"
              placeholder="Enter course title"
            />
          </div>
          <div>
            <label className="block text-base text-indigo-200 mb-1">
              Price (₹)
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-900/70 border border-transparent rounded-lg outline-none transition ring-2 ring-indigo-900 focus:bg-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-white mb-0.5"
              min={0}
              placeholder="Enter price"
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
              placeholder="Web Development, Data Science, etc."
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
              placeholder="Describe the course..."
            />
          </div>
          <div>
            <label className="block text-base text-indigo-200 mb-2">
              Requirements
            </label>
            <div className="space-y-2 mb-1">
              {form.requirements.map((r, i) => (
                <input
                  key={i}
                  value={r}
                  onChange={(e) => handleReqChange(i, e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900/70 border border-slate-800 rounded-lg text-white focus:bg-slate-800 focus:border-indigo-500 outline-none transition"
                  placeholder={`Requirement ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={addReq}
              className="mt-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-500 text-white font-semibold rounded-lg shadow hover:scale-105 transition"
            >
              + Add Requirement
            </button>
          </div>
          <div>
            <label className="block text-base text-indigo-200 mb-2">
              Banner Image (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="block w-full text-sm text-slate-300
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-600 file:text-white
                hover:file:bg-indigo-700"
            />
          </div>
          <div className="pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`w-full py-3 rounded-lg font-bold transition shadow-lg
                ${
                  saving
                    ? 'bg-slate-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-500 hover:scale-105'
                } text-lg text-white`}
            >
              {saving ? 'Saving...' : 'Create Course'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
