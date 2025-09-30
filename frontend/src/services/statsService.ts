import { api } from './api';

export interface VideoStats {
  id: number;
  video_id: number;
  views_count: number;
  last_viewed?: string;
  created_at: string;
  updated_at: string;
  video?: {
    id: number;
    title: string;
  };
}

export interface OverallStats {
  totalVideos: number;
  totalViews: number;
  averageViews: number;
}

export const statsService = {
  async getVideoStats(videoId: number): Promise<VideoStats> {
    const response = await api.get(`/stats/video/${videoId}`);
    return response.data;
  },

  async getTopVideos(limit: number = 10): Promise<VideoStats[]> {
    const response = await api.get(`/stats/top-videos?limit=${limit}`);
    return response.data;
  },

  async getTotalViews(): Promise<number> {
    const response = await api.get('/stats/total-views');
    return response.data;
  },

  async getViewsByPeriod(startDate: string, endDate: string): Promise<any[]> {
    const response = await api.get(`/stats/period?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },

  async getOverallStats(): Promise<OverallStats> {
    const response = await api.get('/stats/overall');
    return response.data;
  },
};
