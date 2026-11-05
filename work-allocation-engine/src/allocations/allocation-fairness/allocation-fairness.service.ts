import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class AllocationFairnessService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getFairSuggestions(required_hours: number, week_start_date: string) {
    const supabase = this.supabaseService.getClient();

    // employees
    const { data: employees, error: empError } = await supabase
      .from('employees')
      .select('*');

    if (empError) throw new Error(empError.message);

    // allocations for week
    const { data: allocations, error: allocError } = await supabase
      .from('allocations')
      .select('*')
      .eq('week_start_date', week_start_date);

    if (allocError) throw new Error(allocError.message);

    // compute allocated hours
    const allocationMap: any = {};
    allocations.forEach((a: any) => {
      allocationMap[a.employee_id] =
        (allocationMap[a.employee_id] || 0) + a.allocated_hours;
    });

    // fairness scoring
    const suggestions = employees.map((emp: any) => {
      const allocated = allocationMap[emp.id] || 0;
      const capacity = emp.weekly_capacity_hours;

      const utilization = allocated / capacity;
      const remaining = capacity - allocated;

      // fairness score formula v1
      let fairness_score = remaining / capacity;

      if (utilization > 1) fairness_score -= 1; // overload penalty
      if (utilization > 0.8) fairness_score -= 0.3; // heavy usage penalty
      if (utilization < 0.3) fairness_score += 0.4; // underused boost

      return {
        employee_id: emp.id,
        employee_name: emp.name,
        allocated_hours: allocated,
        remaining_capacity: remaining,
        utilization,
        fairness_score,
        can_allocate: remaining >= required_hours,
      };
    });

    return suggestions
      .filter((e) => e.can_allocate)
      .sort((a, b) => b.fairness_score - a.fairness_score);
  }
}