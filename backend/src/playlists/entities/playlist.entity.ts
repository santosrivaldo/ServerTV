import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { PlaylistVideo } from './playlist-video.entity';
import { AccessToken } from '../../access-tokens/entities/access-token.entity';

export enum PlaylistLevel {
  GENERAL = 'general',
  REGION = 'region',
  SECTOR = 'sector',
  STORE = 'store',
}

@Entity('playlists')
export class Playlist {
  @ApiProperty({ description: 'ID único da playlist' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nome da playlist' })
  @Column({ length: 255 })
  name: string;

  @ApiProperty({ description: 'Descrição da playlist', required: false })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'Nível da playlist', enum: PlaylistLevel })
  @Column({ type: 'enum', enum: PlaylistLevel })
  level: PlaylistLevel;

  @ApiProperty({ description: 'Valor específico do nível (ex: "São Paulo" para região)', required: false })
  @Column({ length: 100, nullable: true })
  level_value: string;

  @ApiProperty({ description: 'Status ativo da playlist' })
  @Column({ default: true })
  is_active: boolean;

  @ApiProperty({ description: 'ID do usuário que criou a playlist' })
  @Column()
  created_by: number;

  @ApiProperty({ description: 'Data de criação' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Data de atualização' })
  @UpdateDateColumn()
  updated_at: Date;

  // Relacionamentos
  @ManyToOne(() => User, user => user.playlists)
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @OneToMany(() => PlaylistVideo, playlistVideo => playlistVideo.playlist)
  playlist_videos: PlaylistVideo[];

  @OneToMany(() => AccessToken, token => token.playlist)
  access_tokens: AccessToken[];
}
