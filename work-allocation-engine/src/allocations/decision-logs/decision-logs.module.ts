import { Module } from '@nestjs/common';
import { DecisionLogsService } from './decision-logs.service';
import { SupabaseModule } from '../../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  providers: [DecisionLogsService],
  exports: [DecisionLogsService],
})
export class DecisionLogsModule {}