import { forwardRef, Module } from '@nestjs/common';
import { ReleaseController } from './release.controller';
import { ReleaseService } from './release.service';
import { SupabaseModule } from '../../supabase/supabase.module';
import { DecisionLogsModule } from '../decision-logs/decision-logs.module';
import { AllocationsModule } from '../allocations.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    SupabaseModule,
    DecisionLogsModule,
    forwardRef(() => AllocationsModule),
    AuthModule,
  ],
  controllers: [ReleaseController],
  providers: [ReleaseService],
  exports: [ReleaseService],
})
export class ReleaseModule {}
