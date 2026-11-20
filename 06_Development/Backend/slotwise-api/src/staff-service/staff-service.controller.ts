import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { StaffServiceService } from './staff-service.service';
import { CreateStaffServiceDto } from './dto/create-staff-service.dto';

@ApiTags('Staff Service')
@Controller('staff-services')
export class StaffServiceController {
  constructor(
    private readonly staffServiceService: StaffServiceService,
  ) {}

  @Roles('OWNER', 'MANAGER')

  @Post()
  @ApiOperation({ summary: 'Assign a service to a staff member' })
  create(@Body() createDto: CreateStaffServiceDto) {
    return this.staffServiceService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all staff service assignments' })
  findAll() {
    return this.staffServiceService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a staff service assignment by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.staffServiceService.findOne(id);
  }

  @Roles('OWNER', 'MANAGER')

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a service assignment from staff' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.staffServiceService.remove(id);
  }
}


