import React from 'react';
import {
  Activity,
  AlertTriangle,
  Clock,
  RefreshCw,
  Video,
  Wifi,
  WifiOff,
  Zap,
} from 'lucide-react';
import { Language, StreamState, VideoItem } from '../types';
import { translations } from '../i18n/translations';

interface LiveStatusCardProps {
  lang: Language;
  streamState: StreamState;
  activeVideo?: VideoItem;
  onSimulateDrop: () => void;
  onOpenSettings: () => void;
  onOpenDiagnostics: () => void;
  onResetStream: () => void;
}

export const LiveStatusCard: React.FC<LiveStatusCardProps> = ({
  lang,
  streamState,
  activeVideo,
  onSimulateDrop,
  onOpenSettings,
  onOpenDiagnostics,
  onResetStream,
}) => {
  const t = translations[lang];

  const formatUptime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStatusBadge = () => {
    switch (streamState.status) {
      case 'STREAMING':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-600/15 border border-red-500/40 text-red-400">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <span className="text-xs font-bold tracking-wider uppercase">
              {t.live}
            </span>
          </div>
        );
      case 'RECONNECTING':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/40 text-amber-300">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span className="text-xs font-bold tracking-wider uppercase">
              {t.reconnecting} ({streamState.reconnectCount + 1}/{streamState.maxReconnectAttempts})
            </span>
          </div>
        );
      case 'CONNECTING':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/15 border border-blue-500/40 text-blue-300">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span className="text-xs font-bold tracking-wider uppercase">
              {t.connecting}
            </span>
          </div>
        );
      case 'ERROR':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-600/15 border border-rose-500/40 text-rose-300">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="text-xs font-bold tracking-wider uppercase">
              {t.error}
            </span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/80 border border-zinc-700/60 text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-zinc-500"></span>
            <span className="text-xs font-bold tracking-wider uppercase">
              {t.offline}
            </span>
          </div>
        );
    }
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg backdrop-blur-sm">
      {/* Reconnect Alert Banner if Reconnecting */}
      {streamState.status === 'RECONNECTING' && (
        <div className="bg-amber-950/60 border-b border-amber-500/30 p-3.5 flex items-start justify-between gap-3 text-amber-200">
          <div className="flex items-start gap-2.5">
            <RefreshCw className="w-4 h-4 text-amber-400 animate-spin shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-semibold text-amber-100">
                {t.reconnectingWarning}
              </p>
              <p className="text-amber-300/80">
                {t.nextRetryIn}{' '}
                <span className="font-mono font-bold text-amber-200">
                  {streamState.reconnectCountdown ?? 5}s
                </span>{' '}
                · {t.attempts}: {streamState.reconnectCount}/{streamState.maxReconnectAttempts}
              </p>
            </div>
          </div>
          <button
            onClick={onOpenDiagnostics}
            className="text-[11px] underline text-amber-300 hover:text-amber-100 whitespace-nowrap shrink-0 mt-0.5"
          >
            {t.viewDetails}
          </button>
        </div>
      )}

      {/* Error Banner if Error State */}
      {streamState.status === 'ERROR' && streamState.errorMessage && (
        <div className="bg-rose-950/70 border-b border-rose-500/40 p-3.5 flex items-start justify-between gap-3 text-rose-200">
          <div className="flex items-start gap-2.5 min-w-0">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1 min-w-0">
              <p className="text-xs font-semibold text-rose-100">{streamState.errorMessage}</p>
              <p className="text-[11px] text-rose-300/80">
                {lang === 'en'
                  ? 'Tap Reset to re-initialize cloud worker to OFFLINE and start fresh.'
                  : 'क्लाउड वर्कर को रीसेट कर पुनः शुरू करने के लिए रीसेट दबाएं।'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onResetStream}
              className="px-2.5 py-1 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-lg shadow transition-colors"
            >
              {lang === 'en' ? 'Reset System' : 'रीसेट करें'}
            </button>
            <button
              onClick={onOpenDiagnostics}
              className="text-[11px] underline text-rose-300 hover:text-rose-100 whitespace-nowrap"
            >
              {t.viewDetails}
            </button>
          </div>
        </div>
      )}

      <div className="p-4 sm:p-5 space-y-4">
        {/* Top Status & Controls Bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {getStatusBadge()}
            <div className="text-xs text-zinc-400">
              <span>{streamState.workerRegion}</span>
            </div>
          </div>

          {/* Test connection drop button */}
          {streamState.status === 'STREAMING' && (
            <button
              onClick={onSimulateDrop}
              title={t.simulateDropDesc}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-950/40 border border-amber-500/30 rounded-lg hover:bg-amber-900/50 transition-colors"
            >
              <WifiOff className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{t.simulateDrop}</span>
              <span className="sm:hidden">Drop Test</span>
            </button>
          )}
        </div>

        {/* Video Preview Canvas / Info Bar */}
        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-zinc-800 flex items-center justify-center">
          {activeVideo?.fileBlobUrl ? (
            <video
              src={activeVideo.fileBlobUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center p-6 space-y-2">
              <div className="w-12 h-12 rounded-full bg-zinc-800/80 border border-zinc-700/60 mx-auto flex items-center justify-center text-zinc-400">
                <Video className="w-6 h-6" />
              </div>
              <p className="text-xs font-medium text-zinc-300 truncate max-w-xs">
                {activeVideo ? activeVideo.name : 'No video loop selected'}
              </p>
              <p className="text-[11px] text-zinc-500">
                {streamState.status === 'STREAMING'
                  ? 'Cloud Worker FFmpeg Pipeline Active'
                  : 'Prerecorded video looping preview'}
              </p>
            </div>
          )}

          {/* Overlay details */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-zinc-300 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
            <div className="flex items-center gap-1.5 truncate">
              <Zap className="w-3 h-3 text-red-500 shrink-0" />
              <span className="truncate">
                {streamState.playbackMode === 'single' ? t.singleLoop : t.playlistLoop}
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono tabular-nums shrink-0">
              <span>{streamState.fps} FPS</span>
              <span className="text-zinc-600">·</span>
              <span>{streamState.bitrateKbps} kbps</span>
            </div>
          </div>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-zinc-950/60 border border-zinc-800/80 p-3 rounded-xl">
            <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] mb-1">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              <span>{t.uptime}</span>
            </div>
            <p className="text-base sm:text-lg font-bold font-mono tabular-nums text-zinc-100">
              {formatUptime(streamState.uptimeSeconds)}
            </p>
          </div>

          <div className="bg-zinc-950/60 border border-zinc-800/80 p-3 rounded-xl">
            <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] mb-1">
              <Activity className="w-3.5 h-3.5 text-zinc-500" />
              <span>{t.bitrate}</span>
            </div>
            <p className="text-base sm:text-lg font-bold font-mono tabular-nums text-zinc-100">
              {streamState.bitrateKbps}{' '}
              <span className="text-xs font-normal text-zinc-400">kbps</span>
            </p>
          </div>

          <div className="bg-zinc-950/60 border border-zinc-800/80 p-3 rounded-xl">
            <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] mb-1">
              <Wifi className="w-3.5 h-3.5 text-zinc-500" />
              <span>{t.connectionStatus}</span>
            </div>
            <p className="text-sm sm:text-base font-semibold text-zinc-200 truncate">
              {streamState.status === 'STREAMING' ? t.excellentHealth : streamState.status}
            </p>
          </div>

          <div className="bg-zinc-950/60 border border-zinc-800/80 p-3 rounded-xl">
            <div className="flex items-center gap-1.5 text-zinc-400 text-[11px] mb-1">
              <RefreshCw className="w-3.5 h-3.5 text-zinc-500" />
              <span>{t.lastReconnectAttempt}</span>
            </div>
            <p className="text-xs font-mono text-zinc-300 truncate">
              {streamState.lastReconnectAttempt
                ? new Date(streamState.lastReconnectAttempt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                : 'None (Stable)'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
