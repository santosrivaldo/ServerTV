import React from 'react';
import { useQuery } from 'react-query';
import { statsService } from '../services/statsService';
import { videoService } from '../services/videoService';
import { playlistService } from '../services/playlistService';
import { userService } from '../services/userService';
import { 
  Video, 
  Users, 
  Eye, 
  TrendingUp,
  Clock,
  BarChart3
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { data: overallStats, isLoading: statsLoading } = useQuery(
    'overall-stats',
    statsService.getOverallStats
  );

  const { data: videos, isLoading: videosLoading } = useQuery(
    'videos',
    videoService.getVideos
  );

  const { data: playlists, isLoading: playlistsLoading } = useQuery(
    'playlists',
    playlistService.getPlaylists
  );

  const { data: users, isLoading: usersLoading } = useQuery(
    'users',
    userService.getUsers
  );

  const { data: topVideos, isLoading: topVideosLoading } = useQuery(
    'top-videos',
    () => statsService.getTopVideos(5)
  );

  const stats = [
    {
      title: 'Total de Vídeos',
      value: overallStats?.totalVideos || 0,
      icon: Video,
      color: '#3498db',
    },
    {
      title: 'Total de Visualizações',
      value: overallStats?.totalViews || 0,
      icon: Eye,
      color: '#e74c3c',
    },
    {
      title: 'Playlists',
      value: playlists?.length || 0,
      icon: TrendingUp,
      color: '#27ae60',
    },
    {
      title: 'Usuários',
      value: users?.length || 0,
      icon: Users,
      color: '#f39c12',
    },
  ];

  if (statsLoading || videosLoading || playlistsLoading || usersLoading) {
    return (
      <div className="loading">
        <div>Carregando dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: '30px', color: '#2c3e50' }}>
        Dashboard
      </h1>

      {/* Estatísticas principais */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        {stats.map((stat, index) => (
          <div key={index} className="card" style={{ textAlign: 'center' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: '15px'
            }}>
              <stat.icon size={32} style={{ color: stat.color, marginRight: '10px' }} />
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: stat.color }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '14px', color: '#7f8c8d' }}>
                  {stat.title}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Vídeos mais assistidos */}
        <div className="card">
          <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
            <BarChart3 size={20} style={{ marginRight: '8px' }} />
            Vídeos Mais Assistidos
          </h3>
          {topVideosLoading ? (
            <div>Carregando...</div>
          ) : topVideos && topVideos.length > 0 ? (
            <div>
              {topVideos.map((video, index) => (
                <div key={video.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: index < topVideos.length - 1 ? '1px solid #eee' : 'none'
                }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {video.video?.title || 'Vídeo sem título'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                      {video.views_count} visualizações
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: '#3498db',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: '#7f8c8d', textAlign: 'center', padding: '20px' }}>
              Nenhum vídeo encontrado
            </div>
          )}
        </div>

        {/* Atividade recente */}
        <div className="card">
          <h3 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
            <Clock size={20} style={{ marginRight: '8px' }} />
            Atividade Recente
          </h3>
          <div style={{ color: '#7f8c8d', textAlign: 'center', padding: '20px' }}>
            Em desenvolvimento...
          </div>
        </div>
      </div>
    </div>
  );
};
