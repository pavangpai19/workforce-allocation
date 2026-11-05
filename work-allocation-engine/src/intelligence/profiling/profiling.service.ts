import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class ProfilingService {
  constructor(private readonly supabaseService: SupabaseService) {}

  private normalize(value: number): number {
    return Math.max(0, Math.min(1, value));
  }

  async generateProfile(employeeId: string) {
    const supabase = this.supabaseService.getClient();

    const { data: profile, error } = await supabase
      .from('employee_profiles')
      .select('*')
      .eq('employee_id', employeeId)
      .single();

    if (error || !profile) {
      throw new NotFoundException(
        `Profile not found for employee ${employeeId}`,
      );
    }

    return {
      employee_id: employeeId,

      efficiency_score: this.normalize(
        Number(profile.efficiency_score ?? 0),
      ),

      consistency_score: this.normalize(
        Number(profile.consistency_score ?? 0),
      ),

      // Derived features (train.py 9-feature contract)
      availability_score: this.normalize(
        Number(profile.communication_score ?? profile.availability_score ?? 0) > 1
          ? Number(profile.communication_score ?? profile.availability_score ?? 0) / 100
          : Number(profile.communication_score ?? profile.availability_score ?? 0.8),
      ),

      reliability_score: this.normalize(
        Number(profile.ownership_score ?? profile.reliability_score ?? 0) > 1
          ? Number(profile.ownership_score ?? profile.reliability_score ?? 0) / 100
          : Number(profile.ownership_score ?? profile.reliability_score ?? 0.8),
      ),

      workload_tolerance: this.normalize(
        Number(profile.adaptability_score ?? 0) / 100,
      ),

      burnout_risk_signal: this.normalize(
        1 - Number(profile.adaptability_score ?? 0) / 100,
      ),
    };
  }
}
