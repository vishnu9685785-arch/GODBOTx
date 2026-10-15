export type Language = 'en' | 'hi';

export type StreamStatus = 'OFFLINE' | 'CONNECTING' | 'STREAMING' | 'RECONNECTING' | 'ERROR';

export type PlaybackMode = 'single' | 'playlist';

export interface VideoItem {
  id: string;
  name: string;
  size: number;
  duration: number; // in seconds
  uploadDate: string;
  status: 'ready' | 'processing' | 'error';
  fileBlobUrl?: string;
  resolution?: string;
  isLocalFile?: boolean;
}

export interface StreamState {
  status: StreamStatus;
  playbackMode: PlaybackMode;
  activeVideoId: string | null;
  startedAt: string | null;
  uptimeSeconds: number;
  bitrateKbps: number;
  fps: number;
  droppedFrames: number;
  totalFrames: number;
  lastReconnectAttempt: string | null;
  reconnectCount: number;
  maxReconnectAttempts: number;
  reconnectCountdown: number | null;
  workerRegion: string;
  workerStatus: 'healthy' | 'degraded' | 'offline';
  errorMessage: string | null;
  rtmpUrl: string;
  streamKeyConfigured: boolean;
  channelName: string | null;
  isYouTubeConnected: boolean;
}

export interface StreamSettings {
  rtmpUrl: string;
  streamKey: string;
  resolution: string;
  videoBitrate: number;
  audioBitrate: number;
  fps: number;
  loopCrossfadeSeconds: number;
  retryAttempts: number;
  retryBackoffSeconds: number;
  workerRegion: string;
  autoRestartOnCrash: boolean;
}

export interface ScheduleItem {
  id: string;
  title: string;
  scheduledTime: string;
  playbackMode: PlaybackMode;
  videoIds: string[];
  privacy: 'public' | 'unlisted' | 'private';
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
}

export interface StreamHistorySession {
  id: string;
  title: string;
  startedAt: string;
  endedAt: string;
  durationMinutes: number;
  peakViewers: number;
  totalBytesStreamed: string;
  status: 'COMPLETED' | 'INTERRUPTED' | 'TERMINATED';
  reconnectEvents: number;
  playbackMode: PlaybackMode;
}

export interface DiagnosticsLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
  source: 'WORKER' | 'YOUTUBE_API' | 'FFMPEG' | 'NETWORK';
}
