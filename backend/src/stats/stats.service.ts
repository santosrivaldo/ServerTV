import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VideoStats } from './entities/video-stats.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(VideoStats)
    private videoStatsRepository: Repository<VideoStats>,
  ) {}

  async create(videoId: number): Promise<VideoStats> {
    const stats = this.videoStatsRepository.create({
      video_id: videoId,
      views_count: 0,
    });
    return this.videoStatsRepository.save(stats);
  }

  async findByVideoId(videoId: number): Promise<VideoStats> {
    const stats = await this.videoStatsRepository.findOne({
      where: { video_id: videoId },
    });
    if (!stats) {
      throw new NotFoundException('Estatísticas não encontradas para este vídeo');
    }
    return stats;
  }

  async incrementViews(videoId: number): Promise<VideoStats> {
    const stats = await this.findByVideoId(videoId);
    stats.views_count += 1;
    stats.last_viewed = new Date();
    return this.videoStatsRepository.save(stats);
  }

  async getTopVideos(limit: number = 10): Promise<VideoStats[]> {
    return this.videoStatsRepository.find({
      relations: ['video'],
      order: { views_count: 'DESC' },
      take: limit,
    });
  }

  async getTotalViews(): Promise<number> {
    const result = await this.videoStatsRepository
      .createQueryBuilder('stats')
      .select('SUM(stats.views_count)', 'total')
      .getRawOne();
    return parseInt(result.total) || 0;
  }

  async getVideoViewsByPeriod(startDate: Date, endDate: Date): Promise<any[]> {
    return this.videoStatsRepository
      .createQueryBuilder('stats')
      .leftJoin('stats.video', 'video')
      .select('video.title', 'title')
      .addSelect('stats.views_count', 'views')
      .addSelect('stats.last_viewed', 'lastViewed')
      .where('stats.last_viewed BETWEEN :startDate AND :endDate', { startDate, endDate })
      .orderBy('stats.views_count', 'DESC')
      .getRawMany();
  }

  async getOverallStats(): Promise<any> {
    const totalVideos = await this.videoStatsRepository.count();
    const totalViews = await this.getTotalViews();
    const avgViews = totalVideos > 0 ? totalViews / totalVideos : 0;

    return {
      totalVideos,
      totalViews,
      averageViews: Math.round(avgViews * 100) / 100,
    };
  }
}
