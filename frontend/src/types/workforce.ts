export type UserRole = 'MANAGER' | 'EMPLOYEE' | 'ADMIN';

export interface AuthUser {
  authUserId: string;
  employeeId: string;
  role: UserRole;
  email: string;
  name: string;
  avatarUrl?: string;
  department?: string;
}

export interface EmployeeSkill {
  id?: string;
  skill_id?: string;
  name?: string;
  skill_name?: string;
  proficiency_level?: number; // 1 to 5
  proficiency?: number | string;
  verified?: boolean;
}

export interface EmployeeSkillDetail {
  id: string;
  name: string;
  category: 'Cloud' | 'DevOps' | 'Backend' | 'AI/ML' | 'Frontend' | 'Security' | 'Data';
  normalized_score: number; // 0.0 to 1.0
  displayed_rating: number; // normalized_score * 5 (e.g. 4.8 / 5)
  evidence_source: 'Self-reported' | 'Certificate Verified' | 'Project Validated' | 'Manager Validated' | 'Assessment Derived' | 'AI Derived';
  verification_status: 'VERIFIED' | 'PENDING_REVIEW' | 'SELF_REPORTED' | 'ASSESSMENT';
  last_updated: string;
  trend: 'improving' | 'stable' | 'needs refresh';
  related_certificates: string[];
  related_projects: string[];
  description?: string;
  growth_milestones?: string[];
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  weekly_capacity_hours: number;
  allocated_hours: number;
  remaining_hours: number;
  efficiency_score: number;
  consistency_score: number;
  reliability_score: number;
  availability_score: number;
  workload_tolerance: number;
  burnout_risk_signal: number;
  status: 'ACTIVE' | 'AVAILABLE_AFTER_CONFIRMATION' | 'OVERALLOCATED' | 'LEAVE';
  skills: EmployeeSkill[];
  active_project_names?: string[];
  pending_release_date?: string;
}

export interface ProjectStaffingSlot {
  id: string;
  slot_id?: string;
  role: string;
  skill: string;
  min_proficiency: number;
  headcount: number;
  required_headcount?: number;
  allocated_headcount?: number;
  hours_per_week: number;
  preferred_skills: string[];
  experience_level: 'Junior' | 'Mid' | 'Senior' | 'Lead';
  complexity: number;
  filled_headcount?: number;
  assigned_employees?: string[];
  status?: 'FULLY_STAFFED' | 'PARTIALLY_STAFFED' | 'STAFFING_GAP' | 'PENDING_APPROVAL' | 'APPROVED' | 'AT_RISK' | 'RELEASE_PENDING' | 'FILLED' | 'UNFILLED';
}

export interface ProjectConstraints {
  availability_window_start: string;
  availability_window_end: string;
  max_workload_ratio: number;
  role_compatibility_strict: boolean;
  urgency: 'Standard' | 'Urgent' | 'Critical';
  include_available_after_release: boolean;
  manager_notes?: string;
}

export interface Project {
  id: string;
  name: string;
  domain: string;
  description: string;
  priority: 1 | 2 | 3 | 4 | 5;
  complexity: 1 | 2 | 3 | 4 | 5;
  deadline: string;
  deadline_days: number;
  estimated_total_hours: number;
  required_team_size: number;
  current_team_size: number;
  staffing_coverage_pct: number;
  status: 'ACTIVE' | 'PLANNING' | 'COMPLETED' | 'PAUSED';
  staffing_state: 'STAFFED' | 'STAFFING_GAPS' | 'OVERALLOCATED';
  risk_state: 'LOW' | 'MEDIUM' | 'HIGH';
  health_score: number;
  delivery_risk_pct: number;
  staffing_requirements?: any[];
  constraints?: ProjectConstraints;
  assigned_team_ids?: string[];
}

export interface RankedCandidate {
  employee_id: string;
  employee_name: string;
  role: string;
  slot_id?: string;
  slot_role?: string;
  slot_skill?: string;
  remaining: number;
  fairness: number;
  performance: number;
  skillScore: number;
  knowledge: number;
  risk_score: number;
  confidence: number;
  final_score: number;
  completion_estimate_hours?: number;
  hard_constraint_status: 'ELIGIBLE' | 'MISSING_SKILL' | 'INSUFFICIENT_CAPACITY' | 'UNAVAILABLE' | 'RELEASE_PENDING';
  rejection_reason?: string;
  features_9: {
    skill_match_score: number;
    workload_ratio: number;
    task_complexity: number;
    estimated_hours: number;
    efficiency_score: number;
    consistency_score: number;
    reliability_score: number;
    availability_score: number;
    project_priority: number;
  };
}

