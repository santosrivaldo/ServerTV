import { api } from './api';

export interface AccessToken {
  id: number;
  token: string;
  user_id?: number;
  video_id?: number;
  playlist_id?: number;
  expires_at: string;
  is_used: boolean;
  created_at: string;
}

export interface CreateAccessTokenData {
  user_id?: number;
  video_id?: number;
  playlist_id?: number;
  expiresInMinutes: number;
}

export const accessTokensService = {
  async createAccessToken(data: CreateAccessTokenData): Promise<AccessToken> {
    const response = await api.post('/access-tokens', data);
    return response.data;
  },

  async generateVideoAccessToken(videoId: number, expiresInMinutes: number = 60): Promise<AccessToken> {
    const response = await api.post(`/access-tokens/video/${videoId}`, {
      expiresInMinutes,
    });
    return response.data;
  },

  async generatePlaylistAccessToken(playlistId: number, expiresInMinutes: number = 60): Promise<AccessToken> {
    const response = await api.post(`/access-tokens/playlist/${playlistId}`, {
      expiresInMinutes,
    });
    return response.data;
  },

  async validateToken(token: string): Promise<AccessToken> {
    const response = await api.get(`/access-tokens/validate/${token}`);
    return response.data;
  },

  async useToken(token: string): Promise<AccessToken> {
    const response = await api.get(`/access-tokens/use/${token}`);
    return response.data;
  },

  async getAccessLogs(videoId?: number, userId?: number): Promise<any[]> {
    const params = new URLSearchParams();
    if (videoId) params.append('videoId', videoId.toString());
    if (userId) params.append('userId', userId.toString());
    
    const response = await api.get(`/access-tokens/logs?${params.toString()}`);
    return response.data;
  },

  async getTokenStats(): Promise<any> {
    const response = await api.get('/access-tokens/stats');
    return response.data;
  },
};
