import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AllocationIntelligenceService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async suggestEmployees(required_hours: number, week_start_date: string) {
    const supabase = this.supabaseService.getClient();

    // get employees
    const { data: employees, error: empError } = await supabase
      .from('employees')
      .select('*');

    if (empError) throw new Error(empError.message);

    // get allocations for that week
    const { data: allocations, error: allocError } = await supabase
      .from('allocations')
      .select('*')
      .eq('week_start_date', week_start_date);

    if (allocError) throw new Error(allocError.message);

    // compute allocated hours per employee
    const allocationMap: any = {};

    allocations.forEach((alloc: any) => {
      if (!allocationMap[alloc.employee_id]) {
        allocationMap[alloc.employee_id] = 0;
      }

      allocationMap[alloc.employee_id] += alloc.allocated_hours;
    });

    // build suggestion list
    const suggestions = employees.map((emp: any) => {
      const allocated = allocationMap[emp.id] || 0;
      const remaining = emp.weekly_capacity_hours - allocated;

      return {
        employee_id: emp.id,
        employee_name: emp.name,
        allocated_hours: allocated,
        remaining_capacity: remaining,
        can_allocate: remaining >= required_hours,
      };
    });

    // filter only capable employees
    const filtered = suggestions
      .filter((e) => e.can_allocate)
      .sort((a, b) => b.remaining_capacity - a.remaining_capacity);

    return filtered;
  }
}