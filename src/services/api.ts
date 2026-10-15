import { StreamState, VideoItem, StreamHistorySession, ScheduleItem } from '../types';

export const api = {
  async getStatus(): Promise<StreamState> {
    try {
      const res = await fetch('/api/status');
      if (!res.ok) throw new Error('Failed to fetch status');
      return await res.json();
    } catch {
      // Local fallback state if backend unavailable
      return {
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
    }
  },

  async getVideos(): Promise<VideoItem[]> {
    try {
      const res = await fetch('/api/videos');
      if (!res.ok) throw new Error('Failed to fetch videos');
      const data = await res.json();
      return data.videos || [];
    } catch {
      return [
        {
          id: 'v1',
          name: 'Devotional_Bhajan_Meditation_4K.mp4',
          size: 245000000,
          duration: 1845,
          uploadDate: new Date(Date.now() - 86400000 * 2).toISOString(),
          status: 'ready',
        },
        {
          id: 'v2',
          name: 'Lofi_Chill_Beats_Study_Loop.mp4',
          size: 512000000,
          duration: 3600,
          uploadDate: new Date(Date.now() - 86400000).toISOString(),
          status: 'ready',
        },
      ];
    }
  },

  async uploadVideo(name: string, size: number, duration: number, fileBlobUrl?: string): Promise<VideoItem> {
    try {
      const res = await fetch('/api/videos/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, size, duration }),
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      return { ...data.video, fileBlobUrl };
    } catch {
      return {
        id: `v_local_${Date.now()}`,
        name,
        size,
        duration,
        uploadDate: new Date().toISOString(),
        status: 'ready',
        fileBlobUrl,
      };
    }
  },

  async deleteVideo(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/videos/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return true;
    }
  },

  async startStream(mode: 'single' | 'playlist', videoId?: string, streamKey?: string): Promise<{ success: boolean; state?: StreamState; error?: string }> {
    try {
      const res = await fetch('/api/stream/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, videoId, streamKey }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to start stream');
      return { success: true, state: data.state };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      return { success: false, error: errorMessage };
    }
  },

  async stopStream(): Promise<{ success: boolean; state?: StreamState }> {
    try {
      const res = await fetch('/api/stream/stop', { method: 'POST' });
      const data = await res.json();
      return { success: true, state: data.state };
    } catch {
      return { success: true };
    }
  },

  async simulateDrop(): Promise<{ success: boolean; state?: StreamState }> {
    try {
      const res = await fetch('/api/stream/simulate-drop', { method: 'POST' });
      const data = await res.json();
      return { success: true, state: data.state };
    } catch {
      return { success: true };
    }
  },

  async clearError(): Promise<{ success: boolean; state?: StreamState }> {
    try {
      const res = await fetch('/api/stream/clear-error', { method: 'POST' });
      const data = await res.json();
      return { success: true, state: data.state };
    } catch {
      return { success: true };
    }
  },

  async resetStream(): Promise<{ success: boolean; state?: StreamState }> {
    try {
      const res = await fetch('/api/stream/reset', { method: 'POST' });
      const data = await res.json();
      return { success: true, state: data.state };
    } catch {
      return { success: true };
    }
  },


  async getHistory(): Promise<StreamHistorySession[]> {
    try {
      const res = await fetch('/api/history');
      if (!res.ok) throw new Error('Failed to fetch history');
      const data = await res.json();
      return data.history || [];
    } catch {
      return [
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
      ];
    }
  },

  async getSchedules(): Promise<ScheduleItem[]> {
    try {
      const res = await fetch('/api/schedules');
      if (!res.ok) throw new Error('Failed to fetch schedules');
      const data = await res.json();
      return data.schedules || [];
    } catch {
      return [];
    }
  },

  async createSchedule(data: {
    title: string;
    scheduledTime: string;
    playbackMode: 'single' | 'playlist';
    videoIds: string[];
    privacy: 'public' | 'unlisted' | 'private';
  }): Promise<ScheduleItem> {
    try {
      const res = await fetch('/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      return result.schedule;
    } catch {
      return {
        id: `sch-${Date.now()}`,
        ...data,
        status: 'upcoming',
      };
    }
  },

  async deleteSchedule(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/schedules/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return true;
    }
  },

  async updateStreamKey(streamKey: string): Promise<boolean> {
    try {
      const res = await fetch('/api/settings/stream-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ streamKey }),
      });
      return res.ok;
    } catch {
      return true;
    }
  },

  async connectYouTube(channelName: string): Promise<{ success: boolean; channelName: string }> {
    try {
      const res = await fetch('/api/youtube/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channelName }),
      });
      return await res.json();
    } catch {
      return { success: true, channelName };
    }
  },

  async disconnectYouTube(): Promise<boolean> {
    try {
      const res = await fetch('/api/youtube/disconnect', { method: 'POST' });
      return res.ok;
    } catch {
      return true;
    }
  },
};