export interface TeamMemberProposal {
  slot_id: string;
  slot_role: string;
  slot_skill: string;
  required_hours: number;
  employee_id: string;
  employee_name: string;
  current_role: string;
  role?: string;
  allocated_hours: number;
  allocated_pct: number;
  skill_match_rating: number;
  predicted_performance: number;
  predicted_completion_hours: number;
  workload_capacity_state: 'Optimal' | 'Near Capacity' | 'Overallocated';
  burnout_risk_score: number;
  availability_status: 'Available' | 'Available After Release' | 'Conflict';
  fairness_adjustment: number;
  final_deterministic_score: number;
  final_score?: number;
  match_reasons?: string[];
  hard_constraint_status: 'PASSED' | 'FAILED';
  proposal_status: 'RECOMMENDED' | 'APPROVED' | 'REJECTED';
}

export interface ExcludedCandidate {
  employee_id: string;
  employee_name: string;
  role: string;
  target_slot: string;
  failed_constraint_reason:
    | 'Required skill missing'
    | 'Below minimum proficiency'
    | 'Capacity exceeded'
    | 'Unavailable during project period'
    | 'Active unfinished work on another project'
    | 'Role mismatch'
    | 'Release confirmation required';
  details: string;
}

export interface TeamAllocationProposal {
  id: string;
  project_id: string;
  project_name: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'NO_FEASIBLE_ALLOCATION';
  created_at: string;
  model_version: string;
  decision_weights_version: string;
  required_headcount: number;
  proposed_headcount: number;
  staffing_coverage_pct: number;
  proposed_team: TeamMemberProposal[];
  missing_slots: {
    slot_id: string;
    role: string;
    skill: string;
    required_headcount: number;
    deficit_reason: string;
  }[];
  score_breakdown: {
    average_fairness: number;
    average_performance: number;
    average_skill_match: number;
    average_knowledge: number;
    average_risk_penalty: number;
    composite_team_score: number;
  };
  infeasible_details?: {
    required_team_size: number;
    eligible_candidates_count: number;
    missing_competencies: string[];
    capacity_shortage_hours: number;
    availability_conflicts_count: number;
    pending_release_count: number;
    deadline_pressure_level: 'High' | 'Critical';
  };
  manager_comment?: string;
  reviewed_by?: string;
  reviewed_at?: string;
}

export interface AllocationProposal {
  id: string;
  project_id: string;
  project_name: string;
  required_role: string;
  required_skill: string;
  required_hours: number;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'NO_FEASIBLE_ALLOCATION';
  selected_candidate: {
    employee_id: string;
    employee_name: string;
    final_score: number;
    fairness_score: number;
    performance_score: number;
    skill_score: number;
    knowledge_score: number;
    risk_score: number;
    confidence: number;
  };
  ranked_candidates: {
    employee_id: string;
    employee_name: string;
    final_score: number;
    fairness_score: number;
    performance_score: number;
    skill_score: number;
    knowledge_score: number;
    risk_score: number;
    confidence: number;
    remaining_hours: number;
  }[];
  explanation: string;
  created_at: string;
}

// Enterprise Ticketing Data Models
export type TicketType = 'Task' | 'Bug' | 'Feature' | 'Improvement' | 'Risk' | 'Staffing Request';
export type TicketStatus =
  | 'Backlog'
  | 'To Do'
  | 'In Progress'
  | 'In Review'
  | 'Blocked'
  | 'Done'
  | 'TODO'
  | 'IN_PROGRESS'
  | 'REVIEW'
  | 'DONE'
  | 'BLOCKED'
  | 'IN_REVIEW'
  | 'BACKLOG'
  | 'COMPLETED';
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'CRITICAL';

export interface TicketAttachment {
  id: string;
  name: string;
  url: string;
  size: string;
  uploaded_by: string;
  uploaded_at: string;
}

export interface TicketComment {
  id: string;
  author_name: string;
  author_role: string;
  author_avatar?: string;
  content: string;
  created_at: string;
}

export interface TicketActivityLog {
  id: string;
  user_name: string;
  action: string;
  timestamp: string;
  details?: string;
}

