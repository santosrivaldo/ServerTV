import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from './entities/user.entity';

@ApiTags('Usuários')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 409, description: 'Email ou username já existe' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({ status: 200, description: 'Lista de usuários' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('by-role')
  @ApiOperation({ summary: 'Listar usuários por papel' })
  @ApiQuery({ name: 'role', enum: UserRole, description: 'Papel do usuário' })
  @ApiResponse({ status: 200, description: 'Lista de usuários por papel' })
  findByRole(@Query('role') role: UserRole) {
    return this.usersService.findByRole(role);
  }

  @Get('by-region')
  @ApiOperation({ summary: 'Listar usuários por região' })
  @ApiQuery({ name: 'region', description: 'Nome da região' })
  @ApiResponse({ status: 200, description: 'Lista de usuários por região' })
  findByRegion(@Query('region') region: string) {
    return this.usersService.findByRegion(region);
  }

  @Get('by-sector')
  @ApiOperation({ summary: 'Listar usuários por setor' })
  @ApiQuery({ name: 'sector', description: 'Nome do setor' })
  @ApiResponse({ status: 200, description: 'Lista de usuários por setor' })
  findBySector(@Query('sector') sector: string) {
    return this.usersService.findBySector(sector);
  }

  @Get('by-store')
  @ApiOperation({ summary: 'Listar usuários por loja' })
  @ApiQuery({ name: 'store', description: 'Nome da loja' })
  @ApiResponse({ status: 200, description: 'Lista de usuários por loja' })
  findByStore(@Query('store') store: string) {
    return this.usersService.findByStore(store);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter usuário por ID' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  findOne(@Param('id') id: string) {
    return this.usersService.findById(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 409, description: 'Email ou username já existe' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover usuário' })
  @ApiResponse({ status: 200, description: 'Usuário removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
