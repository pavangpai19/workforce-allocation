import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class HiringSignalService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async analyze(week_start_date: string) {
    const supabase = this.supabaseService.getClient();

    const { data: employees } = await supabase.from('employees').select('*');

    const { data: allocations } = await supabase
      .from('allocations')
      .select('*')
      .lte('week_start_date', week_start_date);

    const totalCapacity = (employees || []).reduce(
      (sum: number, e: any) => sum + e.weekly_capacity_hours,
      0,
    );

    const totalAllocated = (allocations || []).reduce(
      (sum: number, a: any) => sum + a.allocated_hours,
      0,
    );

    const utilization = totalAllocated / totalCapacity;

    let hiring_signal = 'NO';
    let urgency = 'LOW';
    let reason = 'Capacity healthy';

    if (utilization > 0.85) {
      hiring_signal = 'YES';
      urgency = 'HIGH';
      reason = 'Team nearing maximum utilization';
    } else if (utilization > 0.7) {
      hiring_signal = 'MAYBE';
      urgency = 'MEDIUM';
      reason = 'Workload increasing steadily';
    }

    return {
      week_start_date,
      utilization: Number(utilization.toFixed(2)),
      hiring_signal,
      urgency,
      reason,
    };
  }
}