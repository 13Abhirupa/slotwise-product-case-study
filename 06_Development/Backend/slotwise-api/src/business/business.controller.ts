import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { BusinessService } from './business.service';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Business } from './entities/business.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Business')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Get()
  @ApiOperation({ summary: 'Get authenticated business' })
  @ApiOkResponse({ description: 'Authenticated business details.' })
  findAll(@CurrentUser() user: AuthenticatedUser): Promise<Business[]> {
    return this.businessService.findAll(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get own business by ID' })
  @ApiParam({ name: 'id', description: 'Business UUID' })
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Business> {
    return this.businessService.findOne(id, user);
  }

  @Patch(':id')
  @Roles('OWNER', 'MANAGER')
  @ApiOperation({ summary: 'Update own business information' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<Business> {
    return this.businessService.update(id, updateBusinessDto, user);
  }

  @Patch(':id/status')
  @Roles('OWNER')
  @ApiOperation({ summary: 'Update own business status (OWNER only)' })
  updateStatus(): never {
    throw new ForbiddenException(
      'Business status changes are disabled in the MVP.',
    );
  }
}
