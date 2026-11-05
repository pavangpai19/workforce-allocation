import { Module } from '@nestjs/common';

import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';

import { SupabaseModule } from '../supabase/supabase.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    SupabaseModule,
    AuthModule,
  ],
  controllers: [
    FeedbackController,
  ],
  providers: [
    FeedbackService,
  ],
})
export class FeedbackModule {}