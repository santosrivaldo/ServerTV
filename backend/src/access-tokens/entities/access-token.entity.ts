import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Video } from '../../videos/entities/video.entity';
import { Playlist } from '../../playlists/entities/playlist.entity';

@Entity('access_tokens')
export class AccessToken {
  @ApiProperty({ description: 'ID único do token' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Token de acesso' })
  @Column({ unique: true, length: 255 })
  token: string;

  @ApiProperty({ description: 'ID do usuário', required: false })
  @Column({ nullable: true })
  user_id: number;

  @ApiProperty({ description: 'ID do vídeo', required: false })
  @Column({ nullable: true })
  video_id: number;

  @ApiProperty({ description: 'ID da playlist', required: false })
  @Column({ nullable: true })
  playlist_id: number;

  @ApiProperty({ description: 'Data de expiração do token' })
  @Column()
  expires_at: Date;

  @ApiProperty({ description: 'Status de uso do token' })
  @Column({ default: false })
  is_used: boolean;

  @ApiProperty({ description: 'Data de criação' })
  @CreateDateColumn()
  created_at: Date;

  // Relacionamentos
  @ManyToOne(() => User, user => user.access_tokens)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Video, video => video.access_tokens)
  @JoinColumn({ name: 'video_id' })
  video: Video;

  @ManyToOne(() => Playlist, playlist => playlist.access_tokens)
  @JoinColumn({ name: 'playlist_id' })
  playlist: Playlist;
}
