import { Controller, Get } from '@nestjs/common';
import { BusinessService } from './business.service';

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Get()
  getBusinessModuleStatus() {
    return this.businessService.getBusinessModuleStatus();
  }
}