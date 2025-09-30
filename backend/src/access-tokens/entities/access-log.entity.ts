import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from 'nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Video } from '../../videos/entities/video.entity';

@Entity('access_logs')
export class AccessLog {
  @ApiProperty({ description: 'ID único do log' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'ID do usuário', required: false })
  @Column({ nullable: true })
  user_id: number;

  @ApiProperty({ description: 'ID do vídeo' })
  @Column()
  video_id: number;

  @ApiProperty({ description: 'Endereço IP do acesso' })
  @Column({ type: 'inet' })
  ip_address: string;

  @ApiProperty({ description: 'User Agent do navegador' })
  @Column({ type: 'text' })
  user_agent: string;

  @ApiProperty({ description: 'Data do acesso' })
  @CreateDateColumn()
  accessed_at: Date;

  // Relacionamentos
  @ManyToOne(() => User, user => user.access_logs)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Video, video => video.access_logs)
  @JoinColumn({ name: 'video_id' })
  video: Video;
}
