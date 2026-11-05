import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { SupabaseModule } from '../supabase/supabase.module';
import { NlpModule } from '../nlp/nlp.module';

import { ReasoningModule } from './reasoning/reasoning.module';
import { EmployeeIntelligenceService } from './reasoning/employee-intelligence/employee-intelligence.service';
import { ProfileBuilderService } from './profile-builder/profile-builder.service';
import { GeminiService } from './providers/gemini/gemini.service';
import { PromptBuilderService } from './prompt-builder/prompt-builder.service';

@Module({
  imports: [
    SupabaseModule,
    NlpModule,
    ReasoningModule,
  ],

  controllers: [AiController],

  providers: [
    AiService,
    EmployeeIntelligenceService,
    ProfileBuilderService,
    GeminiService,
    PromptBuilderService,
  ],

  exports: [
    AiService,
    EmployeeIntelligenceService,
  ],
})
export class AiModule {}