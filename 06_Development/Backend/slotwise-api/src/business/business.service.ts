import { Injectable } from '@nestjs/common';

@Injectable()
export class BusinessService {
  getBusinessModuleStatus() {
    return {
      module: 'Business',
      status: 'active',
      message: 'SlotWise Business module is ready.',
    };
  }
}