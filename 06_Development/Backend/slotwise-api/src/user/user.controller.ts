import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { User } from './entities/user.entity';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({ description: 'User registered successfully.' })
  create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'passwordHash'>> {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({ description: 'Users retrieved successfully.' })
  findAll(): Promise<Omit<User, 'passwordHash'>[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user details by ID' })
  @ApiOkResponse({ description: 'User details retrieved successfully.' })
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Omit<User, 'passwordHash'>> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user details' })
  @ApiOkResponse({ description: 'User updated successfully.' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Omit<User, 'passwordHash'>> {
    return this.userService.update(id, updateUserDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update user account status' })
  @ApiOkResponse({ description: 'User status updated successfully.' })
  updateStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserStatusDto: UpdateUserStatusDto,
  ): Promise<Omit<User, 'passwordHash'>> {
    return this.userService.updateStatus(id, updateUserStatusDto);
  }
}
