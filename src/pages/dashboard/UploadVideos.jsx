import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import videoService from '../../services/videoService';
import { useToast } from '../../components/ToastProvider';

export default function UploadVideos() {
  const { id } = useParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { show } = useToast();

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await videoService.getVideosByCourse(id);
        if (!mounted) return;
        setVideos(data || []);
      } catch (err) {
        console.error('Failed to load videos', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [id]);

  const handleFileChange = (e) => setFile(e.target.files[0] || null);

  const handleUpload = async () => {
    if (!file) {
      show('Please select a video file', 'error');
      return;
    }
    setUploading(true);
    setProgress(0);
    try {
      await videoService.uploadVideo({
        courseId: id,
        file,
        title,
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
        }
      });
      setTitle('');
      setFile(null);
      // Refresh list
      const data = await videoService.getVideosByCourse(id);
      setVideos(data || []);
      show('Video uploaded', 'success');
    } catch (err) {
      console.error(err);
      show(err?.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-white">Upload Videos</h2>

      {/* Upload Section */}
      <div className="bg-gradient-to-br from-slate-900/70 to-slate-900/80 border border-indigo-800 rounded-2xl p-6 shadow-2xl mb-8 glass">
        <div className="mb-4">
          <label className="block text-base text-indigo-200 mb-1">
            Video Title (optional)
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-slate-900/70 border border-transparent rounded-lg outline-none transition ring-2 ring-indigo-900 focus:bg-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-white"
            placeholder="Enter video title"
          />
        </div>
        <div className="mb-4">
          <label className="block text-base text-indigo-200 mb-1">
            Select Video File
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-300
              file:mr-3 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-xs file:font-semibold
              file:bg-indigo-600 file:text-white
              hover:file:bg-indigo-700"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={`px-5 py-3 rounded-lg font-bold transition shadow-lg ${
              uploading
                ? 'bg-slate-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-500 hover:scale-105'
            } text-lg text-white`}
          >
            {uploading ? `Uploading (${progress}%)` : 'Upload Video'}
          </button>
          <div className="text-sm text-slate-400">Max size: 100MB</div>
        </div>
        {uploading && (
          <div className="mt-4">
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-2 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Existing Videos */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-white">
          Existing Videos
        </h3>
        {loading ? (
          <div className="text-slate-400 text-center py-12">Loading...</div>
        ) : videos.length === 0 ? (
          <div className="text-slate-400 text-center py-12">
            No videos uploaded yet.
          </div>
        ) : (
          <div className="space-y-4">
            {videos.map((v) => (
              <div
                key={v.video_id}
                className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-tr from-[#1e2137] via-[#232b4d] to-[#232043] border border-indigo-800/40 shadow-md rounded-2xl p-6 hover:shadow-lg hover:border-indigo-500 transition animate-fadeIn"
              >
                <div className="flex items-center space-x-4 w-full md:w-auto">
                  <div className="min-w-[58px] min-h-[58px] max-w-[58px] max-h-[58px] rounded-xl overflow-hidden shadow ring-2 ring-indigo-700 bg-slate-800 flex items-center justify-center">
                    <span className="text-lg text-indigo-300 font-bold">V</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="text-lg font-bold text-indigo-100 truncate">
                      {v.video_title}
                    </div>
                    <div className="text-sm text-slate-400 mt-1">
                      Duration: {v.video_duration}s
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex-shrink-0">
                  <a
                    href={v.video_url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold shadow hover:scale-[1.04] transition"
                  >
                    View
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
