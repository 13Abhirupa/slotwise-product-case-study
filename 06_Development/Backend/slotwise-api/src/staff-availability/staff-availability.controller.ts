import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { StaffAvailabilityService } from './staff-availability.service';
import { CreateStaffAvailabilityDto } from './dto/create-staff-availability.dto';
import { UpdateStaffAvailabilityDto } from './dto/update-staff-availability.dto';

@ApiTags('Staff Availability')
@Controller('staff-availability')
export class StaffAvailabilityController {
  constructor(
    private readonly availabilityService: StaffAvailabilityService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create staff availability' })
  create(@Body() dto: CreateStaffAvailabilityDto) {
    return this.availabilityService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all staff availability records' })
  findAll() {
    return this.availabilityService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get staff availability by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.availabilityService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update staff availability' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStaffAvailabilityDto,
  ) {
    return this.availabilityService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete staff availability' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.availabilityService.remove(id);
  }
}
