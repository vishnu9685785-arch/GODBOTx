/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Smartphone, Download } from 'lucide-react';
import { AndroidDownloadModal } from './components/AndroidDownloadModal';
import { ArchitectureBanner } from './components/ArchitectureBanner';
import { BottomNav, TabType } from './components/BottomNav';
import { ErrorAndDiagnosticsDrawer } from './components/ErrorAndDiagnosticsDrawer';
import { Header } from './components/Header';
import { LiveStatusCard } from './components/LiveStatusCard';
import { PlaybackModeSelector } from './components/PlaybackModeSelector';
import { QuickActions } from './components/QuickActions';
import { ScheduleModal } from './components/ScheduleModal';
import { SettingsModal } from './components/SettingsModal';
import { StreamHistoryModal } from './components/StreamHistoryModal';
import { VideoUploadModal } from './components/VideoUploadModal';
import { YouTubeConnectModal } from './components/YouTubeConnectModal';
import { translations } from './i18n/translations';
import { api } from './services/api';
import {
  DiagnosticsLog,
  Language,
  PlaybackMode,
  ScheduleItem,
  StreamHistorySession,
  StreamSettings,
  StreamState,
  VideoItem,
} from './types';

export default function App() {
  const [lang, setLang] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const [streamState, setStreamState] = useState<StreamState>({
    status: 'OFFLINE',
    playbackMode: 'single',
    activeVideoId: 'v1',
    startedAt: null,
    uptimeSeconds: 0,
    bitrateKbps: 0,
    fps: 0,
    droppedFrames: 0,
    totalFrames: 0,
    lastReconnectAttempt: null,
    reconnectCount: 0,
    maxReconnectAttempts: 5,
    reconnectCountdown: null,
    workerRegion: 'asia-south1 (Mumbai)',
    workerStatus: 'healthy',
    errorMessage: null,
    rtmpUrl: 'rtmp://a.rtmp.youtube.com/live2',
    streamKeyConfigured: true,
    channelName: null,
    isYouTubeConnected: false,
  });

  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [history, setHistory] = useState<StreamHistorySession[]>([]);

  const [settings, setSettings] = useState<StreamSettings>({
    rtmpUrl: 'rtmp://a.rtmp.youtube.com/live2',
    streamKey: 'live_yt_98457_loop247_sec',
    resolution: '1080p60',
    videoBitrate: 4500,
    audioBitrate: 128,
    fps: 60,
    loopCrossfadeSeconds: 1,
    retryAttempts: 5,
    retryBackoffSeconds: 8,
    workerRegion: 'asia-south1 (Mumbai Cloud Run)',
    autoRestartOnCrash: true,
  });

  const [logs, setLogs] = useState<DiagnosticsLog[]>([
    {
      id: 'log-1',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      level: 'info',
      message: 'Cloud Streaming Worker initialized. RTMP ready.',
      source: 'WORKER',
    },
    {
      id: 'log-2',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      level: 'info',
      message: 'Pre-flight check: Video buffer initialized with Devotional_Bhajan_Meditation_4K.mp4',
      source: 'FFMPEG',
    },
  ]);

  const [activeError, setActiveError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  // Modal open states
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isDiagnosticsOpen, setIsDiagnosticsOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const t = translations[lang];

  const addLog = (
    level: DiagnosticsLog['level'],
    message: string,
    source: DiagnosticsLog['source'] = 'WORKER'
  ) => {
    const newLog: DiagnosticsLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      level,
      message,
      source,
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 99)]);
  };

  // Initial data load
  useEffect(() => {
    const initData = async () => {
      try {
        const [statusData, videoData, scheduleData, historyData] =
          await Promise.all([
            api.getStatus(),
            api.getVideos(),
            api.getSchedules(),
            api.getHistory(),
          ]);
        setStreamState(statusData);
        setVideos(videoData);
        setSchedules(scheduleData);
        setHistory(historyData);
      } catch (err) {
        console.error('Initial load failed:', err);
      }
    };
    initData();
  }, []);

  // Polling for live status updates
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const current = await api.getStatus();
        setStreamState(current);
        if (current.errorMessage && !activeError) {
          setActiveError(current.errorMessage);
        }
      } catch {
        // Ignored in poll
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [activeError]);

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const handleStartLive = async () => {
    setIsStarting(true);
    addLog('info', 'Received user request: Start 24/7 LIVE Stream', 'WORKER');

    const result = await api.startStream(
      streamState.playbackMode,
      streamState.activeVideoId || videos[0]?.id,
      settings.streamKey
    );

    setIsStarting(false);
    if (result.success && result.state) {
      setStreamState(result.state);
      setActiveError(null);
      addLog(
        'success',
        `FFmpeg pipeline streaming loop active: ${streamState.playbackMode === 'single' ? 'Single Video Continuous Repeat' : 'Sequential Playlist Loop'}`,
        'FFMPEG'
      );
      addLog('info', `Ingest connected to ${settings.rtmpUrl} @ 4500kbps 60fps`, 'NETWORK');
    } else {
      const err = result.error || 'Failed to start live stream';
      setActiveError(err);
      addLog('error', err, 'WORKER');
    }
  };

  const handleStopLive = async () => {
    addLog('warn', 'User commanded halt: Stopping 24/7 stream gracefully', 'WORKER');
    const result = await api.stopStream();
    if (result.state) {
      setStreamState(result.state);
    } else {
      setStreamState((prev) => ({
        ...prev,
        status: 'OFFLINE',
        uptimeSeconds: 0,
        bitrateKbps: 0,
        fps: 0,
      }));
    }
    addLog('info', 'Stream stopped. RTMP socket released.', 'NETWORK');
    // Refresh history
    const historyData = await api.getHistory();
    setHistory(historyData);
  };

  const handleSimulateDrop = async () => {
    addLog(
      'warn',
      'SIMULATED NETWORK DROP: Ingest connection disrupted. Testing automatic reconnect...',
      'NETWORK'
    );
    const result = await api.simulateDrop();
    if (result.state) {
      setStreamState(result.state);
      setActiveError(result.state.errorMessage);
    }
  };

  const handleResetStream = async () => {
    addLog('info', 'System reset commanded by user. Re-initializing worker to OFFLINE', 'WORKER');
    const result = await api.resetStream();
    if (result.state) {
      setStreamState(result.state);
    } else {
      setStreamState((prev) => ({
        ...prev,
        status: 'OFFLINE',
        errorMessage: null,
        reconnectCountdown: null,
      }));
    }
    setActiveError(null);
  };

  const handleDismissError = async () => {
    await api.clearError();
    setActiveError(null);
    setStreamState((prev) => ({ ...prev, errorMessage: null }));
  };

  const handleModeChange = (mode: PlaybackMode) => {
    setStreamState((prev) => ({ ...prev, playbackMode: mode }));
    addLog(
      'info',
      `Playback mode set to: ${mode === 'single' ? 'Repeat Single Video' : 'Sequential Playlist Loop'}`,
      'WORKER'
    );
  };

  const handleSelectActiveVideo = (id: string) => {
    setStreamState((prev) => ({ ...prev, activeVideoId: id }));
    const video = videos.find((v) => v.id === id);
    if (video) {
      addLog('info', `Active single loop video set: ${video.name}`, 'WORKER');
    }
  };

  const handleReorderPlaylist = (fromIndex: number, toIndex: number) => {
    setVideos((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
    addLog('info', 'Playlist playback sequence updated', 'WORKER');
  };

  const handleDeleteVideo = async (id: string) => {
    await api.deleteVideo(id);
    setVideos((prev) => prev.filter((v) => v.id !== id));
    addLog('info', `Video removed from library: ${id}`, 'WORKER');
  };

  const handleVideoUploaded = (video: VideoItem) => {
    setVideos((prev) => [video, ...prev]);
    setStreamState((prev) => ({ ...prev, activeVideoId: video.id }));
    addLog(
      'success',
      `Video staged to cloud worker: ${video.name} (${Math.round(video.duration)}s)`,
      'WORKER'
    );
  };

  const handleSaveSettings = async (newSettings: StreamSettings) => {
    setSettings(newSettings);
    await api.updateStreamKey(newSettings.streamKey);
    setStreamState((prev) => ({
      ...prev,
      streamKeyConfigured: !!newSettings.streamKey,
      maxReconnectAttempts: newSettings.retryAttempts,
    }));
    addLog('info', 'Stream and worker settings saved successfully', 'WORKER');
  };

  const handleConnectChannel = async (name: string) => {
    const res = await api.connectYouTube(name);
    setStreamState((prev) => ({
      ...prev,
      isYouTubeConnected: true,
      channelName: res.channelName,
    }));
    addLog('success', `YouTube channel connected via Google OAuth: ${name}`, 'YOUTUBE_API');
  };

  const handleDisconnectChannel = async () => {
    await api.disconnectYouTube();
    setStreamState((prev) => ({
      ...prev,
      isYouTubeConnected: false,
      channelName: null,
    }));
    addLog('info', 'YouTube channel disconnected', 'YOUTUBE_API');
  };

  const handleCreateSchedule = async (data: {
    title: string;
    scheduledTime: string;
    playbackMode: PlaybackMode;
    videoIds: string[];
    privacy: 'public' | 'unlisted' | 'private';
  }) => {
    const newSch = await api.createSchedule(data);
    setSchedules((prev) => [newSch, ...prev]);
    addLog(
      'success',
      `Broadcast scheduled: "${data.title}" at ${new Date(data.scheduledTime).toLocaleString()}`,
      'WORKER'
    );
  };

  const handleDeleteSchedule = async (id: string) => {
    await api.deleteSchedule(id);
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    addLog('info', `Scheduled broadcast cancelled: ${id}`, 'WORKER');
  };

  const activeVideo =
    videos.find((v) => v.id === streamState.activeVideoId) || videos[0];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col pb-20 sm:pb-8">
      {/* Top Header */}
      <Header
        lang={lang}
        onToggleLang={handleToggleLang}
        streamState={streamState}
        onOpenYouTubeModal={() => setIsYouTubeModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
      />

      {/* Main Body Content */}
      <main className="max-w-6xl mx-auto w-full px-4 pt-4 sm:pt-6 space-y-5 flex-1">
        {/* Architecture & Decoupling explainer banner */}
        <ArchitectureBanner lang={lang} />

        {/* Android Native Install Card */}
        <div className="bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-900 border border-emerald-500/30 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src="/looplive_logo.svg"
              alt="LoopLive 24/7"
              className="w-10 h-10 rounded-xl object-cover border border-zinc-800 shadow-md shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                <span>{lang === 'en' ? 'LoopLive for Android' : 'एंड्रॉयड के लिए लूपलाइव'}</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/30 shrink-0">
                  WebAPK / PWA
                </span>
              </p>
              <p className="text-[11px] text-zinc-400 truncate">
                {lang === 'en'
                  ? 'Install directly to phone home screen or download app file'
                  : 'सीधे अपने फोन की होम स्क्रीन पर इंस्टॉल या डाउनलोड करें'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDownloadModalOpen(true)}
            className="px-3.5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Install on Android' : 'एंड्रॉयड पर इंस्टॉल'}</span>
          </button>
        </div>

        {/* Live Broadcast Telemetry Card */}
        <LiveStatusCard
          lang={lang}
          streamState={streamState}
          activeVideo={activeVideo}
          onSimulateDrop={handleSimulateDrop}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onOpenDiagnostics={() => setIsDiagnosticsOpen(true)}
          onResetStream={handleResetStream}
        />

        {/* 5 Core Action Buttons */}
        <QuickActions
          lang={lang}
          streamState={streamState}
          onConnectYouTube={() => setIsYouTubeModalOpen(true)}
          onUploadVideo={() => setIsUploadModalOpen(true)}
          onStartLive={handleStartLive}
          onStopLive={handleStopLive}
          onScheduleLive={() => setIsScheduleModalOpen(true)}
          isStarting={isStarting}
        />

        {/* Playback Mode Selector & Playlist Manager */}
        <PlaybackModeSelector
          lang={lang}
          mode={streamState.playbackMode}
          onModeChange={handleModeChange}
          videos={videos}
          activeVideoId={streamState.activeVideoId}
          onSelectActiveVideo={handleSelectActiveVideo}
          onReorderPlaylist={handleReorderPlaylist}
          onDeleteVideo={handleDeleteVideo}
          onUploadClick={() => setIsUploadModalOpen(true)}
        />
      </main>

      {/* Android Mobile Ergonomic Bottom Bar */}
      <BottomNav
        lang={lang}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'playlist') {
            window.scrollTo({ top: 400, behavior: 'smooth' });
          } else if (tab === 'schedule') {
            setIsScheduleModalOpen(true);
          } else if (tab === 'history') {
            setIsHistoryModalOpen(true);
          } else if (tab === 'settings') {
            setIsSettingsModalOpen(true);
          } else if (tab === 'dashboard') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
      />

      {/* Modals & Drawers */}
      <VideoUploadModal
        lang={lang}
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onVideoUploaded={handleVideoUploaded}
      />

      <YouTubeConnectModal
        lang={lang}
        isOpen={isYouTubeModalOpen}
        onClose={() => setIsYouTubeModalOpen(false)}
        streamState={streamState}
        onConnectChannel={handleConnectChannel}
        onDisconnectChannel={handleDisconnectChannel}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />

      <ScheduleModal
        lang={lang}
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        schedules={schedules}
        videos={videos}
        onCreateSchedule={handleCreateSchedule}
        onDeleteSchedule={handleDeleteSchedule}
      />

      <SettingsModal
        lang={lang}
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />

      <StreamHistoryModal
        lang={lang}
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
      />

      <ErrorAndDiagnosticsDrawer
        lang={lang}
        isOpen={isDiagnosticsOpen}
        onClose={() => setIsDiagnosticsOpen(false)}
        logs={logs}
        onClearLogs={() => setLogs([])}
        activeError={activeError}
        onDismissError={handleDismissError}
      />

      <AndroidDownloadModal
        lang={lang}
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </div>
  );
}
