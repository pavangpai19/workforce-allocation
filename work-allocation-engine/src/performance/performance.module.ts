import { Module } from '@nestjs/common';

import { PerformanceController } from './performance.controller';
import { PerformanceService } from './performance.service';

import { SupabaseModule } from '../supabase/supabase.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    SupabaseModule,
    AuthModule,
  ],
  controllers: [
    PerformanceController,
  ],
  providers: [
    PerformanceService,
  ],
})
export class PerformanceModule {}