import { forwardRef, Module } from '@nestjs/common';
import { DecisionLogsController } from './decision-logs.controller';
import { DecisionLogsService } from './decision-logs.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { AllocationsModule } from '../allocations/allocations.module';
import { ProposalsModule } from '../allocations/proposals/proposals.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    SupabaseModule,
    forwardRef(() => AllocationsModule),
    forwardRef(() => ProposalsModule),
    AuthModule,
  ],
  controllers: [DecisionLogsController],
  providers: [DecisionLogsService],
  exports: [DecisionLogsService],
})
export class DecisionLogsModule {}
