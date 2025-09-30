import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'username', 'email', 'role', 'region', 'sector', 'store', 'is_active', 'created_at', 'updated_at'],
    });
  }

  async findById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    
    // Verificar se email já existe em outro usuário
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('Email já está em uso');
      }
    }

    // Verificar se username já existe em outro usuário
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.findByUsername(updateUserDto.username);
      if (existingUser) {
        throw new ConflictException('Nome de usuário já está em uso');
      }
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findById(id);
    await this.usersRepository.remove(user);
  }

  async findByRole(role: UserRole): Promise<User[]> {
    return this.usersRepository.find({
      where: { role },
      select: ['id', 'username', 'email', 'role', 'region', 'sector', 'store', 'is_active', 'created_at', 'updated_at'],
    });
  }

  async findByRegion(region: string): Promise<User[]> {
    return this.usersRepository.find({
      where: { region },
      select: ['id', 'username', 'email', 'role', 'region', 'sector', 'store', 'is_active', 'created_at', 'updated_at'],
    });
  }

  async findBySector(sector: string): Promise<User[]> {
    return this.usersRepository.find({
      where: { sector },
      select: ['id', 'username', 'email', 'role', 'region', 'sector', 'store', 'is_active', 'created_at', 'updated_at'],
    });
  }

  async findByStore(store: string): Promise<User[]> {
    return this.usersRepository.find({
      where: { store },
      select: ['id', 'username', 'email', 'role', 'region', 'sector', 'store', 'is_active', 'created_at', 'updated_at'],
    });
  }
}
