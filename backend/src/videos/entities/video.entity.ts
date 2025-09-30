import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { ApiProperty } from 'nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { PlaylistVideo } from '../../playlists/entities/playlist-video.entity';
import { AccessToken } from '../../access-tokens/entities/access-token.entity';
import { AccessLog } from '../../access-tokens/entities/access-log.entity';
import { VideoStats } from '../../stats/entities/video-stats.entity';

@Entity('videos')
export class Video {
  @ApiProperty({ description: 'ID único do vídeo' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Título do vídeo' })
  @Column({ length: 255 })
  title: string;

  @ApiProperty({ description: 'Descrição do vídeo', required: false })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'Nome do arquivo no servidor' })
  @Column({ length: 255 })
  filename: string;

  @ApiProperty({ description: 'Nome original do arquivo' })
  @Column({ length: 255 })
  original_filename: string;

  @ApiProperty({ description: 'Tamanho do arquivo em bytes' })
  @Column({ type: 'bigint' })
  file_size: number;

  @ApiProperty({ description: 'Duração em segundos', required: false })
  @Column({ nullable: true })
  duration: number;

  @ApiProperty({ description: 'Resolução do vídeo', required: false })
  @Column({ length: 20, nullable: true })
  resolution: string;

  @ApiProperty({ description: 'Formato do vídeo', required: false })
  @Column({ length: 20, nullable: true })
  format: string;

  @ApiProperty({ description: 'Caminho da thumbnail', required: false })
  @Column({ length: 255, nullable: true })
  thumbnail_path: string;

  @ApiProperty({ description: 'Tags do vídeo', type: [String], required: false })
  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  @ApiProperty({ description: 'Status de processamento' })
  @Column({ default: false })
  is_processed: boolean;

  @ApiProperty({ description: 'ID do usuário que criou o vídeo' })
  @Column()
  created_by: number;

  @ApiProperty({ description: 'Data de criação' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Data de atualização' })
  @UpdateDateColumn()
  updated_at: Date;

  // Relacionamentos
  @ManyToOne(() => User, user => user.videos)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @OneToMany(() => PlaylistVideo, playlistVideo => playlistVideo.video)
  playlist_videos: PlaylistVideo[];

  @OneToMany(() => AccessToken, token => token.video)
  access_tokens: AccessToken[];

  @OneToMany(() => AccessLog, log => log.video)
  access_logs: AccessLog[];

  @OneToOne(() => VideoStats, stats => stats.video)
  stats: VideoStats;
}
