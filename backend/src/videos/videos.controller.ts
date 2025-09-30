import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Query, Res, StreamableFile } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { VideosService } from './videos.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('Vídeos')
@Controller('videos')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload de vídeo' })
  @ApiResponse({ status: 201, description: 'Vídeo enviado com sucesso' })
  @ApiResponse({ status: 400, description: 'Arquivo inválido' })
  create(@Body() createVideoDto: CreateVideoDto, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('Arquivo é obrigatório');
    }
    return this.videosService.create(createVideoDto, file);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os vídeos' })
  @ApiResponse({ status: 200, description: 'Lista de vídeos' })
  findAll() {
    return this.videosService.findAll();
  }

  @Get('search')
  @ApiOperation({ summary: 'Buscar vídeos' })
  @ApiQuery({ name: 'q', description: 'Termo de busca', required: false })
  @ApiQuery({ name: 'tags', description: 'Tags para filtrar', required: false, type: [String] })
  @ApiResponse({ status: 200, description: 'Resultados da busca' })
  search(@Query('q') query: string, @Query('tags') tags: string) {
    const tagArray = tags ? tags.split(',') : undefined;
    return this.videosService.searchVideos(query, tagArray);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter vídeo por ID' })
  @ApiResponse({ status: 200, description: 'Vídeo encontrado' })
  @ApiResponse({ status: 404, description: 'Vídeo não encontrado' })
  findOne(@Param('id') id: string) {
    return this.videosService.findById(+id);
  }

  @Get(':id/stream/:quality')
  @ApiOperation({ summary: 'Obter stream do vídeo' })
  @ApiResponse({ status: 200, description: 'Stream do vídeo' })
  @ApiResponse({ status: 404, description: 'Vídeo não encontrado' })
  async getStream(@Param('id') id: string, @Param('quality') quality: string, @Res() res: Response) {
    const streamPath = await this.videosService.getVideoStream(+id, quality);
    const stream = fs.createReadStream(streamPath);
    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    stream.pipe(res);
  }

  @Get(':id/thumbnail')
  @ApiOperation({ summary: 'Obter thumbnail do vídeo' })
  @ApiResponse({ status: 200, description: 'Thumbnail do vídeo' })
  @ApiResponse({ status: 404, description: 'Vídeo não encontrado' })
  async getThumbnail(@Param('id') id: string, @Res() res: Response) {
    const thumbnailPath = await this.videosService.getThumbnail(+id);
    const thumbnail = fs.createReadStream(thumbnailPath);
    res.setHeader('Content-Type', 'image/jpeg');
    thumbnail.pipe(res);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar vídeo' })
  @ApiResponse({ status: 200, description: 'Vídeo atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Vídeo não encontrado' })
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videosService.update(+id, updateVideoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover vídeo' })
  @ApiResponse({ status: 200, description: 'Vídeo removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Vídeo não encontrado' })
  remove(@Param('id') id: string) {
    return this.videosService.remove(+id);
  }
}
