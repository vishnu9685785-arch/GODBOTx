import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));

// In-memory state for Cloud Streaming Worker simulation & real state tracking
interface VideoItem {
  id: string;
  name: string;
  size: number;
  duration: number; // in seconds
  url?: string;
  thumbnail?: string;
  uploadDate: string;
  status: 'ready' | 'processing' | 'error';
}

interface StreamState {
  status: 'OFFLINE' | 'CONNECTING' | 'STREAMING' | 'RECONNECTING' | 'ERROR';
  playbackMode: 'single' | 'playlist';
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

const state: StreamState = {
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
};

let videos: VideoItem[] = [
  {
    id: 'v1',
    name: 'Devotional_Bhajan_Meditation_4K.mp4',
    size: 245000000,
    duration: 1845, // ~30 mins
    uploadDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'ready',
  },
  {
    id: 'v2',
    name: 'Lofi_Chill_Beats_Study_Loop.mp4',
    size: 512000000,
    duration: 3600, // 60 mins
    uploadDate: new Date(Date.now() - 86400000).toISOString(),
    status: 'ready',
  },
  {
    id: 'v3',
    name: 'Nature_Rain_Thunderstorm_Ambience.mp4',
    size: 380000000,
    duration: 2700, // 45 mins
    uploadDate: new Date().toISOString(),
    status: 'ready',
  },
];

interface ScheduleItem {
  id: string;
  title: string;
  scheduledTime: string;
  playbackMode: 'single' | 'playlist';
  videoIds: string[];
  privacy: 'public' | 'unlisted' | 'private';
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
}

let schedules: ScheduleItem[] = [
  {
    id: 'sch-1',
    title: 'Morning 24/7 Bhajan Live Stream',
    scheduledTime: new Date(Date.now() + 3600000 * 4).toISOString(),
    playbackMode: 'single',
    videoIds: ['v1'],
    privacy: 'public',
    status: 'upcoming',
  },
];

interface StreamHistorySession {
  id: string;
  title: string;
  startedAt: string;
  endedAt: string;
  durationMinutes: number;
  peakViewers: number;
  totalBytesStreamed: string;
  status: 'COMPLETED' | 'INTERRUPTED' | 'TERMINATED';
  reconnectEvents: number;
  playbackMode: 'single' | 'playlist';
}

const history: StreamHistorySession[] = [
  {
    id: 'hist-101',
    title: 'Lofi Chill Study Session (Continuous 24/7)',
    startedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    endedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    durationMinutes: 1440,
    peakViewers: 842,
    totalBytesStreamed: '48.6 GB',
    status: 'COMPLETED',
    reconnectEvents: 1,
    playbackMode: 'single',
  },
  {
    id: 'hist-102',
    title: 'Rain Ambience Sleep Loop Stream',
    startedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    endedAt: new Date(Date.now() - 86400000 * 4 + 7200000).toISOString(),
    durationMinutes: 1560,
    peakViewers: 1290,
    totalBytesStreamed: '52.1 GB',
    status: 'COMPLETED',
    reconnectEvents: 0,
    playbackMode: 'playlist',
  },
];

// Background ticker for stream uptime and telemetry simulation
setInterval(() => {
  if (state.status === 'STREAMING') {
    state.uptimeSeconds += 1;
    // Slight realistic fluctuation in bitrate & fps
    state.bitrateKbps = Math.floor(4450 + Math.random() * 120);
    state.fps = Math.floor(59.5 + Math.random() * 0.8);
    state.totalFrames += 60;
  } else if (state.status === 'RECONNECTING') {
    if (state.reconnectCountdown && state.reconnectCountdown > 1) {
      state.reconnectCountdown -= 1;
    } else {
      // Reconnect retry executed
      state.reconnectCount += 1;
      state.lastReconnectAttempt = new Date().toISOString();
      if (state.reconnectCount >= state.maxReconnectAttempts) {
        state.status = 'ERROR';
        state.errorMessage = 'Exceeded maximum reconnect attempts (5/5). YouTube RTMP endpoint unreachable.';
        state.reconnectCountdown = null;
      } else {
        // Successful auto-reconnect back to STREAMING!
        state.status = 'STREAMING';
        state.errorMessage = null;
        state.reconnectCountdown = null;
      }
    }
  }
}, 1000);

// API Endpoints
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'LoopLive 24/7 Cloud Streaming Worker Bridge',
    time: new Date().toISOString(),
    uptime: process.uptime(),
    workerRegion: state.workerRegion,
  });
});

app.get('/api/status', (_req: Request, res: Response) => {
  res.json(state);
});

app.get('/api/videos', (_req: Request, res: Response) => {
  res.json({ videos });
});

app.post('/api/videos/upload', (req: Request, res: Response) => {
  const { name, size, duration } = req.body;
  if (!name) {
    res.status(400).json({ error: 'Video name is required' });
    return;
  }
  const newVideo: VideoItem = {
    id: `v_${Date.now()}`,
    name,
    size: size || 1024 * 1024 * 50,
    duration: duration || 300,
    uploadDate: new Date().toISOString(),
    status: 'ready',
  };
  videos.unshift(newVideo);
  res.json({ success: true, video: newVideo });
});

app.delete('/api/videos/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  videos = videos.filter((v) => v.id !== id);
  res.json({ success: true });
});

