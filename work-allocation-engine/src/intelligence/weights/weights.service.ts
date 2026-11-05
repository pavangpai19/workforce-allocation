import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

export interface DecisionWeights {
  fairness_weight: number;
  performance_weight: number;
  skill_weight: number;
  knowledge_weight: number;
  risk_weight: number;
}

@Injectable()
export class WeightsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getWeights(): Promise<DecisionWeights> {
    const supabase = this.supabaseService.getClient();

    const { data } = await supabase
      .from('decision_weights')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (data && data.length > 0) {
      return {
        fairness_weight: Number(data[0].fairness_weight ?? 0.25),
        performance_weight: Number(data[0].performance_weight ?? 0.30),
        skill_weight: Number(data[0].skill_weight ?? 0.20),
        knowledge_weight: Number(data[0].knowledge_weight ?? 0.15),
        risk_weight: Number(data[0].risk_weight ?? 0.10),
      };
    }

    return {
      fairness_weight: 0.25,
      performance_weight: 0.30,
      skill_weight: 0.20,
      knowledge_weight: 0.15,
      risk_weight: 0.10,
    };
  }

  async updateWeights(weights: Record<string, number>) {
    const total = Object.values(weights).reduce((s, w) => s + Number(w), 0);
    if (Math.abs(total - 1.0) > 0.01) {
      throw new BadRequestException(
        `Decision weights must sum to 1.0 (received ${total.toFixed(4)})`,
      );
    }

    const supabase = this.supabaseService.getClient();
    const { error } = await supabase.from('decision_weights').insert([weights]);

    if (error) {
      throw new Error(`Failed to update decision weights: ${error.message}`);
    }

    return weights;
  }
}
