import React from 'react';
import {
  ArrowDown,
  ArrowUp,
  Check,
  ListOrdered,
  Plus,
  Repeat,
  Trash2,
  Video,
} from 'lucide-react';
import { Language, PlaybackMode, VideoItem } from '../types';
import { translations } from '../i18n/translations';

interface PlaybackModeSelectorProps {
  lang: Language;
  mode: PlaybackMode;
  onModeChange: (mode: PlaybackMode) => void;
  videos: VideoItem[];
  activeVideoId: string | null;
  onSelectActiveVideo: (id: string) => void;
  onReorderPlaylist: (fromIndex: number, toIndex: number) => void;
  onDeleteVideo: (id: string) => void;
  onUploadClick: () => void;
}

export const PlaybackModeSelector: React.FC<PlaybackModeSelectorProps> = ({
  lang,
  mode,
  onModeChange,
  videos,
  activeVideoId,
  onSelectActiveVideo,
  onReorderPlaylist,
  onDeleteVideo,
  onUploadClick,
}) => {
  const t = translations[lang];

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) {
      return `${hrs}h ${mins % 60}m`;
    }
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    if (mb >= 1024) {
      return `${(mb / 1024).toFixed(1)} GB`;
    }
    return `${mb.toFixed(0)} MB`;
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-5 space-y-4">
      {/* Header & Mode Segmented Control */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              {t.playbackMode}
            </h2>
            <p className="text-xs text-zinc-400">
              {mode === 'single' ? t.singleLoopDesc : t.playlistLoopDesc}
            </p>
          </div>
        </div>

        {/* 2 Playback Modes */}
        <div className="grid grid-cols-2 p-1 bg-zinc-950 rounded-xl border border-zinc-800/80 gap-1">
          <button
            onClick={() => onModeChange('single')}
            className={`min-h-[44px] px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              mode === 'single'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/60'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Repeat className="w-3.5 h-3.5 text-red-400" />
            <span className="truncate">{t.singleLoop}</span>
          </button>

          <button
            onClick={() => onModeChange('playlist')}
            className={`min-h-[44px] px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              mode === 'playlist'
                ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/60'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5 text-blue-400" />
            <span className="truncate">{t.playlistLoop}</span>
          </button>
        </div>
      </div>

      {/* Video / Playlist List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-medium text-zinc-400">
            {mode === 'single'
              ? lang === 'en' ? 'Select 1 Video to Repeat Continuously' : 'लूप के लिए 1 वीडियो चुनें'
              : lang === 'en' ? 'Playlist Queue (Loops sequentially in this order)' : 'प्लेलिस्ट कतार (इस क्रम में लगातार चलेगा)'}
          </span>
          <button
            onClick={onUploadClick}
            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t.uploadVideo}</span>
          </button>
        </div>

        {videos.length === 0 ? (
          <div className="text-center py-8 px-4 border border-dashed border-zinc-800 rounded-xl space-y-2">
            <Video className="w-8 h-8 text-zinc-600 mx-auto" />
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              {t.noVideosUploaded}
            </p>
            <button
              onClick={onUploadClick}
              className="mt-2 px-3 py-1.5 text-xs font-medium bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
            >
              {t.selectVideoFromPhone}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {videos.map((video, index) => {
              const isActiveSingle = activeVideoId === video.id;

              return (
                <div
                  key={video.id}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    mode === 'single' && isActiveSingle
                      ? 'bg-red-950/20 border-red-500/50 text-white'
                      : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  {/* Left: Sequence index or Active indicator */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    {mode === 'playlist' ? (
                      <span className="w-6 h-6 rounded-md bg-zinc-800 border border-zinc-700/60 text-zinc-400 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                    ) : (
                      <button
                        onClick={() => onSelectActiveVideo(video.id)}
                        className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                          isActiveSingle
                            ? 'bg-red-600 border-red-500 text-white'
                            : 'border-zinc-700 hover:border-zinc-500 text-transparent'
                        }`}
                        title={t.setActiveForSingle}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-medium truncate max-w-[180px] sm:max-w-md">
                          {video.name}
                        </p>
                        {mode === 'single' && isActiveSingle && (
                          <span className="text-[10px] font-semibold text-red-400 shrink-0">
                            · {t.activeForSingle}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                        <span>{formatDuration(video.duration)}</span>
                        <span>·</span>
                        <span>{formatFileSize(video.size)}</span>
                        {video.isLocalFile && (
                          <>
                            <span>·</span>
                            <span className="text-emerald-400/80">Local File</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions: Reordering & Removal */}
                  <div className="flex items-center gap-1 shrink-0">
                    {mode === 'playlist' && (
                      <>
                        <button
                          onClick={() => onReorderPlaylist(index, Math.max(0, index - 1))}
                          disabled={index === 0}
                          title="Move Up"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onReorderPlaylist(index, Math.min(videos.length - 1, index + 1))}
                          disabled={index === videos.length - 1}
                          title="Move Down"
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}

                    {mode === 'single' && !isActiveSingle && (
                      <button
                        onClick={() => onSelectActiveVideo(video.id)}
                        className="px-2.5 py-1 text-[11px] font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md transition-colors"
                      >
                        {lang === 'en' ? 'Select' : 'चुनें'}
                      </button>
                    )}

                    <button
                      onClick={() => onDeleteVideo(video.id)}
                      title={t.delete}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors ml-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
