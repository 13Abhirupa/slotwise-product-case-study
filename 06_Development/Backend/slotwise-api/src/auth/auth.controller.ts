import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import type { AuthenticatedUser } from './decorators/current-user.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Authenticate user and generate JWT access token' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the currently authenticated user' })
  getProfile(@CurrentUser() user: AuthenticatedUser) {
    return user;
  }

  @Get('manager-access-check')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'MANAGER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Test owner and manager role access' })
  managerAccessCheck(@CurrentUser() user: AuthenticatedUser) {
    return {
      message: 'Manager access granted',
      userId: user.userId,
      role: user.role,
      businessId: user.businessId,
    };
  }

  @Get('staff-access-check')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STAFF')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Test staff-only role access' })
  staffAccessCheck(@CurrentUser() user: AuthenticatedUser) {
    return {
      message: 'Staff access granted',
      userId: user.userId,
      role: user.role,
      businessId: user.businessId,
    };
  }
}
