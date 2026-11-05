import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class AllocationsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async findAll() {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('allocations')
      .select('*');

    if (error) throw new Error(error.message);

    return data;
  }

  async create(body: any) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('allocations')
      .insert([
        {
          employee_id: body.employee_id,
          project_id: body.project_id,
          week_start_date: body.week_start_date,
          allocated_hours: body.allocated_hours,
          status: 'ACTIVE',
        },
      ])
      .select();

    if (error) throw new Error(error.message);

    return data;
  }

  async findByEmployee(employeeId: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('allocations')
      .select('*, projects (id, name, status, end_date, project_priority)')
      .eq('employee_id', employeeId);

    if (error) throw new Error(error.message);

    return data || [];
  }
}
