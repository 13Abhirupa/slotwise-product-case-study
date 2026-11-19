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
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { UpdateStaffStatusDto } from './dto/update-staff-status.dto';

@ApiTags('Staff')
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  @ApiOperation({ summary: 'Create a staff member' })
  create(@Body() createDto: CreateStaffDto) {
    return this.staffService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all staff members' })
  findAll() {
    return this.staffService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a staff member by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.staffService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update staff details' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateStaffDto,
  ) {
    return this.staffService.update(id, updateDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update staff employment status' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateStaffStatusDto,
  ) {
    return this.staffService.updateStatus(id, updateDto);
  }
}
