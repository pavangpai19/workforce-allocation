import { Controller, Post, Param } from '@nestjs/common';
import { ProfilingService } from './profiling.service';

@Controller('intelligence/profile')
export class ProfilingController {
  constructor(private readonly service: ProfilingService) {}

  @Post(':employee_id')
  generate(@Param('employee_id') employee_id: string) {
    return this.service.generateProfile(employee_id);
  }
}