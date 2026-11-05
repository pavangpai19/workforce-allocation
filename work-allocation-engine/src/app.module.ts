import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EmployeesModule } from './employees/employees.module';
import { ProjectsModule } from './projects/projects.module';
import { SkillsModule } from './skills/skills.module';
import { EmployeeSkillsModule } from './employee_skills/employee_skills.module';
import { AllocationsModule } from './allocations/allocations.module';
import { PerformanceModule } from './performance/performance.module';
import { SupabaseModule } from './supabase/supabase.module';
import { IntelligenceModule } from './intelligence/intelligence.module';
import { FeedbackModule } from './feedback/feedback.module';
import { AiModule } from './ai/ai.module';
import { NlpModule } from './nlp/nlp.module';
import { LearningModule } from './learning/learning.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SecurityModule } from './security/security.module';
import { AuthModule } from './auth/auth.module';
import { DocsModule } from './docs/docs.module';
import { AlertsModule } from './alerts/alerts.module';
import { DecisionLogsModule } from './decision/decision-logs.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    SupabaseModule,

    AuthModule,
    SecurityModule,
    DocsModule,

    EmployeesModule,
    ProjectsModule,
    SkillsModule,
    EmployeeSkillsModule,
    PerformanceModule,
    AllocationsModule,
    FeedbackModule,

    IntelligenceModule,
    AiModule,
    NlpModule,
    LearningModule,

    NotificationsModule,
    AlertsModule,
    DecisionLogsModule,
    AnalyticsModule,
  ],
})
export class AppModule {}