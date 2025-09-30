import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, Min } from 'class-validator';

export class CreateAccessTokenDto {
  @ApiProperty({ description: 'ID do usuário', required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  user_id?: number;

  @ApiProperty({ description: 'ID do vídeo', required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  video_id?: number;

  @ApiProperty({ description: 'ID da playlist', required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  playlist_id?: number;

  @ApiProperty({ description: 'Tempo de expiração em minutos', default: 60 })
  @IsInt()
  @Min(1)
  expiresInMinutes: number = 60;
}
