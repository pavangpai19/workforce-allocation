import { Module } from '@nestjs/common';

import { EmployeeSkillsController } from './employee_skills.controller';
import { EmployeeSkillsService } from './employee_skills.service';

import { SupabaseModule } from '../supabase/supabase.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    SupabaseModule,
    AuthModule,
  ],
  controllers: [
    EmployeeSkillsController,
  ],
  providers: [
    EmployeeSkillsService,
  ],
})
export class EmployeeSkillsModule {}