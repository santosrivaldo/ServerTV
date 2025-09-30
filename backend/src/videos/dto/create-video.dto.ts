import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsInt, Min } from 'class-validator';

export class CreateVideoDto {
  @ApiProperty({ description: 'Título do vídeo' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Descrição do vídeo', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Tags do vídeo', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ description: 'ID do usuário que está criando o vídeo' })
  @IsInt()
  @Min(1)
  created_by: number;
}
