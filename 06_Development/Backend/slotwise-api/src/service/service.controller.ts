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
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { UpdateServiceStatusDto } from './dto/update-service-status.dto';

@ApiTags('Service')
@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @ApiOperation({ summary: 'Create a service' })
  create(@Body() createDto: CreateServiceDto) {
    return this.serviceService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all services' })
  findAll() {
    return this.serviceService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a service by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.serviceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update service details' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateServiceDto,
  ) {
    return this.serviceService.update(id, updateDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update service status' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateServiceStatusDto,
  ) {
    return this.serviceService.updateStatus(id, updateDto);
  }
}
