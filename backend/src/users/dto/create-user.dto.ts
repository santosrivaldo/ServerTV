import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ description: 'Nome de usuário' })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({ description: 'Email do usuário' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Hash da senha' })
  @IsString()
  password_hash: string;

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

  @ApiProperty({ description: 'Status ativo do usuário', required: false })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
