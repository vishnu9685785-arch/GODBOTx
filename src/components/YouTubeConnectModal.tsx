import React, { useState } from 'react';
import {
  CheckCircle,
  ExternalLink,
  KeyRound,
  Lock,
  LogOut,
  ShieldCheck,
  X,
  Youtube,
} from 'lucide-react';
import { Language, StreamState } from '../types';
import { translations } from '../i18n/translations';

interface YouTubeConnectModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  streamState: StreamState;
  onConnectChannel: (name: string) => void;
  onDisconnectChannel: () => void;
  onOpenSettings: () => void;
}

export const YouTubeConnectModal: React.FC<YouTubeConnectModalProps> = ({
  lang,
  isOpen,
  onClose,
  streamState,
  onConnectChannel,
  onDisconnectChannel,
  onOpenSettings,
}) => {
  const t = translations[lang];
  const [customChannelName, setCustomChannelName] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'unlisted' | 'private'>('public');

  if (!isOpen) return null;

  const handleConnectDemo = () => {
    const name = customChannelName.trim() || 'My YouTube Channel (Verified Creator)';
    onConnectChannel(name);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
              <Youtube className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                {t.oauthModalTitle}
              </h3>
              <p className="text-[11px] text-zinc-400">
                Google OAuth 2.0 & YouTube Live API
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
          {/* Strict Security Callout */}
          <div className="p-3.5 bg-zinc-950/80 border border-emerald-500/30 rounded-xl flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="space-y-1 text-xs">
              <p className="font-semibold text-emerald-300">
                {t.secureOAuthNotice}
              </p>
              <p className="text-zinc-300 leading-relaxed">
                {t.secureOAuthDesc}
              </p>
            </div>
          </div>

          {streamState.isYouTubeConnected ? (
            /* Connected State View */
            <div className="space-y-4">
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 font-bold">
                      YT
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white truncate max-w-[200px]">
                        {streamState.channelName}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {lang === 'en' ? 'Live Streaming Authorized' : 'लाइव स्ट्रीमिंग अधिकृत'}
                      </p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                    <CheckCircle className="w-3 h-3" />
                    <span>{t.permissionEnabled}</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/80 text-xs">
                  <div>
                    <span className="text-zinc-400 text-[11px]">Scope:</span>
                    <p className="font-mono text-zinc-300 truncate">youtube.force-ssl</p>
                  </div>
                  <div>
                    <span className="text-zinc-400 text-[11px]">Stream Target:</span>
                    <p className="font-mono text-zinc-300 truncate">rtmp://a.rtmp.youtube.com</p>
                  </div>
                </div>
              </div>

              {/* Broadcast Privacy Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">
                  {lang === 'en' ? 'Default Stream Privacy' : 'डिफ़ॉल्ट गोपनीयता'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['public', 'unlisted', 'private'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPrivacy(p)}
                      className={`py-2 px-2.5 text-xs font-medium rounded-lg border text-center transition-colors ${
                        privacy === p
                          ? 'bg-red-600/20 border-red-500/50 text-red-200'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {p === 'public' && t.privacyPublic}
                      {p === 'unlisted' && t.privacyUnlisted}
                      {p === 'private' && t.privacyPrivate}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stream Key Shortcut */}
              <div className="p-3 bg-zinc-950/60 border border-zinc-800 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-zinc-300">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>
                    {streamState.streamKeyConfigured
                      ? (lang === 'en' ? 'Stream Key synced' : 'स्ट्रीम की लिंक है')
                      : (lang === 'en' ? 'Stream Key not set' : 'स्ट्रीम की सेट नहीं है')}
                  </span>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenSettings();
                  }}
                  className="text-red-400 hover:underline font-medium"
                >
                  {t.settings}
                </button>
              </div>

              <button
                onClick={onDisconnectChannel}
                className="w-full py-2.5 px-4 rounded-xl border border-rose-500/30 text-rose-300 hover:bg-rose-950/30 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.disconnect}</span>
              </button>
            </div>
          ) : (
            /* Disconnected / Connect flow */
            <div className="space-y-4">
              <div className="space-y-2 text-xs text-zinc-300">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 font-mono text-[11px] flex items-center justify-center shrink-0">
                    1
                  </span>
                  <p>{t.oauthNoticeStep1}</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 font-mono text-[11px] flex items-center justify-center shrink-0">
                    2
                  </span>
                  <p>{t.oauthNoticeStep2}</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-300 font-mono text-[11px] flex items-center justify-center shrink-0">
                    3
                  </span>
                  <p>{t.oauthNoticeStep3}</p>
                </div>
              </div>

              {/* YouTube Studio Requirement note */}
              <div className="p-3 bg-zinc-950/90 border border-zinc-800 rounded-xl space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 text-zinc-200 font-semibold">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {lang === 'en'
                      ? 'YouTube Live Verification Rule'
                      : 'यूट्यूब लाइव सत्यापन नियम'}
                  </span>
                </div>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  {lang === 'en'
                    ? 'YouTube requires channels to be verified with phone number for Live Streaming. It can take up to 24 hours to activate if enabling for the first time in YouTube Studio.'
                    : 'यूट्यूब पर पहली बार लाइव शुरू करने के लिए फोन सत्यापन की आवश्यकता होती है, जिसे सक्रिय होने में 24 घंटे तक का समय लग सकता है।'}
                </p>
                <a
                  href="https://studio.youtube.com/channel/live"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-red-400 hover:underline pt-1"
                >
                  <span>{lang === 'en' ? 'Open YouTube Studio Live Dashboard' : 'यूट्यूब स्टूडियो लाइव खोलें'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Channel Customizer / Demo Connection */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">
                  {lang === 'en' ? 'Channel Name' : 'चैनल का नाम'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bhajan Sagar Official or Lofi Records"
                  value={customChannelName}
                  onChange={(e) => setCustomChannelName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Connect Button */}
              <button
                type="button"
                onClick={handleConnectDemo}
                className="w-full h-11 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 active:scale-[0.98] transition-all"
              >
                <Youtube className="w-4 h-4 fill-current" />
                <span>{t.connectWithGoogle}</span>
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenSettings();
                  }}
                  className="text-xs text-zinc-400 hover:text-zinc-200 underline"
                >
                  {lang === 'en'
                    ? 'Or manually configure RTMP Stream Key in Settings'
                    : 'या सेटिंग्स में मैन्युअल रूप से RTMP स्ट्रीम की दर्ज करें'}
                </button>
              </div>
            </div>
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
