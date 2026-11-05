import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';

import { DeliveryProbabilityService } from './delivery-probability.service';

import { SupabaseAuthGuard } from '../../auth/guards/supabase-auth/supabase-auth.guard';
import { RolesGuard } from '../../auth/guards/roles/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('allocations')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class DeliveryProbabilityController {
  constructor(
    private readonly service: DeliveryProbabilityService,
  ) {}

  @Roles('ADMIN', 'MANAGER')
  @Get('delivery-probability')
  async predict(
    @Query('employee_id')
    employee_id: string,
  ) {
    return this.service.predict(employee_id);
  }
}