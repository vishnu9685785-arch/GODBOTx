import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Bug,
  CheckCircle,
  Clock,
  Info,
  Trash2,
  X,
} from 'lucide-react';
import { DiagnosticsLog, Language } from '../types';
import { translations } from '../i18n/translations';

interface ErrorAndDiagnosticsDrawerProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  logs: DiagnosticsLog[];
  onClearLogs: () => void;
  activeError: string | null;
  onDismissError: () => void;
}

export const ErrorAndDiagnosticsDrawer: React.FC<ErrorAndDiagnosticsDrawerProps> = ({
  lang,
  isOpen,
  onClose,
  logs,
  onClearLogs,
  activeError,
  onDismissError,
}) => {
  const t = translations[lang];
  const [filterLevel, setFilterLevel] = useState<'all' | 'error' | 'warn' | 'info'>('all');

  if (!isOpen) return null;

  const filteredLogs = logs.filter((log) => {
    if (filterLevel === 'all') return true;
    return log.level === filterLevel;
  });

  const getLogIcon = (level: DiagnosticsLog['level']) => {
    switch (level) {
      case 'error':
        return <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />;
      case 'warn':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />;
      case 'success':
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />;
      default:
        return <Info className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-zinc-300">
              <Bug className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                {t.diagnosticsAndLogs}
              </h3>
              <p className="text-[11px] text-zinc-400">
                {lang === 'en'
                  ? 'Real-time Cloud Worker & RTMP logs'
                  : 'रीयल-टाइम क्लाउड वर्कर व RTMP लॉग्स'}
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
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Active Error Callout */}
          {activeError && (
            <div className="p-3.5 bg-rose-950/60 border border-rose-500/40 rounded-xl flex items-start justify-between gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-rose-200">
                    {lang === 'en' ? 'Active System Alert' : 'सक्रिय सिस्टम चेतावनी'}
                  </p>
                  <p className="text-rose-300/90 mt-0.5">{activeError}</p>
                </div>
              </div>
              <button
                onClick={onDismissError}
                className="px-2 py-1 text-[11px] font-semibold bg-rose-900/60 hover:bg-rose-900 text-rose-200 rounded-md transition-colors shrink-0"
              >
                {t.dismiss}
              </button>
            </div>
          )}

          {/* Filter Bar */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 p-1 bg-zinc-950 rounded-lg border border-zinc-800">
              {(['all', 'error', 'warn', 'info'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setFilterLevel(lvl)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-md uppercase tracking-wider transition-colors ${
                    filterLevel === lvl
                      ? 'bg-zinc-800 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <button
              onClick={onClearLogs}
              className="flex items-center gap-1 px-2.5 py-1 text-xs text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-md transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.clearLogs}</span>
            </button>
          </div>

          {/* Logs List */}
          <div className="bg-zinc-950 rounded-xl border border-zinc-800/80 p-3 font-mono text-[11px] space-y-2 max-h-80 overflow-y-auto">
            {filteredLogs.length === 0 ? (
              <p className="text-zinc-500 text-center py-6 font-sans">
                {t.noErrors}
              </p>
            ) : (
              filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-2 pb-2 border-b border-zinc-900 last:border-0 last:pb-0"
                >
                  {getLogIcon(log.level)}
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-2 text-zinc-500 text-[10px]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </span>
                      <span>·</span>
                      <span className="font-semibold text-zinc-400">[{log.source}]</span>
                    </div>
                    <p
                      className={`break-words ${
                        log.level === 'error'
                          ? 'text-rose-300'
                          : log.level === 'warn'
                          ? 'text-amber-300'
                          : log.level === 'success'
                          ? 'text-emerald-300'
                          : 'text-zinc-300'
                      }`}
                    >
                      {log.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
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
