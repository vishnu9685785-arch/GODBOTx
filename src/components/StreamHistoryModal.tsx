import React from 'react';
import {
  CheckCircle2,
  Clock,
  History,
  Radio,
  RefreshCw,
  Users,
  X,
} from 'lucide-react';
import { Language, StreamHistorySession } from '../types';
import { translations } from '../i18n/translations';

interface StreamHistoryModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  history: StreamHistorySession[];
}

export const StreamHistoryModal: React.FC<StreamHistoryModalProps> = ({
  lang,
  isOpen,
  onClose,
  history,
}) => {
  const t = translations[lang];

  if (!isOpen) return null;

  const formatDuration = (minutes: number) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-zinc-300">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                {t.streamHistory}
              </h3>
              <p className="text-[11px] text-zinc-400">
                {lang === 'en' ? 'Previous 24/7 Loop Broadcasts' : 'पिछले 24/7 लूप प्रसारण'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3 overflow-y-auto">
          {history.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-2">
              <Radio className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-xs text-zinc-400">{t.noHistoryYet}</p>
            </div>
          ) : (
            history.map((session) => (
              <div
                key={session.id}
                className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-white text-sm">
                      {session.title}
                    </h4>
                    <p className="text-[11px] text-zinc-500 font-mono">
                      {new Date(session.startedAt).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-md shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{session.status}</span>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-800/80 text-[11px]">
                  <div>
                    <span className="text-zinc-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{t.duration}</span>
                    </span>
                    <p className="font-mono font-bold text-zinc-200 mt-0.5">
                      {formatDuration(session.durationMinutes)}
                    </p>
                  </div>

                  <div>
                    <span className="text-zinc-500 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{t.peakViewers}</span>
                    </span>
                    <p className="font-mono font-bold text-zinc-200 mt-0.5">
                      {session.peakViewers.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <span className="text-zinc-500 flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" />
                      <span>{t.reconnectCount}</span>
                    </span>
                    <p className="font-mono font-bold text-zinc-200 mt-0.5">
                      {session.reconnectEvents === 0
                        ? '0 (Zero Drops)'
                        : `${session.reconnectEvents} Auto-recovered`}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-zinc-800 flex justify-end bg-zinc-950/50">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            {t.close}
          </button>
        </div>
      </div>
    </div>
  );
};
