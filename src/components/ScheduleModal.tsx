import React, { useState } from 'react';
import { Calendar, Clock, Plus, Trash2, X } from 'lucide-react';
import { Language, PlaybackMode, ScheduleItem, VideoItem } from '../types';
import { translations } from '../i18n/translations';

interface ScheduleModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  schedules: ScheduleItem[];
  videos: VideoItem[];
  onCreateSchedule: (data: {
    title: string;
    scheduledTime: string;
    playbackMode: PlaybackMode;
    videoIds: string[];
    privacy: 'public' | 'unlisted' | 'private';
  }) => void;
  onDeleteSchedule: (id: string) => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  lang,
  isOpen,
  onClose,
  schedules,
  videos,
  onCreateSchedule,
  onDeleteSchedule,
}) => {
  const t = translations[lang];

  // Default time: 2 hours in the future formatted for datetime-local
  const getDefaultTime = () => {
    const d = new Date(Date.now() + 7200000);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  const [title, setTitle] = useState('');
  const [scheduledTime, setScheduledTime] = useState(getDefaultTime());
  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>('single');
  const [privacy, setPrivacy] = useState<'public' | 'unlisted' | 'private'>('public');
  const [selectedVideoId, setSelectedVideoId] = useState<string>(videos[0]?.id || 'v1');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateSchedule({
      title: title.trim() || 'Continuous 24/7 YouTube Stream',
      scheduledTime: new Date(scheduledTime).toISOString(),
      playbackMode,
      videoIds: [selectedVideoId],
      privacy,
    });
    setTitle('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                {t.scheduleLive}
              </h3>
              <p className="text-[11px] text-zinc-400">
                {lang === 'en' ? 'Automated Cloud Worker Broadcast' : 'स्वचालित क्लाउड वर्कर प्रसारण'}
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
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* New Schedule Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 bg-zinc-950 p-4 rounded-xl border border-zinc-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              {t.createSchedule}
            </h4>

            {/* Broadcast Title */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-400">
                {t.streamTitle}
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 24/7 Relaxing Music Stream"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Date & Time */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-400">
                {t.startTime}
              </label>
              <input
                type="datetime-local"
                required
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Playback Mode & Video */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400">
                  {t.playbackMode}
                </label>
                <select
                  value={playbackMode}
                  onChange={(e) => setPlaybackMode(e.target.value as PlaybackMode)}
                  className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white focus:outline-none focus:border-red-500"
                >
                  <option value="single">{t.singleLoop}</option>
                  <option value="playlist">{t.playlistLoop}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-400">
                  {lang === 'en' ? 'Loop Video' : 'लूप वीडियो'}
                </label>
                <select
                  value={selectedVideoId}
                  onChange={(e) => setSelectedVideoId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-white truncate focus:outline-none focus:border-red-500"
                >
                  {videos.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Privacy */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-400">
                {lang === 'en' ? 'Privacy' : 'गोपनीयता'}
              </label>
              <div className="flex gap-2">
                {(['public', 'unlisted', 'private'] as const).map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPrivacy(p)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg border text-center transition-colors ${
                      privacy === p
                        ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-200'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {p === 'public' && t.privacyPublic}
                    {p === 'unlisted' && t.privacyUnlisted}
                    {p === 'private' && t.privacyPrivate}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm shadow-emerald-600/30"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Save Broadcast Schedule' : 'शेड्यूल सहेजें'}</span>
            </button>
          </form>

          {/* Existing Schedules */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              {t.scheduledBroadcasts} ({schedules.length})
            </h4>

            {schedules.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-4">
                {t.noSchedules}
              </p>
            ) : (
              <div className="space-y-2">
                {schedules.map((sch) => (
                  <div
                    key={sch.id}
                    className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 space-y-1">
                      <p className="font-semibold text-white truncate max-w-[220px]">
                        {sch.title}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                        <Clock className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="font-mono">
                          {new Date(sch.scheduledTime).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span>·</span>
                        <span className="capitalize">{sch.playbackMode}</span>
                        <span>·</span>
                        <span className="uppercase text-[10px] text-zinc-500">{sch.privacy}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteSchedule(sch.id)}
                      title={t.delete}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
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
