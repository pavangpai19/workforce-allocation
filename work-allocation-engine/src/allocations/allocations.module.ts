import { TeamFormationModule } from './team-formation/team-formation.module';
import { ProposalsModule } from './proposals/proposals.module';
import { ReleaseModule } from './release/release.module';
import { Module } from '@nestjs/common';
import { AllocationsController } from './allocations.controller';
import { AllocationsService } from './allocations.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { AuthModule } from '../auth/auth.module';

import { AllocationIntelligenceService } from './allocation-intelligence.service';
import { AllocationIntelligenceController } from './allocation-intelligence.controller';

import { AllocationFairnessService } from './allocation-fairness/allocation-fairness.service';
import { AllocationFairnessController } from './allocation-fairness/allocation-fairness.controller';

import { AutoAllocationService } from './auto-allocation/auto-allocation.service';
import { AutoAllocationController } from './auto-allocation/auto-allocation.controller';

import { AllocationRiskService } from './allocation-risk/allocation-risk.service';
import { AllocationRiskController } from './allocation-risk/allocation-risk.controller';

import { AllocationOutcomeService } from './allocation-outcome/allocation-outcome.service';
import { AllocationOutcomeController } from './allocation-outcome/allocation-outcome.controller';

import { AllocationForecastService } from './allocation-forecast/allocation-forecast.service';
import { AllocationForecastController } from './allocation-forecast/allocation-forecast.controller';

import { DeliveryProbabilityService } from './delivery-probability/delivery-probability.service';
import { DeliveryProbabilityController } from './delivery-probability/delivery-probability.controller';

import { HiringSignalService } from './hiring-signal/hiring-signal.service';
import { HiringSignalController } from './hiring-signal/hiring-signal.controller';

import { DecisionHistoryService } from './decision-history/decision-history.service';
import { DecisionHistoryController } from './decision-history/decision-history.controller';

import { MlModule } from '../intelligence/ml/ml.module';
import { ProfilingModule } from '../intelligence/profiling/profiling.module';
import { ExplanationModule } from '../intelligence/explanation/explanation.module';
import { DecisionLogsModule } from './decision-logs/decision-logs.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { IntelligenceModule } from '../intelligence/intelligence.module';

@Module({
  imports: [
    TeamFormationModule,
    ProposalsModule,
    ReleaseModule,
    SupabaseModule,
    AuthModule,
    MlModule,
    ProfilingModule,
    ExplanationModule,
    DecisionLogsModule,
    IntelligenceModule,
    NotificationsModule,
  ],
  controllers: [
    AllocationsController,
    AllocationIntelligenceController,
    AllocationFairnessController,
    AutoAllocationController,
    AllocationRiskController,
    AllocationOutcomeController,
    AllocationForecastController,
    DeliveryProbabilityController,
    HiringSignalController,
    DecisionHistoryController,
  ],
  exports: [
    TeamFormationModule,
    ProposalsModule,
    ReleaseModule,
  ],
  providers: [
    AllocationsService,
    AllocationIntelligenceService,
    AllocationFairnessService,
    AutoAllocationService,
    AllocationRiskService,
    AllocationOutcomeService,
    AllocationForecastService,
    DeliveryProbabilityService,
    HiringSignalService,
    DecisionHistoryService,
  ],
})
export class AllocationsModule {}