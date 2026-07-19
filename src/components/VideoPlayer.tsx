import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  SkipForward,
  RotateCcw,
  Settings,
  Tv
} from "lucide-react";

interface VideoPlayerProps {
  src: string;
  poster: string;
  title: string;
  onNext?: () => void;
}

export default function VideoPlayer({ src, poster, title, onNext }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [autoplay, setAutoplay] = useState(true);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);

  // Playback Speeds
  const speeds = [0.5, 1, 1.25, 1.5, 2];

  // Auto-hide controls timeout
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [isPlaying]);

  // Handle src changes (reset state for new video)
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    
    // Autoplay logic
    if (autoplay && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.log("Autoplay was blocked or interrupted:", error);
          });
      }
    }
  }, [src, autoplay]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const seekTime = parseFloat(e.target.value);
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    videoRef.current.volume = newVol;
    setIsMuted(newVol === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const muted = !isMuted;
    setIsMuted(muted);
    videoRef.current.muted = muted;
  };

  const handleSpeedChange = (speed: number) => {
    if (!videoRef.current) return;
    setPlaybackSpeed(speed);
    videoRef.current.playbackRate = speed;
    setShowSpeedMenu(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    if (autoplay && onNext) {
      onNext();
    }
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden group border border-gray-800 shadow-xl"
    >
      {/* HTML5 Video Tag */}
      <video
        ref={videoRef}
        src={src || undefined}
        poster={poster || undefined}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleVideoEnded}
        onClick={togglePlay}
        className="w-full h-full object-contain cursor-pointer"
        playsInline
      >
      </video>

      {/* Subtitles Overlay */}
      {subtitlesEnabled && isPlaying && currentTime > 2 && currentTime < 10 && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-lg text-sm font-semibold tracking-wide pointer-events-none text-center shadow-md animate-fade-in border border-gray-700">
          {title} - উপভোগ করুন অসাধারণ স্ট্রিমিং অভিজ্ঞতা! 🎬
        </div>
      )}

      {/* Center Big Play Button (shows briefly on pause) */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-indigo-600/90 hover:bg-indigo-500 text-white flex items-center justify-center shadow-2xl transition-all transform hover:scale-115"
          title="প্লে করুন"
        >
          <Play size={32} className="ml-1" />
        </button>
      )}

      {/* Playback Controls Overlay */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 flex flex-col gap-3 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Seek Progress Bar */}
        <div className="flex items-center gap-3 w-full group/seek">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-500 group-hover/seek:h-2 transition-all"
          />
        </div>

        {/* Lower Control Buttons Panel */}
        <div className="flex items-center justify-between w-full text-white text-sm">
          {/* Left Buttons: Play/Pause, Duration, Volume */}
          <div className="flex items-center gap-4">
            <button
              onClick={togglePlay}
              className="hover:text-indigo-400 transition-colors cursor-pointer"
              title={isPlaying ? "পজ" : "প্লে"}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            {onNext && (
              <button
                onClick={onNext}
                className="hover:text-indigo-400 transition-colors cursor-pointer"
                title="পরবর্তী ভিডিও"
              >
                <SkipForward size={20} />
              </button>
            )}

            {/* Time Indicator */}
            <span className="font-mono text-xs text-gray-300">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            {/* Volume controls */}
            <div className="flex items-center gap-2 group/volume">
              <button
                onClick={toggleMute}
                className="hover:text-indigo-400 transition-colors cursor-pointer"
                title={isMuted ? "আনমিউট" : "মিউট"}
              >
                {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white transition-all group-hover/volume:w-20"
              />
            </div>
          </div>

          {/* Right Buttons: Speed, Autoplay Toggle, Subtitles, Screen */}
          <div className="flex items-center gap-4 relative">
            {/* Speed Settings */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="flex items-center gap-1 hover:text-indigo-400 transition-colors text-xs font-semibold uppercase bg-gray-800/60 px-2 py-1 rounded cursor-pointer"
                title="প্লেব্যাক স্পিড"
              >
                <Settings size={14} />
                {playbackSpeed === 1 ? "সাধারণ" : `${playbackSpeed}x`}
              </button>

              {showSpeedMenu && (
                <div className="absolute bottom-8 right-0 bg-gray-900 border border-gray-800 rounded-lg shadow-2xl py-1 w-24 flex flex-col z-50 text-xs">
                  {speeds.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSpeedChange(s)}
                      className={`text-left px-3 py-1.5 hover:bg-indigo-600 transition-colors ${
                        playbackSpeed === s ? "text-indigo-400 font-bold" : "text-gray-300"
                      }`}
                    >
                      {s === 1 ? "Normal" : `${s}x`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Subtitle Toggle button */}
            <button
              onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
              className={`text-xs font-bold px-2 py-1 rounded transition-colors ${
                subtitlesEnabled ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400"
              }`}
              title="সাবটাইটেল চালু/বন্ধ করুন"
            >
              CC
            </button>

            {/* Autoplay setting */}
            <button
              onClick={() => setAutoplay(!autoplay)}
              className={`text-xs font-bold px-2 py-1 rounded transition-colors flex items-center gap-1 ${
                autoplay ? "bg-emerald-600/90 text-white" : "bg-gray-800 text-gray-400"
              }`}
              title="পরবর্তী ভিডিও অটো-প্লে"
            >
              <Tv size={12} />
              {autoplay ? "অটো: চালু" : "অটো: বন্ধ"}
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="hover:text-indigo-400 transition-colors cursor-pointer"
              title="ফুল স্ক্রিন"
            >
              <Maximize2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
