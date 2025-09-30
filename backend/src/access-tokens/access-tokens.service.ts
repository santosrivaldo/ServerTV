import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessToken } from './entities/access-token.entity';
import { AccessLog } from './entities/access-log.entity';
import { CreateAccessTokenDto } from './dto/create-access-token.dto';
import { StatsService } from '../stats/stats.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AccessTokensService {
  constructor(
    @InjectRepository(AccessToken)
    private accessTokensRepository: Repository<AccessToken>,
    @InjectRepository(AccessLog)
    private accessLogsRepository: Repository<AccessLog>,
    private statsService: StatsService,
  ) {}

  async create(createAccessTokenDto: CreateAccessTokenDto): Promise<AccessToken> {
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + createAccessTokenDto.expiresInMinutes);

    const accessToken = this.accessTokensRepository.create({
      ...createAccessTokenDto,
      token,
      expires_at: expiresAt,
    });

    return this.accessTokensRepository.save(accessToken);
  }

  async validateToken(token: string): Promise<AccessToken> {
    const accessToken = await this.accessTokensRepository.findOne({
      where: { token },
      relations: ['user', 'video', 'playlist'],
    });

    if (!accessToken) {
      throw new UnauthorizedException('Token inválido');
    }

    if (accessToken.is_used) {
      throw new UnauthorizedException('Token já foi utilizado');
    }

    if (new Date() > accessToken.expires_at) {
      throw new UnauthorizedException('Token expirado');
    }

    return accessToken;
  }

  async useToken(token: string, ipAddress: string, userAgent: string): Promise<AccessToken> {
    const accessToken = await this.validateToken(token);
    
    // Marcar token como usado
    accessToken.is_used = true;
    await this.accessTokensRepository.save(accessToken);

    // Registrar log de acesso
    if (accessToken.video_id) {
      await this.accessLogsRepository.save({
        user_id: accessToken.user_id,
        video_id: accessToken.video_id,
        ip_address: ipAddress,
        user_agent: userAgent,
      });

      // Atualizar estatísticas
      await this.statsService.incrementViews(accessToken.video_id);
    }

    return accessToken;
  }

  async generateVideoAccessToken(userId: number, videoId: number, expiresInMinutes: number = 60): Promise<AccessToken> {
    return this.create({
      user_id: userId,
      video_id: videoId,
      expiresInMinutes,
    });
  }

  async generatePlaylistAccessToken(userId: number, playlistId: number, expiresInMinutes: number = 60): Promise<AccessToken> {
    return this.create({
      user_id: userId,
      playlist_id: playlistId,
      expiresInMinutes,
    });
  }

  async getAccessLogs(videoId?: number, userId?: number): Promise<AccessLog[]> {
    const query = this.accessLogsRepository.createQueryBuilder('log')
      .leftJoinAndSelect('log.user', 'user')
      .leftJoinAndSelect('log.video', 'video');

    if (videoId) {
      query.where('log.video_id = :videoId', { videoId });
    }

    if (userId) {
      query.andWhere('log.user_id = :userId', { userId });
    }

    return query.orderBy('log.accessed_at', 'DESC').getMany();
  }

  async getTokenStats(): Promise<any> {
    const totalTokens = await this.accessTokensRepository.count();
    const usedTokens = await this.accessTokensRepository.count({ where: { is_used: true } });
    const expiredTokens = await this.accessTokensRepository
      .createQueryBuilder('token')
      .where('token.expires_at < :now', { now: new Date() })
      .getCount();

    return {
      total: totalTokens,
      used: usedTokens,
      expired: expiredTokens,
      active: totalTokens - usedTokens - expiredTokens,
    };
  }
}
