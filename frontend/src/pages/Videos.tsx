import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { videoService } from '../services/videoService';
import type { Video } from '../services/videoService';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { 
  Plus, 
  Search, 
  Upload, 
  Play, 
  Edit, 
  Trash2,
  Eye,
  Clock
} from 'lucide-react';

export const Videos: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: videos, isLoading } = useQuery(
    'videos',
    videoService.getVideos
  );

  const deleteVideoMutation = useMutation(
    (id: number) => videoService.deleteVideo(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('videos');
        toast.success('Vídeo removido com sucesso!');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Erro ao remover vídeo');
      },
    }
  );

  const filteredVideos = videos?.filter(video =>
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="loading">
        <div>Carregando vídeos...</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ margin: 0, color: '#2c3e50' }}>
          Vídeos ({filteredVideos.length})
        </h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowUploadModal(true)}
        >
          <Plus size={18} />
          Adicionar Vídeo
        </button>
      </div>

      {/* Barra de busca */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Search size={20} style={{ color: '#7f8c8d' }} />
          <input
            type="text"
            placeholder="Buscar vídeos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ flex: 1, margin: 0 }}
          />
        </div>
      </div>

      {/* Lista de vídeos */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '20px' 
      }}>
        {filteredVideos.map((video) => (
          <div key={video.id} className="card">
            <div style={{ marginBottom: '15px' }}>
              {video.thumbnail_path ? (
                <img
                  src={videoService.getVideoThumbnail(video.id)}
                  alt={video.title}
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '4px',
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '150px',
                  backgroundColor: '#ecf0f1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  color: '#7f8c8d'
                }}>
                  <Video size={48} />
                </div>
              )}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <h3 style={{ 
                margin: '0 0 8px 0', 
                fontSize: '16px',
                color: '#2c3e50'
              }}>
                {video.title}
              </h3>
              {video.description && (
                <p style={{ 
                  margin: '0 0 8px 0', 
                  fontSize: '14px', 
                  color: '#7f8c8d',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {video.description}
                </p>
              )}
            </div>

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '15px',
              fontSize: '12px',
              color: '#7f8c8d'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Eye size={14} />
                  {video.stats?.views_count || 0}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={14} />
                  {formatDuration(video.duration)}
                </div>
              </div>
              <div>
                {formatFileSize(video.file_size)}
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              {video.tags && video.tags.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {video.tags.map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: '#ecf0f1',
                        color: '#2c3e50',
                        padding: '2px 6px',
                        borderRadius: '12px',
                        fontSize: '10px',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '8px',
              justifyContent: 'flex-end'
            }}>
              <button
                className="btn btn-primary"
                onClick={() => setSelectedVideo(video)}
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                <Play size={14} />
                Assistir
              </button>
              <button
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                <Edit size={14} />
                Editar
              </button>
              <button
                className="btn btn-danger"
                onClick={() => deleteVideoMutation.mutate(video.id)}
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                <Trash2 size={14} />
                Remover
              </button>
            </div>

            <div style={{ 
              marginTop: '10px', 
              padding: '8px', 
              backgroundColor: video.is_processed ? '#d4edda' : '#fff3cd',
              borderRadius: '4px',
              fontSize: '12px',
              textAlign: 'center'
            }}>
              {video.is_processed ? '✅ Processado' : '⏳ Processando...'}
            </div>
          </div>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <Video size={48} style={{ color: '#7f8c8d', marginBottom: '15px' }} />
          <h3 style={{ color: '#7f8c8d', marginBottom: '10px' }}>
            Nenhum vídeo encontrado
          </h3>
          <p style={{ color: '#7f8c8d' }}>
            {searchQuery ? 'Tente ajustar sua busca' : 'Adicione seu primeiro vídeo'}
          </p>
        </div>
      )}
    </div>
  );
};
