import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Playlist } from './entities/playlist.entity';
import { PlaylistVideo } from './entities/playlist-video.entity';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { AddVideoToPlaylistDto } from './dto/add-video-to-playlist.dto';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private playlistsRepository: Repository<Playlist>,
    @InjectRepository(PlaylistVideo)
    private playlistVideosRepository: Repository<PlaylistVideo>,
  ) {}

  async create(createPlaylistDto: CreatePlaylistDto): Promise<Playlist> {
    const playlist = this.playlistsRepository.create(createPlaylistDto);
    return this.playlistsRepository.save(playlist);
  }

  async findAll(): Promise<Playlist[]> {
    return this.playlistsRepository.find({
      relations: ['creator', 'playlist_videos', 'playlist_videos.video'],
      order: { created_at: 'DESC' },
    });
  }

  async findById(id: number): Promise<Playlist> {
    const playlist = await this.playlistsRepository.findOne({
      where: { id },
      relations: ['creator', 'playlist_videos', 'playlist_videos.video'],
    });
    if (!playlist) {
      throw new NotFoundException('Playlist não encontrada');
    }
    return playlist;
  }

  async update(id: number, updatePlaylistDto: UpdatePlaylistDto): Promise<Playlist> {
    const playlist = await this.findById(id);
    Object.assign(playlist, updatePlaylistDto);
    return this.playlistsRepository.save(playlist);
  }

  async remove(id: number): Promise<void> {
    const playlist = await this.findById(id);
    await this.playlistsRepository.remove(playlist);
  }

  async addVideoToPlaylist(playlistId: number, addVideoDto: AddVideoToPlaylistDto): Promise<PlaylistVideo> {
    const playlist = await this.findById(playlistId);
    
    // Verificar se o vídeo já está na playlist
    const existingVideo = await this.playlistVideosRepository.findOne({
      where: { playlist_id: playlistId, video_id: addVideoDto.video_id },
    });

    if (existingVideo) {
      throw new ConflictException('Vídeo já está na playlist');
    }

    const playlistVideo = this.playlistVideosRepository.create({
      playlist_id: playlistId,
      video_id: addVideoDto.video_id,
      order_index: addVideoDto.order_index || 0,
    });

    return this.playlistVideosRepository.save(playlistVideo);
  }

  async removeVideoFromPlaylist(playlistId: number, videoId: number): Promise<void> {
    const playlistVideo = await this.playlistVideosRepository.findOne({
      where: { playlist_id: playlistId, video_id: videoId },
    });

    if (!playlistVideo) {
      throw new NotFoundException('Vídeo não encontrado na playlist');
    }

    await this.playlistVideosRepository.remove(playlistVideo);
  }

  async reorderVideosInPlaylist(playlistId: number, videoOrders: { video_id: number; order_index: number }[]): Promise<void> {
    for (const order of videoOrders) {
      await this.playlistVideosRepository.update(
        { playlist_id: playlistId, video_id: order.video_id },
        { order_index: order.order_index }
      );
    }
  }

  async findByLevel(level: string, levelValue?: string): Promise<Playlist[]> {
    const query = this.playlistsRepository.createQueryBuilder('playlist')
      .leftJoinAndSelect('playlist.creator', 'creator')
      .leftJoinAndSelect('playlist.playlist_videos', 'playlist_videos')
      .leftJoinAndSelect('playlist_videos.video', 'video')
      .where('playlist.level = :level', { level })
      .andWhere('playlist.is_active = :isActive', { isActive: true });

    if (levelValue) {
      query.andWhere('playlist.level_value = :levelValue', { levelValue });
    }

    return query.orderBy('playlist.created_at', 'DESC').getMany();
  }

  async findByUser(userId: number): Promise<Playlist[]> {
    return this.playlistsRepository.find({
      where: { created_by: userId },
      relations: ['creator', 'playlist_videos', 'playlist_videos.video'],
      order: { created_at: 'DESC' },
    });
  }
}
