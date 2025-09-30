import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { ApiProperty } from 'nestjs/swagger';
import { Playlist } from './playlist.entity';
import { Video } from '../../videos/entities/video.entity';

@Entity('playlist_videos')
@Unique(['playlist_id', 'video_id'])
export class PlaylistVideo {
  @ApiProperty({ description: 'ID único da associação' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'ID da playlist' })
  @Column()
  playlist_id: number;

  @ApiProperty({ description: 'ID do vídeo' })
  @Column()
  video_id: number;

  @ApiProperty({ description: 'Ordem do vídeo na playlist' })
  @Column({ default: 0 })
  order_index: number;

  @ApiProperty({ description: 'Data de adição à playlist' })
  @CreateDateColumn()
  added_at: Date;

  // Relacionamentos
  @ManyToOne(() => Playlist, playlist => playlist.playlist_videos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'playlist_id' })
  playlist: Playlist;

  @ManyToOne(() => Video, video => video.playlist_videos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'video_id' })
  video: Video;
}
