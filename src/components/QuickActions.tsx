import React from 'react';
import { Calendar, Play, Square, Upload, Youtube } from 'lucide-react';
import { Language, StreamState } from '../types';
import { translations } from '../i18n/translations';

interface QuickActionsProps {
  lang: Language;
  streamState: StreamState;
  onConnectYouTube: () => void;
  onUploadVideo: () => void;
  onStartLive: () => void;
  onStopLive: () => void;
  onScheduleLive: () => void;
  isStarting?: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  lang,
  streamState,
  onConnectYouTube,
  onUploadVideo,
  onStartLive,
  onStopLive,
  onScheduleLive,
  isStarting = false,
}) => {
  const t = translations[lang];
  const isStreaming = streamState.status === 'STREAMING' || streamState.status === 'RECONNECTING';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          {lang === 'en' ? 'Quick Actions' : 'त्वरित क्रियाएं'}
        </h2>
        <span className="text-[11px] text-zinc-400 font-mono">
          {streamState.isYouTubeConnected
            ? '✓ YouTube Linked'
            : streamState.streamKeyConfigured
            ? '✓ RTMP Key Ready'
            : '! Setup Stream Key'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {/* 1. Connect YouTube */}
        <button
          onClick={onConnectYouTube}
          className={`col-span-1 min-h-[52px] px-3.5 py-2.5 rounded-xl border flex items-center gap-2.5 transition-all text-left ${
            streamState.isYouTubeConnected
              ? 'bg-zinc-900/90 border-red-500/40 text-red-200 hover:bg-zinc-800'
              : 'bg-zinc-900 border-zinc-800 text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800/80'
          }`}
        >
          <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center shrink-0 text-red-500">
            <Youtube className="w-4 h-4" />
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold truncate leading-tight">
              {t.connectYouTube}
            </p>
            <p className="text-[10px] text-zinc-400 truncate">
              {streamState.isYouTubeConnected ? t.connectedAs : t.notConnected}
            </p>
          </div>
        </button>

        {/* 2. Upload Video */}
        <button
          onClick={onUploadVideo}
          className="col-span-1 min-h-[52px] px-3.5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800/80 flex items-center gap-2.5 transition-all text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-400">
            <Upload className="w-4 h-4" />
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold truncate leading-tight">
              {t.uploadVideo}
            </p>
            <p className="text-[10px] text-zinc-400 truncate">
              {lang === 'en' ? 'Pick from phone' : 'फोन से चुनें'}
            </p>
          </div>
        </button>

        {/* 3. Start LIVE */}
        <button
          onClick={onStartLive}
          disabled={isStreaming || isStarting}
          className={`col-span-1 min-h-[52px] px-3.5 py-2.5 rounded-xl flex items-center gap-2.5 transition-all text-left ${
            isStreaming
              ? 'opacity-40 bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/20 active:scale-[0.98]'
          }`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isStreaming ? 'bg-zinc-800 text-zinc-600' : 'bg-white/20 text-white'}`}>
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </div>
          <div className="truncate">
            <p className="text-xs font-bold truncate leading-tight">
              {isStarting ? t.connecting : t.startLive}
            </p>
            <p className={`text-[10px] truncate ${isStreaming ? 'text-zinc-600' : 'text-red-100/80'}`}>
              {lang === 'en' ? 'Loop 24/7' : '24/7 लूप शुरू'}
            </p>
          </div>
        </button>

        {/* 4. Stop LIVE */}
        <button
          onClick={onStopLive}
          disabled={!isStreaming && streamState.status !== 'ERROR'}
          className={`col-span-1 min-h-[52px] px-3.5 py-2.5 rounded-xl border flex items-center gap-2.5 transition-all text-left ${
            !isStreaming && streamState.status !== 'ERROR'
              ? 'opacity-35 bg-zinc-900/50 border-zinc-800 text-zinc-500 cursor-not-allowed'
              : 'bg-zinc-900 border-rose-500/50 text-rose-300 hover:bg-rose-950/40 hover:border-rose-400 active:scale-[0.98]'
          }`}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${!isStreaming && streamState.status !== 'ERROR' ? 'bg-zinc-800 text-zinc-600' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
            <Square className="w-4 h-4 fill-current" />
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold truncate leading-tight">
              {streamState.status === 'ERROR' ? (lang === 'en' ? 'Reset Error' : 'रीसेट करें') : t.stopLive}
            </p>
            <p className="text-[10px] text-zinc-400 truncate">
              {streamState.status === 'ERROR' ? (lang === 'en' ? 'Clear & offline' : 'ऑफलाइन करें') : (lang === 'en' ? 'Halt cloud worker' : 'वर्कर रोकें')}
            </p>
          </div>
        </button>

        {/* 5. Schedule LIVE */}
        <button
          onClick={onScheduleLive}
          className="col-span-2 sm:col-span-1 min-h-[52px] px-3.5 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800/80 flex items-center gap-2.5 transition-all text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="truncate">
            <p className="text-xs font-semibold truncate leading-tight">
              {t.scheduleLive}
            </p>
            <p className="text-[10px] text-zinc-400 truncate">
              {lang === 'en' ? 'Set broadcast' : 'प्रसारण समय'}
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};
