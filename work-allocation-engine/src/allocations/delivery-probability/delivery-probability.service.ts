import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class DeliveryProbabilityService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async predict(employee_id: string) {
    const supabase = this.supabaseService.getClient();

    // performance
    const { data: perf } = await supabase
      .from('employee_performance')
      .select('*')
      .eq('employee_id', employee_id);

    // allocations
    const { data: allocations } = await supabase
      .from('allocations')
      .select('*')
      .eq('employee_id', employee_id);

    const avgDelivery = perf?.length
      ? perf.reduce((a: number, b: any) => a + b.delivery_score, 0) /
        perf.length
      : 0.6;

    const avgQuality = perf?.length
      ? perf.reduce((a: number, b: any) => a + b.quality_score, 0) /
        perf.length
      : 0.6;

    const workload =
      allocations?.reduce((a: number, b: any) => a + b.allocated_hours, 0) || 0;

    // probability model
    let success_probability =
      avgDelivery * 0.5 +
      avgQuality * 0.3 +
      (1 - Math.min(workload / 40, 1)) * 0.2;

    success_probability = Math.max(0, Math.min(1, success_probability));

    let risk_level = 'LOW';
    if (success_probability < 0.5) risk_level = 'HIGH';
    else if (success_probability < 0.7) risk_level = 'MEDIUM';

    let recommendation = 'PROCEED';
    if (risk_level === 'HIGH') recommendation = 'AVOID';
    if (risk_level === 'MEDIUM') recommendation = 'CAUTION';

    return {
      employee_id,
      success_probability: Number(success_probability.toFixed(2)),
      risk_level,
      recommendation,
    };
  }
}