export interface TicketEvidenceSubmission {
  id: string;
  title: string;
  url_or_artifact: string;
  notes: string;
  submitted_at: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  reviewer_feedback?: string;
}

export interface TicketReleaseRequest {
  id: string;
  requested_at: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  manager_comment?: string;
}

export interface Ticket {
  id: string;
  project_id: string;
  project_name: string;
  title: string;
  description?: string;
  ticket_type?: TicketType;
  status: TicketStatus;
  priority: TicketPriority;
  assignee_id?: string;
  assignee_name?: string;
  reporter_id?: string;
  reporter_name?: string;
  required_skill?: string;
  estimated_hours?: number;
  actual_hours?: number;
  story_points: number;
  deadline?: string;
  due_date?: string;
  complexity?: number;
  updated_at: string;
  created_at?: string;
  attachments?: TicketAttachment[];
  comments?: TicketComment[];
  activity_timeline?: TicketActivityLog[];
  evidence_submission?: TicketEvidenceSubmission;
  release_request?: TicketReleaseRequest;
  blocker_details?: string;
}

export interface AllocationDecisionLog {
  id: string;
  allocation_id: string;
  employee_id: string;
  employee_name: string;
  project_id: string;
  project_name: string;
  allocated_hours: number;
  fairness: number;
  performance: number;
  skill_score: number;
  knowledge_score: number;
  risk_score: number;
  confidence: number;
  final_score: number;
  created_at: string;
  explanation: string;
  approved_by?: string;
  team_role?: string;
  manager_comment?: string;
}

export interface SystemAlert {
  id: string;
  type: 'CAPACITY' | 'BURNOUT_RISK' | 'STAFFING_GAP' | 'DEADLINE' | 'HIRING_SIGNAL';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  title: string;
  description: string;
  timestamp: string;
  status?: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
  link?: string;
}

export type EvidenceType =
  | 'CERTIFICATE_UPLOAD'
  | 'CREDENTIAL_URL'
  | 'COURSE_COMPLETION'
  | 'PROJECT_REPO_LINK'
  | 'WORK_ARTIFACT'
  | 'INTERNAL_CONTRIBUTION'
  | 'SELF_REPORTED_UPDATE'
  | 'LEARNING_GOAL'
  | 'AVAILABILITY_UPDATE'
  | 'TASK_COMPLETION_NOTE'
  | 'ALLOCATION_RELEASE_REQUEST';

export type EvidenceStatus =
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Verified'
  | 'Rejected'
  | 'Needs More Evidence';

export interface ProgressEvidence {
  id: string;
  title: string;
  evidence_type: EvidenceType;
  status: EvidenceStatus;
  submission_date: string;
  related_skill?: string;
  related_project?: string;
  reviewer_feedback?: string;
  last_updated: string;
  url_or_file?: string;
  notes?: string;
  self_rating_delta?: number;
}

export interface ActivityEvent {
  time: string;
  type: 'TASK' | 'PROJECT' | 'LEARNING' | 'CERTIFICATE' | 'EVIDENCE' | 'PROGRESS';
  title: string;
  project?: string;
}

export interface ContributionActivityDay {
  date: string;
  day_of_week: number;
  activity_level: 0 | 1 | 2 | 3 | 4;
  tasks_completed: number;
  project_contributions: number;
  learning_milestones: number;
  certificates_uploaded: number;
  evidence_submissions: number;
  details: ActivityEvent[];
}

export type AllocationState =
  | 'Active'
  | 'Work completed'
  | 'Awaiting manager review'
  | 'Awaiting release confirmation'
  | 'Released'
  | 'Available now'
  | 'Available after release confirmation';

export interface EmployeeProjectAllocation {
  project_id: string;
  project_name: string;
  domain: string;
  role: string;
  allocated_hours: number;
  allocated_pct: number;
  deadline: string;
  status: AllocationState;
  progress_pct: number;
  assigned_tickets: Ticket[];
  release_requested: boolean;
  release_request_date?: string;
}

export interface NonSelectionRequirement {
  requirement: string;
  candidate_status: string;
  passed: boolean;
  details: string;
  suggested_next_step: string;
  learning_recommendation?: string;
}

export interface NonSelectionEvaluation {
  project_id: string;
  project_name: string;
  role: string;
  domain: string;
  evaluated_at: string;
  requirements: NonSelectionRequirement[];
  suggested_actions: {
    label: string;
    action_type: 'LEARNING' | 'EVIDENCE' | 'REVIEW';
    link: string;
  }[];
}

