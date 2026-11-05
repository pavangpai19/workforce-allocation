import { Module } from '@nestjs/common';
import {
  ProposalsController,
  ProjectProposalsController,
} from './proposals.controller';
import { ProposalsService } from './proposals.service';
import { SupabaseModule } from '../../supabase/supabase.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [SupabaseModule, AuthModule],
  controllers: [ProposalsController, ProjectProposalsController],
  providers: [ProposalsService],
  exports: [ProposalsService],
})
export class ProposalsModule {}
