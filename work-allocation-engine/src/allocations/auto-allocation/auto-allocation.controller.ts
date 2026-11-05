import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AutoAllocationService } from './auto-allocation.service';
import { AutoAllocateDto } from './dto/auto-allocate.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles/roles.guard';
import { SupabaseAuthGuard } from '../../auth/guards/supabase-auth/supabase-auth.guard';

@Controller('allocations')
@UseGuards(SupabaseAuthGuard, RolesGuard)
export class AutoAllocationController {
  constructor(private readonly autoService: AutoAllocationService) {}

  @Roles('ADMIN', 'MANAGER')
  @Post('auto')
  async autoAllocate(@Body() dto: AutoAllocateDto) {
    return this.autoService.autoAllocate(
      dto.project_id,
      dto.skill,
      dto.required_hours,
      dto.week_start_date,
    );
  }
}