app.post('/api/stream/start', (req: Request, res: Response) => {
  const { mode, videoId, streamKey } = req.body;
  if (!state.streamKeyConfigured && !streamKey) {
    res.status(400).json({
      error: 'Stream key is required before initiating YouTube live stream',
      code: 'MISSING_STREAM_KEY',
    });
    return;
  }
  if (streamKey) {
    state.streamKeyConfigured = true;
  }

  state.status = 'STREAMING';
  state.startedAt = new Date().toISOString();
  state.uptimeSeconds = 0;
  state.bitrateKbps = 4500;
  state.fps = 60;
  state.droppedFrames = 0;
  state.playbackMode = mode || state.playbackMode;
  if (videoId) state.activeVideoId = videoId;
  state.errorMessage = null;
  state.reconnectCount = 0;

  res.json({
    success: true,
    message: 'Cloud Streaming Worker started 24/7 loop successfully',
    state,
  });
});

app.post('/api/stream/stop', (_req: Request, res: Response) => {
  if (state.status === 'STREAMING' || state.status === 'RECONNECTING') {
    // Record to history
    const session: StreamHistorySession = {
      id: `hist-${Date.now()}`,
      title: state.playbackMode === 'single' ? 'Single Video 24/7 Loop' : 'Playlist Sequential 24/7 Loop',
      startedAt: state.startedAt || new Date().toISOString(),
      endedAt: new Date().toISOString(),
      durationMinutes: Math.max(1, Math.round(state.uptimeSeconds / 60)),
      peakViewers: Math.floor(100 + Math.random() * 450),
      totalBytesStreamed: `${((state.uptimeSeconds * 4.5) / 8 / 1024).toFixed(2)} GB`,
      status: 'COMPLETED',
      reconnectEvents: state.reconnectCount,
      playbackMode: state.playbackMode,
    };
    history.unshift(session);
  }

  state.status = 'OFFLINE';
  state.startedAt = null;
  state.uptimeSeconds = 0;
  state.bitrateKbps = 0;
  state.fps = 0;
  state.reconnectCountdown = null;
  state.errorMessage = null;

  res.json({
    success: true,
    message: 'Cloud Streaming Worker halted stream safely',
    state,
  });
});

app.post('/api/stream/simulate-drop', (_req: Request, res: Response) => {
  if (state.status !== 'STREAMING') {
    res.status(400).json({ error: 'Stream must be active to simulate a drop' });
    return;
  }
  state.status = 'RECONNECTING';
  state.reconnectCountdown = 8;
  state.lastReconnectAttempt = new Date().toISOString();
  state.bitrateKbps = 0;
  state.fps = 0;
  state.droppedFrames += 42;
  state.errorMessage = 'RTMP socket closed unexpectedly by YouTube ingest server. Auto-retry scheduled.';

  res.json({
    success: true,
    message: 'Simulated connection drop triggered. Auto-retry countdown initiated.',
    state,
  });
});

app.post('/api/stream/clear-error', (_req: Request, res: Response) => {
  state.errorMessage = null;
  if (state.status === 'ERROR') {
    state.status = 'OFFLINE';
  }
  res.json({ success: true, state });
});

app.post('/api/stream/reset', (_req: Request, res: Response) => {
  state.status = 'OFFLINE';
  state.startedAt = null;
  state.uptimeSeconds = 0;
  state.bitrateKbps = 0;
  state.fps = 0;
  state.reconnectCount = 0;
  state.reconnectCountdown = null;
  state.errorMessage = null;
  res.json({ success: true, message: 'Stream state reset to OFFLINE', state });
});

app.get('/api/history', (_req: Request, res: Response) => {
  res.json({ history });
});

app.get('/api/schedules', (_req: Request, res: Response) => {
  res.json({ schedules });
});

app.post('/api/schedules', (req: Request, res: Response) => {
  const { title, scheduledTime, playbackMode, videoIds, privacy } = req.body;
  const newSchedule: ScheduleItem = {
    id: `sch-${Date.now()}`,
    title: title || 'Scheduled 24/7 Live Stream',
    scheduledTime: scheduledTime || new Date(Date.now() + 3600000).toISOString(),
    playbackMode: playbackMode || 'single',
    videoIds: videoIds || ['v1'],
    privacy: privacy || 'public',
    status: 'upcoming',
  };
  schedules.unshift(newSchedule);
  res.json({ success: true, schedule: newSchedule });
});

app.delete('/api/schedules/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  schedules = schedules.filter((s) => s.id !== id);
  res.json({ success: true });
});

app.post('/api/settings/stream-key', (req: Request, res: Response) => {
  const { streamKey } = req.body;
  if (streamKey && streamKey.trim().length > 0) {
    state.streamKeyConfigured = true;
    res.json({ success: true, message: 'Stream key configured securely' });
  } else {
    state.streamKeyConfigured = false;
    res.json({ success: true, message: 'Stream key cleared' });
  }
});

app.post('/api/youtube/connect', (req: Request, res: Response) => {
  const { channelName } = req.body;
  state.isYouTubeConnected = true;
  state.channelName = channelName || 'Official Creator Studio Channel';
  res.json({
    success: true,
    channelName: state.channelName,
    isYouTubeConnected: true,
  });
});

app.post('/api/youtube/disconnect', (_req: Request, res: Response) => {
  state.isYouTubeConnected = false;
  state.channelName = null;
  res.json({ success: true });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LoopLive 24/7 server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
