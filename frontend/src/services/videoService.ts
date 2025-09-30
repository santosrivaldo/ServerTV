import { api } from './api';

export interface Video {
  id: number;
  title: string;
  description?: string;
  filename: string;
  original_filename: string;
  file_size: number;
  duration?: number;
  resolution?: string;
  format?: string;
  thumbnail_path?: string;
  tags: string[];
  is_processed: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
  creator?: {
    id: number;
    username: string;
    email: string;
  };
  stats?: {
    views_count: number;
    last_viewed?: string;
  };
}

export interface CreateVideoData {
  title: string;
  description?: string;
  tags?: string[];
  created_by: number;
}

export const videoService = {
  async getVideos(): Promise<Video[]> {
    const response = await api.get('/videos');
    return response.data;
  },

  async getVideo(id: number): Promise<Video> {
    const response = await api.get(`/videos/${id}`);
    return response.data;
  },

  async createVideo(videoData: CreateVideoData, file: File): Promise<Video> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', videoData.title);
    formData.append('created_by', videoData.created_by.toString());
    
    if (videoData.description) {
      formData.append('description', videoData.description);
    }
    
    if (videoData.tags) {
      formData.append('tags', JSON.stringify(videoData.tags));
    }

    const response = await api.post('/videos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async updateVideo(id: number, videoData: Partial<CreateVideoData>): Promise<Video> {
    const response = await api.patch(`/videos/${id}`, videoData);
    return response.data;
  },

  async deleteVideo(id: number): Promise<void> {
    await api.delete(`/videos/${id}`);
  },

  async searchVideos(query: string, tags?: string[]): Promise<Video[]> {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (tags) params.append('tags', tags.join(','));
    
    const response = await api.get(`/videos/search?${params.toString()}`);
    return response.data;
  },

  async getVideoStream(id: number, quality: string = '720p'): Promise<string> {
    return `${api.defaults.baseURL}/videos/${id}/stream/${quality}`;
  },

  async getVideoThumbnail(id: number): Promise<string> {
    return `${api.defaults.baseURL}/videos/${id}/thumbnail`;
  },
};
