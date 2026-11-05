/**
 * Mirror of the Python MLScorePackage contract.
 * The ML service is a quantifier: it returns scores only.
 * If a field is ever added here that names an employee or expresses
 * an allocation outcome, the Intelligence Boundary has been breached.
 */
export interface MLScorePackage {
  predicted_performance: number;
  risk_score: number;
  completion_probability: number;
  confidence: number;
  model_version: string;
}
