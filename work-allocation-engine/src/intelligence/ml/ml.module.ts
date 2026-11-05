import { Module } from '@nestjs/common';
import { MlService } from './ml.service';
import { SupabaseModule } from '../../supabase/supabase.module';
import { ProfilingModule } from '../profiling/profiling.module';

@Module({
  imports: [
    SupabaseModule,
    ProfilingModule,
  ],
  providers: [MlService],
  exports: [MlService],
})
export class MlModule {}