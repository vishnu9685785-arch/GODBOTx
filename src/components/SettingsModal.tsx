import React, { useState } from 'react';
import {
  Check,
  Cpu,
  Eye,
  EyeOff,
  Globe2,
  KeyRound,
  Save,
  Server,
  Settings,
  Shield,
  X,
} from 'lucide-react';
import { Language, StreamSettings } from '../types';
import { translations } from '../i18n/translations';

interface SettingsModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  settings: StreamSettings;
  onSaveSettings: (settings: StreamSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  lang,
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const t = translations[lang];

  const [form, setForm] = useState<StreamSettings>({ ...settings });
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(form);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-zinc-300">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                {t.settings}
              </h3>
              <p className="text-[11px] text-zinc-400">
                {t.streamSettings}
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
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {/* Cloud Worker Architecture Callout */}
          <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 text-zinc-200 text-xs font-semibold">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>{t.cloudWorkerNotice}</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {t.cloudWorkerDesc}
            </p>
            <div className="pt-2 flex items-center gap-4 text-[11px] text-zinc-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-blue-400" />
                <span>{form.workerRegion}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span>FFmpeg v6.1 Loop Ingest</span>
              </span>
            </div>
          </div>

          {/* YouTube RTMP Server URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">
              {t.rtmpServerUrl}
            </label>
            <input
              type="text"
              value={form.rtmpUrl}
              onChange={(e) => setForm({ ...form, rtmpUrl: e.target.value })}
              className="w-full px-3 py-2 text-xs font-mono bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* YouTube Stream Key with Show/Hide toggle */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.streamKey}</span>
              </label>
              <span className="text-[10px] text-zinc-400">
                {lang === 'en' ? 'Stored securely in memory' : 'सुरक्षित रूप से संग्रहित'}
              </span>
            </div>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                placeholder={t.streamKeyPlaceholder}
                value={form.streamKey}
                onChange={(e) => setForm({ ...form, streamKey: e.target.value })}
                className="w-full pl-3 pr-20 py-2 text-xs font-mono bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-red-500"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-[11px] font-medium text-zinc-400 hover:text-zinc-200 flex items-center gap-1"
              >
                {showKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showKey ? t.hideKey : t.showKey}</span>
              </button>
            </div>
            <p className="text-[11px] text-zinc-500">
              {lang === 'en'
                ? 'Find your stream key at studio.youtube.com → Go Live → Stream Settings'
                : 'अपनी स्ट्रीम की studio.youtube.com → गो लाइव → स्ट्रीम सेटिंग्स पर पाएं'}
            </p>
          </div>

          {/* Resolution & Bitrate */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                {t.streamResolution}
              </label>
              <select
                value={form.resolution}
                onChange={(e) => setForm({ ...form, resolution: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-red-500"
              >
                <option value="1080p60">1080p @ 60fps (Recommended)</option>
                <option value="1080p30">1080p @ 30fps</option>
                <option value="720p60">720p @ 60fps</option>
                <option value="720p30">720p @ 30fps (Low Bandwidth)</option>
                <option value="1440p60">1440p 2K @ 60fps</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                {t.videoBitrateKbps}
              </label>
              <select
                value={form.videoBitrate}
                onChange={(e) => setForm({ ...form, videoBitrate: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs font-mono bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-red-500"
              >
                <option value="3000">3,000 kbps (Economy)</option>
                <option value="4500">4,500 kbps (1080p Standard)</option>
                <option value="6000">6,000 kbps (1080p High Quality)</option>
                <option value="9000">9,000 kbps (Ultra)</option>
              </select>
            </div>
          </div>

          {/* Reconnect & Retry Policy */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                {t.maxRetries}
              </label>
              <select
                value={form.retryAttempts}
                onChange={(e) => setForm({ ...form, retryAttempts: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-red-500"
              >
                <option value="3">3 Attempts</option>
                <option value="5">5 Attempts (Default)</option>
                <option value="10">10 Attempts (Aggressive)</option>
                <option value="999">Infinite Retries (24/7 Resilient)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300">
                {t.retryInterval}
              </label>
              <select
                value={form.retryBackoffSeconds}
                onChange={(e) => setForm({ ...form, retryBackoffSeconds: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-red-500"
              >
                <option value="5">5 {t.seconds}</option>
                <option value="8">8 {t.seconds} (Recommended)</option>
                <option value="15">15 {t.seconds}</option>
                <option value="30">30 {t.seconds}</option>
              </select>
            </div>
          </div>

          {/* Loop Crossfade & Crash protection */}
          <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-xs font-semibold text-zinc-200">
                {lang === 'en' ? 'Loop Seamless Crossfade' : 'लूप सीमलेस क्रॉसफ़ेड'}
              </p>
              <p className="text-[11px] text-zinc-400">
                {lang === 'en' ? 'Prevents audio pop when repeating video' : 'वीडियो रिपीट होने पर ऑडियो पॉप रोकता है'}
              </p>
            </div>
            <select
              value={form.loopCrossfadeSeconds}
              onChange={(e) => setForm({ ...form, loopCrossfadeSeconds: Number(e.target.value) })}
              className="px-2.5 py-1 text-xs bg-zinc-900 border border-zinc-800 rounded-md text-zinc-200"
            >
              <option value="0">0s (Hard Cut)</option>
              <option value="1">1s Fade</option>
              <option value="2">2s Crossfade</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-1 text-xs text-zinc-400">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero passwords stored. Encrypted communication only.</span>
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 active:scale-[0.98] transition-all"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>{lang === 'en' ? 'Settings Saved Successfully!' : 'सेटिंग्स सफलतापूर्वक सहेजी गईं!'}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{t.saveSettings}</span>
                </>
              )}
            </button>
          </div>
        </form>

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
