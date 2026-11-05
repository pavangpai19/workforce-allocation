import { Module } from '@nestjs/common';

import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';

import { SupabaseModule } from '../supabase/supabase.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    SupabaseModule,
    AuthModule,
  ],
  controllers: [SkillsController],
  providers: [SkillsService],
})
export class SkillsModule {}