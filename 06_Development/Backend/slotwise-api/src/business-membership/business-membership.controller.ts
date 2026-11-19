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
import { BusinessMembershipService } from './business-membership.service';
import { CreateBusinessMembershipDto } from './dto/create-business-membership.dto';
import { UpdateBusinessMembershipDto } from './dto/update-business-membership.dto';
import { UpdateBusinessMembershipStatusDto } from './dto/update-business-membership-status.dto';
import { BusinessMembership } from './entities/business-membership.entity';

@ApiTags('Business Membership')
@Controller('business-memberships')
export class BusinessMembershipController {
  constructor(
    private readonly membershipService: BusinessMembershipService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Add a user to a business' })
  @ApiCreatedResponse({ description: 'Membership created successfully.' })
  create(
    @Body() createDto: CreateBusinessMembershipDto,
  ): Promise<BusinessMembership> {
    return this.membershipService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all business memberships' })
  @ApiOkResponse({ description: 'Memberships retrieved successfully.' })
  findAll(): Promise<BusinessMembership[]> {
    return this.membershipService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get membership details by ID' })
  @ApiOkResponse({ description: 'Membership retrieved successfully.' })
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<BusinessMembership> {
    return this.membershipService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update membership role' })
  @ApiOkResponse({ description: 'Membership updated successfully.' })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDto: UpdateBusinessMembershipDto,
  ): Promise<BusinessMembership> {
    return this.membershipService.update(id, updateDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update membership status' })
  @ApiOkResponse({ description: 'Membership status updated successfully.' })
  updateStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateDto: UpdateBusinessMembershipStatusDto,
  ): Promise<BusinessMembership> {
    return this.membershipService.updateStatus(id, updateDto);
  }
}
