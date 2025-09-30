import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { playlistService, Playlist } from '../services/playlistService';
import { toast } from 'react-toastify';
import { Plus, Search, List, Edit, Trash2, Play } from 'lucide-react';

export const Playlists: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const queryClient = useQueryClient();

  const { data: playlists, isLoading } = useQuery(
    'playlists',
    playlistService.getPlaylists
  );

  const deletePlaylistMutation = useMutation(
    (id: number) => playlistService.deletePlaylist(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('playlists');
        toast.success('Playlist removida com sucesso!');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Erro ao remover playlist');
      },
    }
  );

  const filteredPlaylists = playlists?.filter(playlist =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    playlist.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const getLevelLabel = (level: string) => {
    const labels = {
      general: 'Geral',
      region: 'Região',
      sector: 'Setor',
      store: 'Loja'
    };
    return labels[level as keyof typeof labels] || level;
  };

  const getLevelColor = (level: string) => {
    const colors = {
      general: '#3498db',
      region: '#e74c3c',
      sector: '#f39c12',
      store: '#27ae60'
    };
    return colors[level as keyof typeof colors] || '#7f8c8d';
  };

  if (isLoading) {
    return (
      <div className="loading">
        <div>Carregando playlists...</div>
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
          Playlists ({filteredPlaylists.length})
        </h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={18} />
          Nova Playlist
        </button>
      </div>

      {/* Barra de busca */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Search size={20} style={{ color: '#7f8c8d' }} />
          <input
            type="text"
            placeholder="Buscar playlists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ flex: 1, margin: 0 }}
          />
        </div>
      </div>

      {/* Lista de playlists */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
        gap: '20px' 
      }}>
        {filteredPlaylists.map((playlist) => (
          <div key={playlist.id} className="card">
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: '15px'
            }}>
              <div>
                <h3 style={{ 
                  margin: '0 0 8px 0', 
                  fontSize: '18px',
                  color: '#2c3e50'
                }}>
                  {playlist.name}
                </h3>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  <span style={{
                    backgroundColor: getLevelColor(playlist.level),
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {getLevelLabel(playlist.level)}
                  </span>
                  {playlist.level_value && (
                    <span style={{ 
                      fontSize: '12px', 
                      color: '#7f8c8d',
                      backgroundColor: '#ecf0f1',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {playlist.level_value}
                    </span>
                  )}
                </div>
              </div>
              <div style={{
                backgroundColor: playlist.is_active ? '#d4edda' : '#f8d7da',
                color: playlist.is_active ? '#155724' : '#721c24',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '10px',
                fontWeight: 'bold'
              }}>
                {playlist.is_active ? 'ATIVA' : 'INATIVA'}
              </div>
            </div>

            {playlist.description && (
              <p style={{ 
                margin: '0 0 15px 0', 
                fontSize: '14px', 
                color: '#7f8c8d',
                lineHeight: '1.4'
              }}>
                {playlist.description}
              </p>
            )}

            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '15px',
              fontSize: '12px',
              color: '#7f8c8d'
            }}>
              <div>
                {playlist.playlist_videos?.length || 0} vídeos
              </div>
              <div>
                Criada em {new Date(playlist.created_at).toLocaleDateString('pt-BR')}
              </div>
            </div>

            <div style={{ 
              display: 'flex', 
              gap: '8px',
              justifyContent: 'flex-end'
            }}>
              <button
                className="btn btn-primary"
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                <Play size={14} />
                Reproduzir
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
                onClick={() => deletePlaylistMutation.mutate(playlist.id)}
                style={{ padding: '6px 12px', fontSize: '12px' }}
              >
                <Trash2 size={14} />
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredPlaylists.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <List size={48} style={{ color: '#7f8c8d', marginBottom: '15px' }} />
          <h3 style={{ color: '#7f8c8d', marginBottom: '10px' }}>
            Nenhuma playlist encontrada
          </h3>
          <p style={{ color: '#7f8c8d' }}>
            {searchQuery ? 'Tente ajustar sua busca' : 'Crie sua primeira playlist'}
          </p>
        </div>
      )}
    </div>
  );
};
