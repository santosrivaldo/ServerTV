import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { videoService } from '../services/videoService';
import { accessTokensService } from '../services/accessTokensService';
import { toast } from 'react-toastify';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react';

export const VideoPlayer: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [quality, setQuality] = useState('720p');
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const { data: video, isLoading } = useQuery(
    ['video', videoId],
    () => videoService.getVideo(Number(videoId)),
    { enabled: !!videoId }
  );

  useEffect(() => {
    if (videoId) {
      // Gerar token de acesso para o vídeo
      accessTokensService.generateVideoAccessToken(Number(videoId), 60)
        .then((token) => {
          setAccessToken(token.token);
        })
        .catch((error) => {
          toast.error('Erro ao gerar token de acesso');
          console.error(error);
        });
    }
  }, [videoId]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="loading">
        <div>Carregando vídeo...</div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="error">
        <div>Vídeo não encontrado</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>
          {video.title}
        </h1>
        {video.description && (
          <p style={{ color: '#7f8c8d', margin: '0 0 15px 0' }}>
            {video.description}
          </p>
        )}
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          fontSize: '14px', 
          color: '#7f8c8d' 
        }}>
          <span>{video.duration ? formatTime(video.duration) : 'N/A'}</span>
          <span>{video.resolution || 'N/A'}</span>
          <span>{video.stats?.views_count || 0} visualizações</span>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ position: 'relative', backgroundColor: '#000' }}>
          {/* Player de vídeo */}
          <div style={{ 
            width: '100%', 
            height: '500px', 
            backgroundColor: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            {accessToken ? (
              <video
                controls
                style={{ width: '100%', height: '100%' }}
                src={`${videoService.getVideoStream(video.id, quality)}?token=${accessToken}`}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
              />
            ) : (
              <div style={{ 
                color: 'white', 
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px'
              }}>
                <div style={{ fontSize: '48px' }}>🎬</div>
                <div>Carregando vídeo...</div>
              </div>
            )}
          </div>

          {/* Controles customizados */}
          <div style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <button
              onClick={handlePlayPause}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '10px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: 'white', fontSize: '12px' }}>
                {formatTime(currentTime)}
              </span>
              <div style={{ flex: 1, height: '4px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '2px' }}>
                <div style={{
                  width: `${(currentTime / duration) * 100}%`,
                  height: '100%',
                  backgroundColor: '#3498db',
                  borderRadius: '2px'
                }} />
              </div>
              <span style={{ color: 'white', fontSize: '12px' }}>
                {formatTime(duration)}
              </span>
            </div>

            <button
              onClick={handleMute}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '10px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              style={{ width: '80px' }}
            />

            <select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '8px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              <option value="480p">480p</option>
              <option value="720p">720p</option>
              <option value="1080p">1080p</option>
            </select>

            <button
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                padding: '10px',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Informações adicionais */}
      <div style={{ marginTop: '20px' }}>
        <div className="card">
          <h3 style={{ marginBottom: '15px' }}>Informações do Vídeo</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div>
              <strong>Título:</strong> {video.title}
            </div>
            <div>
              <strong>Duração:</strong> {video.duration ? formatTime(video.duration) : 'N/A'}
            </div>
            <div>
              <strong>Resolução:</strong> {video.resolution || 'N/A'}
            </div>
            <div>
              <strong>Tamanho:</strong> {(video.file_size / (1024 * 1024)).toFixed(2)} MB
            </div>
            <div>
              <strong>Formato:</strong> {video.format || 'N/A'}
            </div>
            <div>
              <strong>Visualizações:</strong> {video.stats?.views_count || 0}
            </div>
            <div>
              <strong>Criado em:</strong> {new Date(video.created_at).toLocaleDateString('pt-BR')}
            </div>
            <div>
              <strong>Status:</strong> {video.is_processed ? 'Processado' : 'Processando...'}
            </div>
          </div>

          {video.tags && video.tags.length > 0 && (
            <div style={{ marginTop: '15px' }}>
              <strong>Tags:</strong>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                {video.tags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: '#ecf0f1',
                      color: '#2c3e50',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
