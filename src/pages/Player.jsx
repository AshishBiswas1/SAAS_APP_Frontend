import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import videoService from '../services/videoService';
import authService from '../services/authService';
import courseService from '../services/courseService';
import { generateCertificateBlob } from '../utils/certificate';
import { useToast } from '../components/ToastProvider';
import Navbar from '../components/Navbar';
import { Play, Pause, Volume2, Maximize2, Minimize2 } from 'lucide-react';

function formatTime(s = 0) {
  const sec = Math.floor(Number(s) || 0);
  const m = Math.floor(sec / 60);
  const r = sec % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
}

export default function Player() {
  const { courseId, videoId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);
  const [videos, setVideos] = useState([]);
  const [current, setCurrent] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { show } = useToast();

  // track last progress update sent to backend (seconds)
  const lastSentRef = useRef(0);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await videoService.getVideosWithProgress(courseId);
        if (!mounted) return;
        setVideos(data || []);
        // choose initial video: passed videoId or first
        const find =
          (data || []).find((v) => v.video_id === videoId) || (data || [])[0];
        setCurrent(find || null);
      } catch (err) {
        console.error(err);
      }
    }
    load();
    return () => (mounted = false);
  }, [courseId, videoId]);

  useEffect(() => {
    if (!current || !videoRef.current) return;
    const vEl = videoRef.current;
    vEl.src = current.video_url;
    vEl.load();
    vEl.pause();
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [current]);

  useEffect(() => {
    const vEl = videoRef.current;
    if (!vEl) return;
    const onLoaded = () => {
      setDuration(vEl.duration || 0);
      // if user has progress for this video, resume from that time
      try {
        const prog = current?.progress?.watched_seconds;
        if (prog && prog > 0) {
          // guard: if prog is within duration
          const seekTo = Math.min(prog, Math.max(0, vEl.duration - 1));
          vEl.currentTime = seekTo;
          setCurrentTime(seekTo);
        }
      } catch (e) {
        // ignore
      }
    };

    // track percent thresholds (25/50/75/100)
    const sentPercents = new Set();

    const onTime = () => {
      setCurrentTime(vEl.currentTime || 0);
      const now = Math.floor(vEl.currentTime || 0);
      const dur = Math.floor(vEl.duration || 0) || 1;
      const pct = Math.floor((now / dur) * 100);

      // at each 25% increment send progress once
      [25, 50, 75, 100].forEach((threshold) => {
        if (pct >= threshold && !sentPercents.has(threshold)) {
          // don't send updates if this video is already completed
          if (current?.progress?.status === 'completed') {
            sentPercents.add(threshold); // mark as sent locally to avoid retries
            return;
          }
          sentPercents.add(threshold);
          const payload = {
            status: threshold === 100 ? 'completed' : 'in_progress',
            watched_seconds: now
          };
          // If already completed on server, backend upsert will keep it; we still skip if local progress says completed
          videoService
            .updateVideoProgress(current.video_id, payload)
            .catch(() => {});
        }
      });

      // periodic backup every 10s as well
      if (now - lastSentRef.current >= 10) {
        lastSentRef.current = now;
        // skip periodic backup if already completed
        if (current?.progress?.status !== 'completed') {
          videoService
            .updateVideoProgress(current.video_id, {
              status: 'in_progress',
              watched_seconds: now
            })
            .catch(() => {});
        }
      }
    };

    const onPause = () => {
      const now = Math.floor(vEl.currentTime || 0);
      // don't downgrade a completed video to paused
      if (current?.progress?.status === 'completed') return;
      videoService
        .updateVideoProgress(current.video_id, {
          status: 'paused',
          watched_seconds: now
        })
        .catch(() => {});
    };

    const onEnd = () => {
      setPlaying(false);
      // mark completed
      videoService
        .updateVideoProgress(current.video_id, {
          status: 'completed',
          watched_seconds: Math.floor(vEl.duration || 0)
        })
        .catch(() => {});
    };

    vEl.addEventListener('loadedmetadata', onLoaded);
    vEl.addEventListener('timeupdate', onTime);
    vEl.addEventListener('pause', onPause);
    vEl.addEventListener('ended', onEnd);

    return () => {
      vEl.removeEventListener('loadedmetadata', onLoaded);
      vEl.removeEventListener('timeupdate', onTime);
      vEl.removeEventListener('pause', onPause);
      vEl.removeEventListener('ended', onEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const togglePlay = async () => {
    const vEl = videoRef.current;
    if (!vEl) return;
    if (vEl.paused) {
      try {
        await vEl.play();
        setPlaying(true);
      } catch (err) {
        console.error('Play failed', err);
      }
    } else {
      vEl.pause();
      setPlaying(false);
    }
  };

  const enterFullscreen = () => {
    // Prefer making the whole player container (video + controls) fullscreen
    const targetEl = playerContainerRef.current || videoRef.current;
    if (!targetEl) return;
    try {
      const fsEl =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;
      if (fsEl) {
        // exit fullscreen
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
      } else {
        if (targetEl.requestFullscreen) targetEl.requestFullscreen();
        else if (targetEl.webkitRequestFullscreen)
          targetEl.webkitRequestFullscreen();
        else if (targetEl.mozRequestFullScreen) targetEl.mozRequestFullScreen();
        else if (targetEl.msRequestFullscreen) targetEl.msRequestFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen request failed', err);
    }
  };

  const onSeek = (e) => {
    const vEl = videoRef.current;
    if (!vEl) return;
    const val = Number(e.target.value);
    vEl.currentTime = val;
    setCurrentTime(val);
  };

  const onVolume = (e) => {
    const vEl = videoRef.current;
    if (!vEl) return;
    const val = Number(e.target.value);
    vEl.volume = val;
    setVolume(val);
  };

  useEffect(() => {
    const onFsChange = () => {
      const fsEl =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;
      const entering = Boolean(fsEl);
      setIsFullscreen(entering);
      try {
        if (videoRef.current) {
          if (entering) {
            // make video fill the available height inside fullscreen container
            videoRef.current.style.height = 'calc(100vh - 120px)';
            videoRef.current.style.objectFit = 'contain';
          } else {
            // reset to original
            videoRef.current.style.height = '480px';
            videoRef.current.style.objectFit = '';
          }
        }
      } catch (e) {
        // ignore
      }
    };

    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);
    document.addEventListener('mozfullscreenchange', onFsChange);
    document.addEventListener('MSFullscreenChange', onFsChange);

    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('webkitfullscreenchange', onFsChange);
      document.removeEventListener('mozfullscreenchange', onFsChange);
      document.removeEventListener('MSFullscreenChange', onFsChange);
    };
  }, []);

  const selectVideo = (v) => {
    if (!v) return;
    setCurrent(v);
    // update URL
    navigate(`/learn/${courseId}/video/${v.video_id}`, { replace: true });
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen pt-20 bg-gradient-to-br from-[#061026] to-[#0f1730] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Player Column */}
          <div
            ref={playerContainerRef}
            className="lg:col-span-2 bg-slate-900 rounded shadow p-4"
          >
            <div className="w-full bg-black rounded overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-[480px] bg-black"
                controls={false}
                playsInline
                controlsList="nodownload"
              />
            </div>

            {/* Custom controls */}
            <div className="mt-3 flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlay}
                  className="p-2 bg-indigo-600 rounded"
                >
                  {playing ? <Pause /> : <Play />}
                </button>

                <div className="flex-1">
                  <input
                    type="range"
                    min={0}
                    max={Math.floor(duration || 0)}
                    value={Math.floor(currentTime || 0)}
                    onChange={onSeek}
                    className="w-full"
                  />
                  <div className="text-xs text-slate-400 flex justify-between mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Volume2 />
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={onVolume}
                  />
                  <button onClick={enterFullscreen} className="p-2">
                    {isFullscreen ? <Minimize2 /> : <Maximize2 />}
                  </button>
                </div>
              </div>

              <div className="text-sm text-slate-300">
                {current?.video_title || 'Select a lecture'}
              </div>
            </div>
          </div>

          {/* Playlist Column */}
          <aside className="bg-slate-900 rounded p-3 h-[560px] overflow-auto">
            <div className="font-semibold mb-4">Lectures</div>
            <div className="space-y-2">
              {videos.map((v) => (
                <div
                  key={v.video_id}
                  className={`p-3 rounded cursor-pointer hover:bg-slate-800 flex justify-between items-center ${
                    current?.video_id === v.video_id
                      ? 'bg-indigo-700/40'
                      : 'bg-slate-800/20'
                  }`}
                  onClick={() => selectVideo(v)}
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium">{v.video_title}</div>
                    <div className="text-xs text-slate-400">
                      {formatTime(v.video_duration)}
                    </div>
                  </div>
                  <div className="ml-3 text-xs text-slate-200">
                    {v.progress && v.progress.status !== 'not_started'
                      ? v.progress.status
                      : ''}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>

        {/* Certificate CTA */}
        {videos.length > 0 &&
          videos.every((v) => v.progress?.status === 'completed') && (
            <div className="max-w-7xl mx-auto px-4 py-6">
              <button
                onClick={async () => {
                  try {
                    const me = await authService.getMe();
                    const course = await courseService.getCourseById(courseId);
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
                    a.download = `certificate-${safeName}-${courseId}.png`;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                    show('Certificate generated & downloaded', 'success');
                  } catch (e) {
                    console.error('Certificate generation failed', e);
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
  );
}
