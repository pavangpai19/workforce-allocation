import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class PerformanceService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async recordPerformance(body: any) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('employee_performance')
      .insert([body])
      .select();

    if (error) throw new Error(error.message);

    return data;
  }

  async getEmployeeScore(employee_id: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('employee_performance')
      .select('*')
      .eq('employee_id', employee_id);

    if (error) throw new Error(error.message);

    if (!data.length) return 0.5; // neutral baseline

    const avgDelivery =
      data.reduce((a, b) => a + b.delivery_score, 0) / data.length;

    const avgQuality =
      data.reduce((a, b) => a + b.quality_score, 0) / data.length;

    return (avgDelivery + avgQuality) / 2;
  }
}