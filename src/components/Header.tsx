import React from 'react';
import { Radio, Globe, ShieldCheck, Server, Smartphone } from 'lucide-react';
import { Language, StreamState } from '../types';
import { translations } from '../i18n/translations';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  streamState: StreamState;
  onOpenYouTubeModal: () => void;
  onOpenSettingsModal: () => void;
  onOpenDownloadModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  streamState,
  onOpenYouTubeModal,
  onOpenSettingsModal,
  onOpenDownloadModal,
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-30 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Zone */}
        <div className="flex items-center gap-2.5 shrink-0">
          <img
            src="/looplive_logo.svg"
            alt="LoopLive 24/7 Logo"
            className="w-9 h-9 rounded-xl object-cover border border-zinc-800 shadow-md shadow-red-950/30"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white whitespace-nowrap">
                {t.appName}
              </h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                24/7
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block truncate max-w-xs">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Actions Zone */}
        <div className="flex items-center gap-2">
          {/* Download / Install on Android button */}
          <button
            onClick={onOpenDownloadModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/50 border border-emerald-500/40 rounded-lg hover:bg-emerald-900/60 transition-colors shadow-sm"
            title="Download & Install on Android Phone"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden xs:inline">{t.downloadAndroidApp}</span>
            <span className="xs:hidden">App</span>
          </button>

          {/* Cloud Worker Status */}
          <button
            onClick={onOpenSettingsModal}
            title={t.cloudWorker}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
          >
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            <span className="tabular-nums">Mumbai</span>
          </button>

          {/* YouTube Connection status button */}
          <button
            onClick={onOpenYouTubeModal}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-all ${
              streamState.isYouTubeConnected
                ? 'bg-red-950/40 border-red-500/40 text-red-200 hover:bg-red-900/40'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
            }`}
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${streamState.isYouTubeConnected ? 'text-red-400' : 'text-zinc-500'}`} />
            <span className="truncate max-w-[90px] sm:max-w-none">
              {streamState.isYouTubeConnected ? (streamState.channelName || 'YouTube Live') : t.notConnected}
            </span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg text-zinc-200 transition-colors"
            aria-label="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5 text-zinc-400" />
            <span className="font-semibold">{lang === 'en' ? 'हिंदी' : 'EN'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
