import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class PredictiveService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async predictWorkload(required_hours: number, week_start_date: string) {
    const supabase = this.supabaseService.getClient();

    // Employees
    const { data: employees } = await supabase
      .from('employees')
      .select('*');

    const safeEmployees = employees ?? [];

    // Allocations
    const { data: allocations } = await supabase
      .from('allocations')
      .select('*')
      .eq('week_start_date', week_start_date);

    const safeAllocations = allocations ?? [];

    const allocationMap: Record<string, number> = {};

    safeAllocations.forEach((a: any) => {
      allocationMap[a.employee_id] =
        (allocationMap[a.employee_id] || 0) + a.allocated_hours;
    });

    // Projection
    const projections = safeEmployees.map((emp: any) => {
      const current = allocationMap[emp.id] || 0;
      const capacity = emp.weekly_capacity_hours || 1;

      const projected = current + required_hours;
      const utilization = projected / capacity;

      let risk = 'LOW';
      if (utilization > 1) risk = 'OVERLOAD';
      else if (utilization > 0.8) risk = 'HIGH';

      let recommendation = 'SAFE';
      if (risk === 'OVERLOAD') recommendation = 'DO NOT ASSIGN';
      else if (risk === 'HIGH') recommendation = 'CAUTION';

      return {
        employee_id: emp.id,
        employee_name: emp.name,
        current_load: current,
        projected_load: projected,
        capacity,
        utilization,
        risk,
        recommendation,
      };
    });

    return projections.sort((a, b) => a.utilization - b.utilization);
  }
}