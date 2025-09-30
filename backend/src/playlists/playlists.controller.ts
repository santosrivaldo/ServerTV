import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { UpdatePlaylistDto } from './dto/update-playlist.dto';
import { AddVideoToPlaylistDto } from './dto/add-video-to-playlist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PlaylistLevel } from './entities/playlist.entity';

@ApiTags('Playlists')
@Controller('playlists')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PlaylistsController {
  constructor(private readonly playlistsService: PlaylistsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar nova playlist' })
  @ApiResponse({ status: 201, description: 'Playlist criada com sucesso' })
  create(@Body() createPlaylistDto: CreatePlaylistDto) {
    return this.playlistsService.create(createPlaylistDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as playlists' })
  @ApiResponse({ status: 200, description: 'Lista de playlists' })
  findAll() {
    return this.playlistsService.findAll();
  }

  @Get('by-level')
  @ApiOperation({ summary: 'Listar playlists por nível' })
  @ApiQuery({ name: 'level', enum: PlaylistLevel, description: 'Nível da playlist' })
  @ApiQuery({ name: 'levelValue', description: 'Valor específico do nível', required: false })
  @ApiResponse({ status: 200, description: 'Lista de playlists por nível' })
  findByLevel(@Query('level') level: PlaylistLevel, @Query('levelValue') levelValue?: string) {
    return this.playlistsService.findByLevel(level, levelValue);
  }

  @Get('by-user/:userId')
  @ApiOperation({ summary: 'Listar playlists por usuário' })
  @ApiResponse({ status: 200, description: 'Lista de playlists do usuário' })
  findByUser(@Param('userId') userId: string) {
    return this.playlistsService.findByUser(+userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter playlist por ID' })
  @ApiResponse({ status: 200, description: 'Playlist encontrada' })
  @ApiResponse({ status: 404, description: 'Playlist não encontrada' })
  findOne(@Param('id') id: string) {
    return this.playlistsService.findById(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar playlist' })
  @ApiResponse({ status: 200, description: 'Playlist atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Playlist não encontrada' })
  update(@Param('id') id: string, @Body() updatePlaylistDto: UpdatePlaylistDto) {
    return this.playlistsService.update(+id, updatePlaylistDto);
  }

  @Post(':id/videos')
  @ApiOperation({ summary: 'Adicionar vídeo à playlist' })
  @ApiResponse({ status: 201, description: 'Vídeo adicionado à playlist' })
  @ApiResponse({ status: 404, description: 'Playlist não encontrada' })
  @ApiResponse({ status: 409, description: 'Vídeo já está na playlist' })
  addVideo(@Param('id') id: string, @Body() addVideoDto: AddVideoToPlaylistDto) {
    return this.playlistsService.addVideoToPlaylist(+id, addVideoDto);
  }

  @Delete(':id/videos/:videoId')
  @ApiOperation({ summary: 'Remover vídeo da playlist' })
  @ApiResponse({ status: 200, description: 'Vídeo removido da playlist' })
  @ApiResponse({ status: 404, description: 'Vídeo não encontrado na playlist' })
  removeVideo(@Param('id') id: string, @Param('videoId') videoId: string) {
    return this.playlistsService.removeVideoFromPlaylist(+id, +videoId);
  }

  @Patch(':id/reorder')
  @ApiOperation({ summary: 'Reordenar vídeos na playlist' })
  @ApiResponse({ status: 200, description: 'Vídeos reordenados com sucesso' })
  reorderVideos(@Param('id') id: string, @Body() videoOrders: { video_id: number; order_index: number }[]) {
    return this.playlistsService.reorderVideosInPlaylist(+id, videoOrders);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover playlist' })
  @ApiResponse({ status: 200, description: 'Playlist removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Playlist não encontrada' })
  remove(@Param('id') id: string) {
    return this.playlistsService.remove(+id);
  }
}
