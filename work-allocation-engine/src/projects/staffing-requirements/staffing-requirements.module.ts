import { Module } from '@nestjs/common';
import { StaffingRequirementsController } from './staffing-requirements.controller';
import { StaffingRequirementsService } from './staffing-requirements.service';
import { SupabaseModule } from '../../supabase/supabase.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [SupabaseModule, AuthModule],
  controllers: [StaffingRequirementsController],
  providers: [StaffingRequirementsService],
  exports: [StaffingRequirementsService],
})
export class StaffingRequirementsModule {}
