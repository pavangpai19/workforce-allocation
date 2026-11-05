import { forwardRef, Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { PredictiveService } from './predictive/predictive.service';
import { PredictiveController } from './predictive/predictive.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { ProjectsModule } from '../projects/projects.module';
import { AllocationsModule } from '../allocations/allocations.module';
import { EmployeesModule } from '../employees/employees.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    SupabaseModule,
    forwardRef(() => ProjectsModule),
    forwardRef(() => AllocationsModule),
    forwardRef(() => EmployeesModule),
    AuthModule,
  ],
  providers: [
    AnalyticsService,
    PredictiveService,
  ],
  controllers: [
    AnalyticsController,
    PredictiveController,
  ],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}