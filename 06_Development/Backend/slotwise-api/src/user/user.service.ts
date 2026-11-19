import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcryptjs';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'passwordHash'>> {
    const email = createUserDto.email.trim().toLowerCase();

    const existingUser = await this.userRepository.findOneBy({ email });

    if (existingUser) {
      throw new ConflictException('Email is already registered.');
    }

    const passwordHash = await hash(createUserDto.password, 12);

    const user = this.userRepository.create({
      fullName: createUserDto.fullName.trim(),
      email,
      passwordHash,
      accountStatus: 'ACTIVE',
    });

    const savedUser = await this.userRepository.save(user);

    return this.toSafeUser(savedUser);
  }

  async findAll(): Promise<Omit<User, 'passwordHash'>[]> {
    const users = await this.userRepository.find();

    return users.map((user) => this.toSafeUser(user));
  }

  async findOne(id: string): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.userRepository.findOneBy({
      userId: id,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    return this.toSafeUser(user);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.userRepository.findOneBy({
      userId: id,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    if (updateUserDto.email) {
      const email = updateUserDto.email.trim().toLowerCase();

      const existingUser = await this.userRepository.findOneBy({ email });

      if (existingUser && existingUser.userId !== id) {
        throw new ConflictException('Email is already registered.');
      }

      user.email = email;
    }

    if (updateUserDto.fullName !== undefined) {
      user.fullName = updateUserDto.fullName.trim();
    }

    if (updateUserDto.password !== undefined) {
      user.passwordHash = await hash(updateUserDto.password, 12);
    }

    const updatedUser = await this.userRepository.save(user);

    return this.toSafeUser(updatedUser);
  }

  async updateStatus(
    id: string,
    updateUserStatusDto: UpdateUserStatusDto,
  ): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.userRepository.findOneBy({
      userId: id,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }

    user.accountStatus = updateUserStatusDto.accountStatus;

    const updatedUser = await this.userRepository.save(user);

    return this.toSafeUser(updatedUser);
  }

  private toSafeUser(user: User): Omit<User, 'passwordHash'> {
    return {
      userId: user.userId,
      fullName: user.fullName,
      email: user.email,
      accountStatus: user.accountStatus,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
