import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppointmentServiceService } from './appointment-service.service';
import { CreateAppointmentServiceDto } from './dto/create-appointment-service.dto';

@ApiTags('Appointment Services')
@Controller('appointment-services')
export class AppointmentServiceController {
  constructor(
    private readonly appointmentService: AppointmentServiceService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Add a service to an appointment' })
  create(@Body() dto: CreateAppointmentServiceDto) {
    return this.appointmentService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all appointment service records' })
  findAll() {
    return this.appointmentService.findAll();
  }

  @Get('appointment/:appointmentId')
  @ApiOperation({ summary: 'Get services linked to an appointment' })
  findByAppointment(
    @Param('appointmentId', ParseUUIDPipe) appointmentId: string,
  ) {
    return this.appointmentService.findByAppointment(appointmentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get appointment service by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.appointmentService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a service from an appointment' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.appointmentService.remove(id);
  }
}
