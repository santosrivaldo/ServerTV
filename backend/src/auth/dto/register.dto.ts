import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

export class RegisterDto {
  @ApiProperty({ description: 'Nome de usuário', example: 'admin' })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({ description: 'Email do usuário', example: 'admin@servertv.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha do usuário', example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ description: 'Papel do usuário', enum: UserRole, required: false })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({ description: 'Região do usuário', required: false })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiProperty({ description: 'Setor do usuário', required: false })
  @IsOptional()
  @IsString()
  sector?: string;

  @ApiProperty({ description: 'Loja do usuário', required: false })
  @IsOptional()
  @IsString()
  store?: string;
}
