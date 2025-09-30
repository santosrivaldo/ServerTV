import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { StatsService } from './stats.service';

@ApiTags('Estatísticas')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('video/:videoId')
  @ApiOperation({ summary: 'Obter estatísticas de um vídeo' })
  @ApiResponse({ status: 200, description: 'Estatísticas do vídeo' })
  @ApiResponse({ status: 404, description: 'Vídeo não encontrado' })
  getVideoStats(@Param('videoId') videoId: string) {
    return this.statsService.findByVideoId(+videoId);
  }

  @Get('top-videos')
  @ApiOperation({ summary: 'Obter vídeos mais assistidos' })
  @ApiQuery({ name: 'limit', description: 'Número de vídeos', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista dos vídeos mais assistidos' })
  getTopVideos(@Query('limit') limit?: string) {
    return this.statsService.getTopVideos(limit ? +limit : 10);
  }

  @Get('total-views')
  @ApiOperation({ summary: 'Obter total de visualizações' })
  @ApiResponse({ status: 200, description: 'Total de visualizações' })
  getTotalViews() {
    return this.statsService.getTotalViews();
  }

  @Get('period')
  @ApiOperation({ summary: 'Obter visualizações por período' })
  @ApiQuery({ name: 'startDate', description: 'Data inicial (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', description: 'Data final (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Visualizações por período' })
  getViewsByPeriod(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.statsService.getVideoViewsByPeriod(start, end);
  }

  @Get('overall')
  @ApiOperation({ summary: 'Obter estatísticas gerais' })
  @ApiResponse({ status: 200, description: 'Estatísticas gerais do sistema' })
  getOverallStats() {
    return this.statsService.getOverallStats();
  }
}
