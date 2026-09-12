'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Volume1,
  Maximize2,
  Minimize2,
  RotateCcw,
  RotateCw,
  PictureInPicture2,
  Settings,
  AlertCircle,
  Loader2,
  Check,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface VideoPlayerProps {
  readonly src: string;
  readonly title?: string;
  readonly poster?: string;
  readonly autoPlay?: boolean;
  readonly preload?: 'none' | 'metadata' | 'auto';
  readonly className?: string;
  readonly onEnded?: () => void;
  readonly onProgressUpdate?: (currentTime: number, duration: number) => void;
}

const PLAYBACK_RATES = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  }
  return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}

/**
 * Derives a poster image automatically from Cloudinary video URLs if no poster was provided.
 * Prevents Cumulative Layout Shift (CLS) and blank black boxes before playback.
 */
function getDerivedPoster(src: string, customPoster?: string): string | undefined {
  if (customPoster) return customPoster;
  if (src.includes('res.cloudinary.com') && src.includes('/video/upload/')) {
    return src.replace(/\.(mp4|webm|mov|mkv|avi|m4v)(\?.*)?$/i, '.jpg$2');
  }
  return undefined;
}

/**
 * Detects YouTube or Vimeo URLs and extracts standard embed endpoints.
 */
function getEmbedUrl(url?: string | null): { type: 'youtube' | 'vimeo'; url: string } | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();

  // YouTube (watch, embed, short links, nocookie)
  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube-nocookie\.com\/embed\/)([^"&?/\s]{11})/i,
  );
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      url: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=0&rel=0&modestbranding=1`,
    };
  }

  // Vimeo
  const vimeoMatch = trimmed.match(
    /(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/i,
  );
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'vimeo',
      url: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  return null;
}

function EmbedVideoPlayer({
  url,
  title,
  className,
}: {
  readonly url: string;
  readonly title?: string;
  readonly className?: string;
}) {
  return (
    <div
      className={cn(
        'relative w-full aspect-video overflow-hidden rounded-2xl border border-border/80 bg-black shadow-2xl',
        className,
      )}
    >
      <iframe
        src={url}
        title={title || 'Course Video Stream'}
        className="h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}

function EmptyVideoPlaceholder({ className }: { readonly className?: string }) {
  return (
    <div
      className={cn(
        'relative w-full aspect-video overflow-hidden rounded-2xl border border-border/80 bg-card p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-3 shadow-xl',
        className,
      )}
    >
      <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center shadow-2xs">
        <Play className="h-6 w-6 fill-current ml-0.5" />
      </div>
      <div className="space-y-1 max-w-md">
        <h4 className="text-base font-bold text-foreground">No Video Attached</h4>
        <p className="text-xs text-muted-foreground">
          A video stream has not been uploaded for this lesson yet. Please review the reading notes
          or resources below.
        </p>
      </div>
    </div>
  );
}

function Html5VideoPlayer({
  src,
  title,
  poster,
  autoPlay = false,
  preload = 'metadata',
  className,
  onEnded,
  onProgressUpdate,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrubberRef = useRef<HTMLDivElement>(null);
  const hideControlsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hudTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPiPAvailable] = useState(
    () =>
      typeof document !== 'undefined' &&
      'pictureInPictureEnabled' in document &&
      Boolean(document.pictureInPictureEnabled),
  );
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [hudMessage, setHudMessage] = useState<string | null>(null);

  // Hover scrubber timestamp preview
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const [hoverTime, setHoverTime] = useState<number | null>(null);

  const derivedPoster = useMemo(() => getDerivedPoster(src, poster), [src, poster]);

  // Detect external embed platforms (YouTube / Vimeo)
  const isEmbed =
    src.includes('youtube.com') || src.includes('youtu.be') || src.includes('vimeo.com');

  const triggerHud = (message: string) => {
    setHudMessage(message);
    if (hudTimerRef.current) clearTimeout(hudTimerRef.current);
    hudTimerRef.current = setTimeout(() => setHudMessage(null), 1100);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (hideControlsTimerRef.current) {
      clearTimeout(hideControlsTimerRef.current);
    }
    if (isPlaying) {
      hideControlsTimerRef.current = setTimeout(() => {
        if (!showSettings) {
          setShowControls(false);
        }
      }, 2500);
    }
  };

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play();
      setIsPlaying(true);
      triggerHud('Play');
    } else {
      video.pause();
      setIsPlaying(false);
      triggerHud('Pause');
    }
  }, []);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    const video = videoRef.current;
    if (video) {
      video.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const handleScrubberMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = scrubberRef.current?.getBoundingClientRect();
    if (!rect || duration <= 0) return;
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const ratio = x / rect.width;
    setHoverPosition(x);
    setHoverTime(ratio * duration);
  };

  const handleScrubberMouseLeave = () => {
    setHoverPosition(null);
    setHoverTime(null);
  };

  const skipTime = useCallback((offsetSeconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    const newTime = Math.max(0, Math.min(video.duration || 0, video.currentTime + offsetSeconds));
    video.currentTime = newTime;
    setCurrentTime(newTime);
    triggerHud(`${offsetSeconds > 0 ? '+' : ''}${offsetSeconds}s`);
  }, []);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
      setIsMuted(newVol === 0);
    }
  };

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const nextMute = !isMuted;
    video.muted = nextMute;
    setIsMuted(nextMute);
    triggerHud(nextMute ? 'Muted' : 'Unmuted');
  }, [isMuted]);

  const handleRateChange = (rate: number) => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = rate;
      setPlaybackRate(rate);
      setShowSettings(false);
      triggerHud(`${rate}x Speed`);
    }
  };

  const togglePiP = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch (err) {
      console.warn('Picture-in-picture error:', err);
    }
  };

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      void container.requestFullscreen();
      setIsFullscreen(true);
      triggerHud('Fullscreen');
    } else {
      void document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Keyboard shortcut support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA') return;

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'arrowleft':
        case 'j':
          e.preventDefault();
          skipTime(-5);
          break;
        case 'arrowright':
        case 'l':
          e.preventDefault();
          skipTime(5);
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'arrowup':
          e.preventDefault();
          if (videoRef.current) {
            const nextVol = Math.min(1, videoRef.current.volume + 0.1);
            videoRef.current.volume = nextVol;
            setVolume(nextVol);
            triggerHud(`Volume ${Math.round(nextVol * 100)}%`);
          }
          break;
        case 'arrowdown':
          e.preventDefault();
          if (videoRef.current) {
            const nextVol = Math.max(0, videoRef.current.volume - 0.1);
            videoRef.current.volume = nextVol;
            setVolume(nextVol);
            triggerHud(`Volume ${Math.round(nextVol * 100)}%`);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, skipTime, toggleMute, toggleFullscreen]);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    onProgressUpdate?.(video.currentTime, video.duration || 0);

    if (video.buffered.length > 0) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      setBuffered(bufferedEnd);
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration);
    setHasError(false);
    setIsBuffering(false);
  };

  // Embed Renderer (YouTube / Vimeo)
  if (isEmbed) {
    let embedUrl = src;
    if (src.includes('watch?v=')) {
      embedUrl = src.replace('watch?v=', 'embed/');
    } else if (src.includes('youtu.be/')) {
      embedUrl = src.replace('youtu.be/', 'www.youtube.com/embed/');
    }

    return (
      <div
        className={cn(
          'relative aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-2xl border border-border/80',
          className,
        )}
      >
        <iframe
          src={embedUrl}
          title={title || 'Lecture Video'}
          className="h-full w-full border-0"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPercent = duration > 0 ? (buffered / duration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onDoubleClick={toggleFullscreen}
      className={cn(
        'group relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-950 select-none shadow-2xl border border-border/80 transition-all focus-within:ring-2 focus-within:ring-primary/40',
        isFullscreen ? 'rounded-none border-0' : '',
        className,
      )}
      role="region"
      aria-label={title || 'Video Player'}
    >
      {/* HTML5 Video Element with Next.js Best Practices */}
      <video
        ref={videoRef}
        src={src}
        poster={derivedPoster}
        autoPlay={autoPlay}
        preload={preload}
        playsInline
        controlsList="nodownload"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => {
          setIsBuffering(false);
          setIsPlaying(true);
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          onEnded?.();
        }}
        onError={() => {
          setHasError(true);
          setIsBuffering(false);
        }}
        className="h-full w-full object-contain cursor-pointer bg-slate-950"
      >
        Your browser does not support HTML5 video playback.
      </video>

      {/* Buffering Indicator */}
      {isBuffering && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] z-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}

      {/* Keyboard Shortcut HUD Feedback Toast */}
      {hudMessage && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-30">
          <div className="animate-in fade-in zoom-in-95 rounded-full bg-slate-900/90 px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-2xl backdrop-blur-md border border-white/10">
            {hudMessage}
          </div>
        </div>
      )}

      {/* Playback Error Fallback */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/95 p-6 text-center z-30">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <h4 className="text-sm font-bold text-white">Video Stream Unavailable</h4>
          <p className="max-w-md text-xs text-muted-foreground">
            Unable to stream this video file. It may still be transcoding or the CDN URL is invalid.
          </p>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.load();
                setHasError(false);
              }
            }}
          >
            Retry Stream
          </Button>
        </div>
      )}

      {/* Center Play Button on Pause */}
      {!isPlaying && !isBuffering && !hasError && (
        <button
          type="button"
          onClick={togglePlay}
          className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-2xl backdrop-blur-sm transition-all hover:scale-110 hover:bg-primary z-20"
          aria-label="Play video"
        >
          <Play className="h-7 w-7 fill-current ml-1" />
        </button>
      )}

      {/* Top Header Overlay Bar */}
      <div
        className={cn(
          'pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent p-4 transition-opacity duration-300',
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0',
        )}
      >
        <div className="flex items-center gap-2 max-w-[70%]">
          {title && (
            <h3 className="text-xs sm:text-sm font-semibold text-white truncate shadow-sm">
              {title}
            </h3>
          )}
        </div>

        <Badge
          variant="outline"
          className="border-white/20 text-white/90 bg-black/40 text-[10px] backdrop-blur-sm"
        >
          <Sparkles className="h-3 w-3 mr-1 text-primary" />
          HD Stream
        </Badge>
      </div>

      {/* Bottom Controls Bar */}
      <div
        className={cn(
          'absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end bg-gradient-to-t from-black/95 via-black/70 to-transparent px-4 pb-3.5 pt-10 transition-opacity duration-300',
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
      >
        {/* Scrubber Timeline with Hover Tooltip */}
        <div
          ref={scrubberRef}
          onMouseMove={handleScrubberMouseMove}
          onMouseLeave={handleScrubberMouseLeave}
          className="group/scrub relative flex items-center h-5 cursor-pointer"
        >
          {/* Hover Time Tooltip */}
          {hoverPosition !== null && hoverTime !== null && (
            <div
              className="pointer-events-none absolute -top-8 -translate-x-1/2 rounded-md bg-slate-900/95 px-2 py-0.5 text-[10px] font-mono font-bold text-white shadow-lg border border-white/10 backdrop-blur-sm z-30"
              style={{ left: `${hoverPosition}px` }}
            >
              {formatTime(hoverTime)}
            </div>
          )}

          {/* Track Frame */}
          <div className="relative h-1.5 w-full rounded-full bg-white/20 transition-all group-hover/scrub:h-2">
            {/* Buffered Progress */}
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-white/40 transition-all"
              style={{ width: `${bufferedPercent}%` }}
            />
            {/* Played Progress */}
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-primary transition-all shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
            aria-label="Seek video progress"
          />
        </div>

        {/* Action Controls Row */}
        <div className="mt-2.5 flex items-center justify-between text-white text-xs">
          {/* Left Controls: Play/Pause, Rewind, Forward, Volume, Time */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={togglePlay}
              className="rounded-lg p-1.5 hover:bg-white/15 transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4 fill-current" />
              )}
            </button>

            <button
              type="button"
              onClick={() => skipTime(-10)}
              className="rounded-lg p-1.5 hover:bg-white/15 transition-colors hidden sm:block"
              title="Rewind 10s"
              aria-label="Rewind 10 seconds"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => skipTime(10)}
              className="rounded-lg p-1.5 hover:bg-white/15 transition-colors hidden sm:block"
              title="Forward 10s"
              aria-label="Forward 10 seconds"
            >
              <RotateCw className="h-4 w-4" />
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-1.5 group/vol">
              <button
                type="button"
                onClick={toggleMute}
                className="rounded-lg p-1.5 hover:bg-white/15 transition-colors"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4 text-rose-400" />
                ) : volume < 0.5 ? (
                  <Volume1 className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>

              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-14 sm:w-20 h-1 accent-primary bg-white/20 rounded-full cursor-pointer transition-all"
                aria-label="Volume slider"
              />
            </div>

            {/* Current / Duration Time */}
            <span className="font-mono text-[11px] text-white/80 select-none ml-1">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Right Controls: Speed Selector, PiP, Fullscreen */}
          <div className="relative flex items-center gap-1.5 sm:gap-2">
            {/* Speed Settings Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSettings((prev) => !prev)}
                className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold hover:bg-white/15 transition-colors border border-white/10 bg-white/5"
                title="Playback Speed"
                aria-label="Playback speed"
              >
                <Settings className="h-3.5 w-3.5" />
                <span>{playbackRate}x</span>
              </button>

              {showSettings && (
                <div className="absolute bottom-9 right-0 z-40 w-36 rounded-xl border border-white/15 bg-slate-900/95 p-1.5 shadow-2xl backdrop-blur-md">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-white/10 mb-1">
                    Playback Speed
                  </div>
                  {PLAYBACK_RATES.map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => handleRateChange(rate)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-lg px-2.5 py-1 text-xs transition-colors',
                        playbackRate === rate
                          ? 'bg-primary/20 text-primary font-bold'
                          : 'text-white/80 hover:bg-white/10',
                      )}
                    >
                      <span>{rate === 1.0 ? '1.0x (Normal)' : `${rate}x`}</span>
                      {playbackRate === rate && <Check className="h-3.5 w-3.5" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Picture in Picture */}
            {isPiPAvailable && (
              <button
                type="button"
                onClick={togglePiP}
                className="rounded-lg p-1.5 hover:bg-white/15 transition-colors hidden sm:block"
                title="Picture-in-Picture"
                aria-label="Picture in Picture"
              >
                <PictureInPicture2 className="h-4 w-4" />
              </button>
            )}

            {/* Fullscreen */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="rounded-lg p-1.5 hover:bg-white/15 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VideoPlayer(props: VideoPlayerProps) {
  const { src, title, className } = props;
  const embed = useMemo(() => getEmbedUrl(src), [src]);

  if (embed) {
    return <EmbedVideoPlayer url={embed.url} title={title} className={className} />;
  }

  if (!src || !src.trim()) {
    return <EmptyVideoPlaceholder className={className} />;
  }

  return <Html5VideoPlayer {...props} />;
}
