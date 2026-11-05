import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class AllocationOutcomeService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async recordOutcome(
    allocation_id: string,
    delivery_score: number,
    quality_score: number,
    completion_status: string,
  ) {
    const supabase = this.supabaseService.getClient();

    // fetch allocation
    const { data: allocation } = await supabase
      .from('allocations')
      .select('*')
      .eq('id', allocation_id)
      .single();

    if (!allocation) throw new Error('Allocation not found');

    // insert into performance automatically
    const { data: perf, error } = await supabase
      .from('employee_performance')
      .insert([
        {
          employee_id: allocation.employee_id,
          project_id: allocation.project_id,
          week_start_date: allocation.week_start_date,
          delivery_score,
          quality_score,
          completion_status,
        },
      ])
      .select();

    if (error) throw new Error(error.message);

    return {
      message: 'Outcome recorded & learning updated',
      performance_entry: perf,
    };
  }
}