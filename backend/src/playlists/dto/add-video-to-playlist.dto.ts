import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class AddVideoToPlaylistDto {
  @ApiProperty({ description: 'ID do vídeo' })
  @IsInt()
  @Min(1)
  video_id: number;

  @ApiProperty({ description: 'Ordem do vídeo na playlist', required: false })
  @IsInt()
  @Min(0)
  order_index?: number;
}
