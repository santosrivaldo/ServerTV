import { Controller, Get, Post, Body, Param, UseGuards, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AccessTokensService } from './access-tokens.service';
import { CreateAccessTokenDto } from './dto/create-access-token.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Tokens de Acesso')
@Controller('access-tokens')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AccessTokensController {
  constructor(private readonly accessTokensService: AccessTokensService) {}

  @Post()
  @ApiOperation({ summary: 'Criar token de acesso' })
  @ApiResponse({ status: 201, description: 'Token criado com sucesso' })
  create(@Body() createAccessTokenDto: CreateAccessTokenDto) {
    return this.accessTokensService.create(createAccessTokenDto);
  }

  @Post('video/:videoId')
  @ApiOperation({ summary: 'Gerar token de acesso para vídeo' })
  @ApiResponse({ status: 201, description: 'Token gerado com sucesso' })
  generateVideoToken(
    @Param('videoId') videoId: string,
    @Body() createAccessTokenDto: CreateAccessTokenDto,
    @Req() req: any,
  ) {
    return this.accessTokensService.generateVideoAccessToken(
      req.user.id,
      +videoId,
      createAccessTokenDto.expiresInMinutes,
    );
  }

  @Post('playlist/:playlistId')
  @ApiOperation({ summary: 'Gerar token de acesso para playlist' })
  @ApiResponse({ status: 201, description: 'Token gerado com sucesso' })
  generatePlaylistToken(
    @Param('playlistId') playlistId: string,
    @Body() createAccessTokenDto: CreateAccessTokenDto,
    @Req() req: any,
  ) {
    return this.accessTokensService.generatePlaylistAccessToken(
      req.user.id,
      +playlistId,
      createAccessTokenDto.expiresInMinutes,
    );
  }

  @Get('validate/:token')
  @ApiOperation({ summary: 'Validar token de acesso' })
  @ApiResponse({ status: 200, description: 'Token válido' })
  @ApiResponse({ status: 401, description: 'Token inválido ou expirado' })
  validateToken(@Param('token') token: string) {
    return this.accessTokensService.validateToken(token);
  }

  @Get('use/:token')
  @ApiOperation({ summary: 'Usar token de acesso' })
  @ApiResponse({ status: 200, description: 'Token utilizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Token inválido ou expirado' })
  useToken(@Param('token') token: string, @Req() req: any) {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');
    return this.accessTokensService.useToken(token, ipAddress, userAgent);
  }

  @Get('logs')
  @ApiOperation({ summary: 'Obter logs de acesso' })
  @ApiQuery({ name: 'videoId', description: 'ID do vídeo', required: false })
  @ApiQuery({ name: 'userId', description: 'ID do usuário', required: false })
  @ApiResponse({ status: 200, description: 'Logs de acesso' })
  getAccessLogs(@Query('videoId') videoId?: string, @Query('userId') userId?: string) {
    return this.accessTokensService.getAccessLogs(
      videoId ? +videoId : undefined,
      userId ? +userId : undefined,
    );
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obter estatísticas dos tokens' })
  @ApiResponse({ status: 200, description: 'Estatísticas dos tokens' })
  getTokenStats() {
    return this.accessTokensService.getTokenStats();
  }
}
