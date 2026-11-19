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
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { UpdateBusinessStatusDto } from './dto/update-business-status.dto';
import { Business } from './entities/business.entity';

@ApiTags('Business')
@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new business' })
  @ApiCreatedResponse({ description: 'Business created successfully.' })
  create(@Body() createBusinessDto: CreateBusinessDto): Promise<Business> {
    return this.businessService.create(createBusinessDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all businesses' })
  @ApiOkResponse({ description: 'List of businesses.' })
  findAll(): Promise<Business[]> {
    return this.businessService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get business details by ID' })
  @ApiParam({ name: 'id', description: 'Business UUID' })
  @ApiOkResponse({ description: 'Business details.' })
  findOne(@Param('id', new ParseUUIDPipe()) id: string): Promise<Business> {
    return this.businessService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update business information' })
  @ApiParam({ name: 'id', description: 'Business UUID' })
  @ApiOkResponse({ description: 'Business updated successfully.' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ): Promise<Business> {
    return this.businessService.update(id, updateBusinessDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update business status' })
  @ApiParam({ name: 'id', description: 'Business UUID' })
  @ApiOkResponse({ description: 'Business status updated successfully.' })
  updateStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateStatusDto: UpdateBusinessStatusDto,
  ): Promise<Business> {
    return this.businessService.updateStatus(id, updateStatusDto.status);
  }
}