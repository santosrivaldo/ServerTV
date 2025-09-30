import { api } from './api';

export interface Playlist {
  id: number;
  name: string;
  description?: string;
  level: 'general' | 'region' | 'sector' | 'store';
  level_value?: string;
  is_active: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
  creator?: {
    id: number;
    username: string;
    email: string;
  };
  playlist_videos?: {
    id: number;
    order_index: number;
    video: {
      id: number;
      title: string;
      thumbnail_path?: string;
      duration?: number;
    };
  }[];
}

export interface CreatePlaylistData {
  name: string;
  description?: string;
  level: 'general' | 'region' | 'sector' | 'store';
  level_value?: string;
  created_by: number;
}

export interface AddVideoToPlaylistData {
  video_id: number;
  order_index?: number;
}

export const playlistService = {
  async getPlaylists(): Promise<Playlist[]> {
    const response = await api.get('/playlists');
    return response.data;
  },

  async getPlaylist(id: number): Promise<Playlist> {
    const response = await api.get(`/playlists/${id}`);
    return response.data;
  },

  async createPlaylist(playlistData: CreatePlaylistData): Promise<Playlist> {
    const response = await api.post('/playlists', playlistData);
    return response.data;
  },

  async updatePlaylist(id: number, playlistData: Partial<CreatePlaylistData>): Promise<Playlist> {
    const response = await api.patch(`/playlists/${id}`, playlistData);
    return response.data;
  },

  async deletePlaylist(id: number): Promise<void> {
    await api.delete(`/playlists/${id}`);
  },

  async getPlaylistsByLevel(level: string, levelValue?: string): Promise<Playlist[]> {
    const params = new URLSearchParams();
    params.append('level', level);
    if (levelValue) params.append('levelValue', levelValue);
    
    const response = await api.get(`/playlists/by-level?${params.toString()}`);
    return response.data;
  },

  async getPlaylistsByUser(userId: number): Promise<Playlist[]> {
    const response = await api.get(`/playlists/by-user/${userId}`);
    return response.data;
  },

  async addVideoToPlaylist(playlistId: number, videoData: AddVideoToPlaylistData): Promise<void> {
    await api.post(`/playlists/${playlistId}/videos`, videoData);
  },

  async removeVideoFromPlaylist(playlistId: number, videoId: number): Promise<void> {
    await api.delete(`/playlists/${playlistId}/videos/${videoId}`);
  },

  async reorderVideosInPlaylist(playlistId: number, videoOrders: { video_id: number; order_index: number }[]): Promise<void> {
    await api.patch(`/playlists/${playlistId}/reorder`, videoOrders);
  },
};
