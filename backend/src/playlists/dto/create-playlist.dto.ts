import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { PlaylistLevel } from '../entities/playlist.entity';

export class CreatePlaylistDto {
  @ApiProperty({ description: 'Nome da playlist' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Descrição da playlist', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Nível da playlist', enum: PlaylistLevel })
  @IsEnum(PlaylistLevel)
  level: PlaylistLevel;

  @ApiProperty({ description: 'Valor específico do nível', required: false })
  @IsOptional()
  @IsString()
  level_value?: string;

  @ApiProperty({ description: 'ID do usuário que está criando a playlist' })
  @IsInt()
  @Min(1)
  created_by: number;
}
