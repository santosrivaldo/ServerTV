import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from './entities/video.entity';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { StatsService } from '../stats/stats.service';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private videosRepository: Repository<Video>,
    private statsService: StatsService,
  ) {}

  async create(createVideoDto: CreateVideoDto, file: Express.Multer.File): Promise<Video> {
    const filename = `${Date.now()}-${file.originalname}`;
    const filePath = path.join('/app/videos', filename);
    
    // Salvar arquivo
    fs.writeFileSync(filePath, file.buffer);

    // Obter informações do vídeo usando FFprobe
    const videoInfo = await this.getVideoInfo(filePath);

    const video = this.videosRepository.create({
      ...createVideoDto,
      filename,
      original_filename: file.originalname,
      file_size: file.size,
      duration: videoInfo.duration,
      resolution: videoInfo.resolution,
      format: videoInfo.format,
    });

    const savedVideo = await this.videosRepository.save(video);

    // Criar estatísticas para o vídeo
    await this.statsService.create(savedVideo.id);

    // Iniciar transcodificação em background
    this.transcodeVideo(savedVideo.id, filePath).catch(console.error);

    return savedVideo;
  }

  async findAll(): Promise<Video[]> {
    return this.videosRepository.find({
      relations: ['creator', 'stats'],
      order: { created_at: 'DESC' },
    });
  }

  async findById(id: number): Promise<Video> {
    const video = await this.videosRepository.findOne({
      where: { id },
      relations: ['creator', 'stats'],
    });
    if (!video) {
      throw new NotFoundException('Vídeo não encontrado');
    }
    return video;
  }

  async update(id: number, updateVideoDto: UpdateVideoDto): Promise<Video> {
    const video = await this.findById(id);
    Object.assign(video, updateVideoDto);
    return this.videosRepository.save(video);
  }

  async remove(id: number): Promise<void> {
    const video = await this.findById(id);
    
    // Remover arquivos do sistema de arquivos
    const filePath = path.join('/app/videos', video.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remover arquivos transcodificados
    const baseName = path.parse(video.filename).name;
    const transcodedDir = path.join('/app/videos', 'transcoded', baseName);
    if (fs.existsSync(transcodedDir)) {
      fs.rmSync(transcodedDir, { recursive: true, force: true });
    }

    await this.videosRepository.remove(video);
  }

  async getVideoStream(id: number, quality: string = '720p'): Promise<string> {
    const video = await this.findById(id);
    const baseName = path.parse(video.filename).name;
    const transcodedDir = path.join('/app/videos', 'transcoded', baseName);
    
    // Verificar se o vídeo foi transcodificado
    if (!fs.existsSync(transcodedDir)) {
      throw new BadRequestException('Vídeo ainda não foi processado');
    }

    const manifestPath = path.join(transcodedDir, `${quality}.m3u8`);
    if (!fs.existsSync(manifestPath)) {
      throw new BadRequestException(`Qualidade ${quality} não disponível`);
    }

    return manifestPath;
  }

  async getThumbnail(id: number): Promise<string> {
    const video = await this.findById(id);
    
    if (video.thumbnail_path && fs.existsSync(video.thumbnail_path)) {
      return video.thumbnail_path;
    }

    // Gerar thumbnail se não existir
    const filePath = path.join('/app/videos', video.filename);
    const thumbnailPath = path.join('/app/videos', 'thumbnails', `${video.id}.jpg`);
    
    if (!fs.existsSync(path.dirname(thumbnailPath))) {
      fs.mkdirSync(path.dirname(thumbnailPath), { recursive: true });
    }

    try {
      await execAsync(`ffmpeg -i "${filePath}" -ss 00:00:01 -vframes 1 -q:v 2 "${thumbnailPath}"`);
      
      // Atualizar caminho da thumbnail no banco
      video.thumbnail_path = thumbnailPath;
      await this.videosRepository.save(video);
      
      return thumbnailPath;
    } catch (error) {
      throw new BadRequestException('Erro ao gerar thumbnail');
    }
  }

  private async getVideoInfo(filePath: string): Promise<any> {
    try {
      const { stdout } = await execAsync(`ffprobe -v quiet -print_format json -show_format -show_streams "${filePath}"`);
      const info = JSON.parse(stdout);
      
      const videoStream = info.streams.find(stream => stream.codec_type === 'video');
      const duration = Math.floor(parseFloat(info.format.duration));
      const resolution = videoStream ? `${videoStream.width}x${videoStream.height}` : null;
      const format = info.format.format_name;

      return { duration, resolution, format };
    } catch (error) {
      return { duration: null, resolution: null, format: null };
    }
  }

  private async transcodeVideo(videoId: number, filePath: string): Promise<void> {
    try {
      const video = await this.findById(videoId);
      const baseName = path.parse(video.filename).name;
      const transcodedDir = path.join('/app/videos', 'transcoded', baseName);
      
      if (!fs.existsSync(transcodedDir)) {
        fs.mkdirSync(transcodedDir, { recursive: true });
      }

      // Transcodificar para diferentes qualidades
      const qualities = [
        { name: '480p', resolution: '854x480', bitrate: '1000k' },
        { name: '720p', resolution: '1280x720', bitrate: '2500k' },
        { name: '1080p', resolution: '1920x1080', bitrate: '5000k' },
      ];

      for (const quality of qualities) {
        const outputPath = path.join(transcodedDir, `${quality.name}.m3u8`);
        const segmentPath = path.join(transcodedDir, `${quality.name}_%03d.ts`);
        
        await execAsync(`ffmpeg -i "${filePath}" -c:v libx264 -c:a aac -b:v ${quality.bitrate} -s ${quality.resolution} -f hls -hls_time 10 -hls_list_size 0 -hls_segment_filename "${segmentPath}" "${outputPath}"`);
      }

      // Marcar vídeo como processado
      video.is_processed = true;
      await this.videosRepository.save(video);

    } catch (error) {
      console.error('Erro na transcodificação:', error);
    }
  }

  async searchVideos(query: string, tags?: string[]): Promise<Video[]> {
    const qb = this.videosRepository.createQueryBuilder('video')
      .leftJoinAndSelect('video.creator', 'creator')
      .leftJoinAndSelect('video.stats', 'stats');

    if (query) {
      qb.where('video.title ILIKE :query OR video.description ILIKE :query', {
        query: `%${query}%`,
      });
    }

    if (tags && tags.length > 0) {
      qb.andWhere('video.tags && :tags', { tags });
    }

    return qb.orderBy('video.created_at', 'DESC').getMany();
  }
}
