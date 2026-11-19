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
import { AvailabilityExceptionService } from './availability-exception.service';
import { CreateAvailabilityExceptionDto } from './dto/create-availability-exception.dto';
import { UpdateAvailabilityExceptionDto } from './dto/update-availability-exception.dto';

@ApiTags('Availability Exceptions')
@Controller('availability-exceptions')
export class AvailabilityExceptionController {
  constructor(
    private readonly exceptionService: AvailabilityExceptionService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create an availability exception' })
  create(@Body() dto: CreateAvailabilityExceptionDto) {
    return this.exceptionService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all availability exceptions' })
  findAll() {
    return this.exceptionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get availability exception by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.exceptionService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update availability exception' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAvailabilityExceptionDto,
  ) {
    return this.exceptionService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete availability exception' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.exceptionService.remove(id);
  }
}
