import { Module } from '@nestjs/common';
import { ProfilingService } from './profiling.service';
import { ProfilingController } from './profiling.controller';
import { SupabaseModule } from '../../supabase/supabase.module';

@Module({
  imports: [SupabaseModule], // ✅ THIS FIXES IT
  controllers: [ProfilingController],
  providers: [ProfilingService],
  exports: [ProfilingService],
})
export class ProfilingModule {}