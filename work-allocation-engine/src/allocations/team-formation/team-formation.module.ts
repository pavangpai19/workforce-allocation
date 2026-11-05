import { Module } from '@nestjs/common';
import { TeamFormationService } from './team-formation.service';
import { TeamFormationController } from './team-formation.controller';
import { SupabaseModule } from '../../supabase/supabase.module';
import { AuthModule } from '../../auth/auth.module';
import { IntelligenceModule } from '../../intelligence/intelligence.module';
import { DecisionLogsModule } from '../decision-logs/decision-logs.module';

@Module({
  imports: [
    SupabaseModule,
    AuthModule,
    IntelligenceModule,
    DecisionLogsModule,
  ],
  controllers: [TeamFormationController],
  providers: [TeamFormationService],
  exports: [TeamFormationService],
})
export class TeamFormationModule {}