export interface LearningGoal {
  id: string;
  title: string;
  category: string;
  provider: string;
  target_skill: string;
  progress_pct: number;
  due_date: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'RECOMMENDED';
  estimated_hours: number;
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  type: 'ALLOCATION' | 'PROPOSAL' | 'RELEASE' | 'ALERT' | 'TICKET' | 'SYSTEM';
  timestamp: string;
  is_read: boolean;
  link?: string;
  targetRole?: UserRole | 'ALL';
}

export interface EmployeeNotification {
  id: string;
  title: string;
  description: string;
  type: 'ALLOCATION' | 'EVIDENCE_VERIFIED' | 'SKILL_UPDATE' | 'DEADLINE' | 'RELEASE_CONFIRMED';
  timestamp: string;
  is_read: boolean;
  link?: string;
}


export interface SystemAuditLog {
  id: string;
  actor_id: string;
  actor_name: string;
  actor_role: UserRole;
  action_type:
    | 'PROPOSAL_GENERATED'
    | 'PROPOSAL_APPROVED'
    | 'PROPOSAL_REJECTED'
    | 'WEIGHTS_UPDATED'
    | 'ROLE_CHANGED'
    | 'EVIDENCE_VERIFIED'
    | 'EVIDENCE_REJECTED'
    | 'RELEASE_APPROVED'
    | 'TICKET_CREATED'
    | 'PROJECT_CREATED'
    | 'ALERT_ACKNOWLEDGED'
    | 'ALERT_RESOLVED';
  project_id?: string;
  project_name?: string;
  employee_id?: string;
  employee_name?: string;
  timestamp: string;
  proposal_id?: string;
  score_snapshot_ref?: string;
  model_version?: string;
  details: string;
  previous_state?: string;
  new_state?: string;
  metadata?: Record<string, any>;
}

export interface DecisionWeightsConfig {
  version: string;
  updated_at: string;
  updated_by: string;
  skill_match_weight: number;
  performance_weight: number;
  fairness_weight: number;
  risk_penalty_weight: number;
  workload_threshold_ratio: number;
  strict_hard_constraints: boolean;
  enable_ml_fairness_calibration: boolean;
  auto_archive_proposals_days: number;
  change_history: {
    version: string;
    changed_at: string;
    changed_by: string;
    rationale: string;
    weights_summary: string;
  }[];
}

export interface ModelTelemetry {
  id: string;
  name: string;
  model_type: 'PERFORMANCE' | 'COMPLETION' | 'BURNOUT_RISK';
  version: string;
  framework: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'TRAINING' | 'OFFLINE';
  last_training_date: string;
  last_evaluation_date: string;
  dataset_version: string;
  dataset_sample_count: number;
  latency_p95_ms: number;
  inference_throughput_rps: number;
  registered_metrics: {
    metric_name: string;
    value: string | number;
    description: string;
  }[];
  notes: string;
}

export interface ServiceHealthStatus {
  name: string;
  component: 'BACKEND_API' | 'ML_SERVICE' | 'DATABASE' | 'JOB_SCHEDULER' | 'AUTH_SERVICE';
  status: 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';
  uptime_pct: number;
  latency_ms: number;
  last_heartbeat: string;
  details: string;
  active_connections?: number;
  error_rate_pct?: number;
}

export interface SystemHealthSummary {
  overall_status: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
  services: ServiceHealthStatus[];
  last_successful_prediction: string;
  last_successful_allocation: string;
  active_background_jobs: number;
  recent_error_logs: {
    id: string;
    timestamp: string;
    service: string;
    level: 'ERROR' | 'WARN' | 'INFO';
    endpoint?: string;
    message: string;
    status_code?: number;
  }[];
}

export interface RolePermissionMatrixItem {
  feature_area: string;
  permission: string;
  description: string;
  manager: boolean;
  employee: boolean;
  admin: boolean;
}

export interface SkillProficiencyLevel {
  level: number;
  title: string;
  description: string;
  expected_evidence: string;
}

export interface SkillCategoryDefinition {
  id: string;
  name: string;
  domain: string;
  description: string;
  skills_count: number;
  proficiency_levels: SkillProficiencyLevel[];
  accepted_evidence_types: EvidenceType[];
  validation_frequency_months: number;
}


export type TeamProposal = TeamAllocationProposal;
export type EmployeeAllocation = EmployeeProjectAllocation;
