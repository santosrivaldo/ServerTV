import React from 'react';
import { useQuery } from 'react-query';
import { statsService } from '../services/statsService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Eye, Video, Users, BarChart3 } from 'lucide-react';

export const Stats: React.FC = () => {
  const { data: overallStats, isLoading: statsLoading } = useQuery(
    'overall-stats',
    statsService.getOverallStats
  );

  const { data: topVideos, isLoading: topVideosLoading } = useQuery(
    'top-videos',
    () => statsService.getTopVideos(10)
  );

  const { data: totalViews, isLoading: viewsLoading } = useQuery(
    'total-views',
    statsService.getTotalViews
  );

  // Dados mockados para demonstração
  const monthlyData = [
    { month: 'Jan', views: 1200, videos: 15 },
    { month: 'Fev', views: 1900, videos: 23 },
    { month: 'Mar', views: 3000, videos: 31 },
    { month: 'Abr', views: 2800, videos: 28 },
    { month: 'Mai', views: 1890, videos: 22 },
    { month: 'Jun', views: 2390, videos: 26 },
  ];

  const regionData = [
    { name: 'São Paulo', value: 45, color: '#3498db' },
    { name: 'Rio de Janeiro', value: 25, color: '#e74c3c' },
    { name: 'Belo Horizonte', value: 15, color: '#f39c12' },
    { name: 'Brasília', value: 10, color: '#27ae60' },
    { name: 'Outros', value: 5, color: '#9b59b6' },
  ];

  if (statsLoading || topVideosLoading || viewsLoading) {
    return (
      <div className="loading">
        <div>Carregando estatísticas...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: '30px', color: '#2c3e50' }}>
        Estatísticas
      </h1>

      {/* Cards de resumo */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '15px'
          }}>
            <Video size={32} style={{ color: '#3498db', marginRight: '10px' }} />
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3498db' }}>
                {overallStats?.totalVideos || 0}
              </div>
              <div style={{ fontSize: '14px', color: '#7f8c8d' }}>
                Total de Vídeos
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '15px'
          }}>
            <Eye size={32} style={{ color: '#e74c3c', marginRight: '10px' }} />
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e74c3c' }}>
                {totalViews || 0}
              </div>
              <div style={{ fontSize: '14px', color: '#7f8c8d' }}>
                Total de Visualizações
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '15px'
          }}>
            <TrendingUp size={32} style={{ color: '#27ae60', marginRight: '10px' }} />
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#27ae60' }}>
                {overallStats?.averageViews || 0}
              </div>
              <div style={{ fontSize: '14px', color: '#7f8c8d' }}>
                Média de Visualizações
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '30px' }}>
        {/* Gráfico de visualizações mensais */}
        <div className="card">
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
            <BarChart3 size={20} style={{ marginRight: '8px' }} />
            Visualizações Mensais
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="views" fill="#3498db" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de distribuição por região */}
        <div className="card">
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
            <Users size={20} style={{ marginRight: '8px' }} />
            Por Região
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={regionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {regionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top vídeos */}
      <div className="card">
        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
          <TrendingUp size={20} style={{ marginRight: '8px' }} />
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
                padding: '15px 0',
                borderBottom: index < topVideos.length - 1 ? '1px solid #eee' : 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{
                    backgroundColor: '#3498db',
                    color: 'white',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    {index + 1}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                      {video.video?.title || 'Vídeo sem título'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#7f8c8d' }}>
                      {video.views_count} visualizações
                    </div>
                  </div>
                </div>
                <div style={{
                  backgroundColor: '#ecf0f1',
                  color: '#2c3e50',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {video.views_count}
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
    </div>
  );
};
