import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Video } from '../../videos/entities/video.entity';

@Entity('video_stats')
export class VideoStats {
  @ApiProperty({ description: 'ID único das estatísticas' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'ID do vídeo' })
  @Column()
  video_id: number;

  @ApiProperty({ description: 'Número de visualizações' })
  @Column({ default: 0 })
  views_count: number;

  @ApiProperty({ description: 'Data da última visualização', required: false })
  @Column({ nullable: true })
  last_viewed: Date;

  @ApiProperty({ description: 'Data de criação' })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Data de atualização' })
  @UpdateDateColumn()
  updated_at: Date;

  // Relacionamentos
  @OneToOne(() => Video, video => video.stats)
  @JoinColumn({ name: 'video_id' })
  video: Video;
}
