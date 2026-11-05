import {
  Injectable,
} from '@nestjs/common';

import axios from 'axios';

import { SupabaseService }
from '../../supabase/supabase.service';

import { ProfilingService }
from '../profiling/profiling.service';

@Injectable()
export class FeedbackLoopService {
  private readonly ML_URL =
    'http://localhost:8000/learn';

  constructor(
    private readonly supabase:
      SupabaseService,

    private readonly profiling:
      ProfilingService,
  ) {}

  async learn(
    employeeId: string,
  ) {
    const client =
      this.supabase.getClient();

    const profile =
      await this.profiling
        .generateProfile(
          employeeId,
        );

    const {
      data: performance,
    } = await client
      .from(
        'employee_performance',
      )
      .select('*')
      .eq(
        'employee_id',
        employeeId,
      )
      .order(
        'created_at',
        {
          ascending: false,
        },
      )
      .limit(1)
      .single();

    if (!performance) {
      return;
    }

    await axios.post(
      this.ML_URL,
      {
        efficiency_score:
          profile.efficiency_score,

        consistency_score:
          profile.consistency_score,

        workload_tolerance:
          profile.workload_tolerance,

        burnout_risk_signal:
          profile
            .burnout_risk_signal,

        actual_performance:
          performance.delivery_score,

        actual_completion:
          performance
            .completion_status ===
          'COMPLETED'
            ? 1
            : 0,
      },
    );
  }
}