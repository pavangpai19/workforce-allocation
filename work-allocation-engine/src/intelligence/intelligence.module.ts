import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { DecisionEngineService } from './decision-engine.service';
import { OverviewService } from './overview/overview.service';
import { WeightsService } from './weights/weights.service';
import { LearningService } from './learning/learning.service';
import { KnowledgeService } from './knowledge/knowledge.service';
import { FeedbackLoopService } from './feedback-loop/feedback-loop.service';
import { MlModule } from './ml/ml.module';
import { ProfilingModule } from './profiling/profiling.module';
import { ExplanationModule } from './explanation/explanation.module';
import { OverviewController } from './overview/overview.controller';
import { LearningController } from './learning/learning.controller';

@Module({
  imports: [
    SupabaseModule,
    MlModule,
    ProfilingModule,
    ExplanationModule,
  ],
  controllers: [
    OverviewController,
    LearningController,
  ],
  providers: [
    DecisionEngineService,
    OverviewService,
    WeightsService,
    LearningService,
    KnowledgeService,
    FeedbackLoopService, // Registered (H-6)
  ],
  exports: [
    DecisionEngineService,
    OverviewService,
    WeightsService,
    LearningService,
    KnowledgeService,
    FeedbackLoopService, // Exported for allocation-outcome / feedback handlers (H-6)
    MlModule,
    ProfilingModule,
    ExplanationModule,
  ],
})
export class IntelligenceModule {}
