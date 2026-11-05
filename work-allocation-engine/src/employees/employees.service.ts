import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class EmployeesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll() {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('employees')
      .select('*');

    if (error) throw new Error(error.message);

    return data;
  }

  async create(body: any) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('employees')
      .insert([
        {
          name: body.name,
          email: body.email,
          weekly_capacity_hours: body.weekly_capacity_hours,
        },
      ])
      .select();

    if (error) throw new Error(error.message);

    return data;
  }

  // NEW: weekly workload engine
  async getWeeklyWorkload() {
    const supabase = this.supabaseService.getClient();

    // get employees
    const { data: employees, error: empError } = await supabase
      .from('employees')
      .select('*');

    if (empError) throw new Error(empError.message);

    // get allocations
    const { data: allocations, error: allocError } = await supabase
      .from('allocations')
      .select('*');

    if (allocError) throw new Error(allocError.message);

    // compute weekly workload
    const workloadMap: any = {};

    allocations.forEach((alloc: any) => {
      const key = `${alloc.employee_id}_${alloc.week_start_date}`;

      if (!workloadMap[key]) {
        workloadMap[key] = {
          employee_id: alloc.employee_id,
          week_start_date: alloc.week_start_date,
          allocated_hours: 0,
        };
      }

      workloadMap[key].allocated_hours += alloc.allocated_hours;
    });

    // format response
    const result = Object.values(workloadMap).map((entry: any) => {
      const employee = employees.find((e: any) => e.id === entry.employee_id);

      let status = 'AVAILABLE';

      if (entry.allocated_hours > employee.weekly_capacity_hours) {
        status = 'OVERLOADED';
      } else if (entry.allocated_hours === employee.weekly_capacity_hours) {
        status = 'FULLY_BOOKED';
      }

      return {
        employee_name: employee.name,
        week_start_date: entry.week_start_date,
        allocated_hours: entry.allocated_hours,
        capacity: employee.weekly_capacity_hours,
        status,
      };
    });

    return result;
  }

  async findById(id: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('employees')
      .select('*, employee_skills (*, skills(name))')
      .eq('id', id)
      .single();

    if (error) {
      const { data: fallback, error: fbErr } = await supabase.from('employees').select('*').eq('id', id).single();
      if (fbErr) throw new Error(fbErr.message);
      return fallback;
    }

    return data;
  }
}