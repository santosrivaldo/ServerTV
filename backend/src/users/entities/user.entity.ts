import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Video } from '../../videos/entities/video.entity';
import { Playlist } from '../../playlists/entities/playlist.entity';
import { AccessToken } from '../../access-tokens/entities/access-token.entity';
import { AccessLog } from '../../access-tokens/entities/access-log.entity';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  USER = 'user',
}

@Entity('users')
export class User {
  @ApiProperty({ description: 'ID único do usuário' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nome de usuário' })
  @Column({ unique: true, length: 50 })
  username: string;

  @ApiProperty({ description: 'Email do usuário' })
  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 255 })
  password_hash: string;

  @ApiProperty({ description: 'Papel do usuário', enum: UserRole })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @ApiProperty({ description: 'Região do usuário', required: false })
  @Column({ nullable: true, length: 100 })
  region: string;

  @ApiProperty({ description: 'Setor do usuário', required: false })
  @Column({ nullable: true, length: 100 })
  sector: string;

  @ApiProperty({ description: 'Loja do usuário', required: false })
  @Column({ nullable: true, length: 100 })
  store: string;

  @ApiProperty({ description: 'Status ativo do usuário' })
  @Column({ default: true })
  is_active: boolean;

  @ApiProperty({ description: 'Data de criação' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Data de atualização' })
  @UpdateDateColumn()
  updated_at: Date;

  // Relacionamentos
  @OneToMany(() => Video, video => video.created_by)
  videos: Video[];

  @OneToMany(() => Playlist, playlist => playlist.created_by)
  playlists: Playlist[];

  @OneToMany(() => AccessToken, token => token.user)
  access_tokens: AccessToken[];

  @OneToMany(() => AccessLog, log => log.user)
  access_logs: AccessLog[];
}
