import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class AllocationRiskService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async analyzeRisk(week_start_date: string) {
    const supabase = this.supabaseService.getClient();

    const { data: employees } = await supabase.from('employees').select('*');

    const { data: allocations } = await supabase
      .from('allocations')
      .select('*')
      .eq('week_start_date', week_start_date);

    const { data: performance } = await supabase
      .from('employee_performance')
      .select('*');

    // allocation map
    const allocationMap: any = {};
    allocations?.forEach((a: any) => {
      allocationMap[a.employee_id] =
        (allocationMap[a.employee_id] || 0) + a.allocated_hours;
    });

    // performance map
    const perfMap: any = {};
    performance?.forEach((p: any) => {
      if (!perfMap[p.employee_id]) perfMap[p.employee_id] = [];
      perfMap[p.employee_id].push(p);
    });

    const riskReport = (employees || []).map((emp: any) => {
      const allocated = allocationMap[emp.id] || 0;
      const capacity = emp.weekly_capacity_hours;

      const utilization = allocated / capacity;

      // burnout risk
      let burnout_risk = 'LOW';
      if (utilization > 1) burnout_risk = 'CRITICAL';
      else if (utilization > 0.85) burnout_risk = 'HIGH';
      else if (utilization > 0.6) burnout_risk = 'MEDIUM';

      // performance risk
      const perf = perfMap[emp.id] || [];

      let delivery_risk = 'MEDIUM';

      if (perf.length) {
        const avgDelivery =
          perf.reduce((a: number, b: any) => a + b.delivery_score, 0) /
          perf.length;

        if (avgDelivery > 0.8) delivery_risk = 'LOW';
        else if (avgDelivery < 0.5) delivery_risk = 'HIGH';
      }

      return {
        employee_id: emp.id,
        employee_name: emp.name,
        utilization,
        burnout_risk,
        delivery_risk,
      };
    });

    return riskReport;
  }
}