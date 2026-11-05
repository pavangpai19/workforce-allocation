import {
  Project,
  Employee,
  TeamAllocationProposal,
  AllocationProposal,
  RankedCandidate,
  ExcludedCandidate,
  Ticket,
  AllocationDecisionLog,
  SystemAlert,
  EmployeeSkillDetail,
  ProgressEvidence,
  ContributionActivityDay,
  EmployeeProjectAllocation,
  NonSelectionEvaluation,
  LearningGoal,
  EmployeeNotification,
  AppNotification,
  SystemAuditLog,
  DecisionWeightsConfig,
  ModelTelemetry,
  ServiceHealthStatus,
  SystemHealthSummary,
  RolePermissionMatrixItem,
  SkillCategoryDefinition,
  SkillProficiencyLevel,
} from '../types/workforce';

import {
  SYNTHETIC_PROJECTS,
  SYNTHETIC_EMPLOYEES,
  SYNTHETIC_TICKETS,
  SYNTHETIC_ALERTS,
  SYNTHETIC_PROPOSALS,
  SYNTHETIC_TEAM_PROPOSALS,
  SYNTHETIC_EXCLUDED_CANDIDATES,
  SYNTHETIC_DECISION_LOGS,
  SYNTHETIC_NOTIFICATIONS,
  DEMO_DATASET_DISCLAIMER,
} from './syntheticEnterpriseData';

export { DEMO_DATASET_DISCLAIMER };
export const MOCK_PROJECTS: Project[] = SYNTHETIC_PROJECTS;
export const MOCK_EMPLOYEES: Employee[] = SYNTHETIC_EMPLOYEES;

export const MOCK_EMPLOYEE_SKILLS: EmployeeSkillDetail[] = [
  {
    id: 'skill-1',
    name: 'Cloud Architecture & Multi-Region Design',
    category: 'Cloud',
    normalized_score: 0.96,
    displayed_rating: 4.8,
    evidence_source: 'Project Validated',
    verification_status: 'VERIFIED',
    last_updated: '2026-08-28',
    trend: 'improving',
    related_certificates: ['AWS Certified Solutions Architect - Professional'],
    related_projects: ['Cloud Infrastructure Modernization', 'Identity & Access Zero-Trust'],
    description: 'Advanced distributed architecture design, VPC peering, cross-region failover topology, and cost optimization.',
    growth_milestones: ['Design active-active disaster recovery framework', 'Benchmark multi-region latency SLA'],
  },
  {
    id: 'skill-2',
    name: 'Kubernetes Cluster Orchestration',
    category: 'DevOps',
    normalized_score: 0.94,
    displayed_rating: 4.7,
    evidence_source: 'Certificate Verified',
    verification_status: 'VERIFIED',
    last_updated: '2026-08-15',
    trend: 'improving',
    related_certificates: ['Certified Kubernetes Administrator (CKA)'],
    related_projects: ['Cloud Infrastructure Modernization'],
    description: 'Production cluster management, Helm charts, custom ingress controllers, and resource autoscaling.',
    growth_milestones: ['Implement eBPF Cilium network policies', 'Chaos engineering validation'],
  },
  {
    id: 'skill-3',
    name: 'Infrastructure as Code (Terraform)',
    category: 'DevOps',
    normalized_score: 0.84,
    displayed_rating: 4.2,
    evidence_source: 'Manager Validated',
    verification_status: 'VERIFIED',
    last_updated: '2026-07-20',
    trend: 'stable',
    related_certificates: ['HashiCorp Certified: Terraform Associate'],
    related_projects: ['Cloud Infrastructure Modernization'],
    description: 'Modular Terraform pipelines, remote state locking with DynamoDB, and policy-as-code guardrails.',
    growth_milestones: ['Build custom Terraform provider module'],
  },
  {
    id: 'skill-4',
    name: 'Zero-Trust Security & RBAC Governance',
    category: 'Security',
    normalized_score: 0.90,
    displayed_rating: 4.5,
    evidence_source: 'Project Validated',
    verification_status: 'VERIFIED',
    last_updated: '2026-09-01',
    trend: 'improving',
    related_certificates: ['Certified Information Systems Security Professional (CISSP)'],
    related_projects: ['Identity & Access Zero-Trust Guardrails'],
    description: 'Automated role-based access control, JWT cryptographic token verification, and least-privilege policies.',
    growth_milestones: ['Implement automated posture audit checks'],
  },
  {
    id: 'skill-5',
    name: 'Node.js / NestJS Microservices',
    category: 'Backend',
    normalized_score: 0.78,
    displayed_rating: 3.9,
    evidence_source: 'Self-reported',
    verification_status: 'PENDING_REVIEW',
    last_updated: '2026-08-10',
    trend: 'improving',
    related_certificates: [],
    related_projects: ['Cloud Infrastructure Modernization'],
    description: 'Modular enterprise API backends with dependency injection, middleware security, and PostgreSQL indexing.',
    growth_milestones: ['Complete NestJS Microservice Benchmark', 'Submit repository evidence'],
  },
  {
    id: 'skill-6',
    name: 'PySpark & Iceberg Lakehouse Optimization',
    category: 'Data',
    normalized_score: 0.54,
    displayed_rating: 2.7,
    evidence_source: 'Assessment Derived',
    verification_status: 'ASSESSMENT',
    last_updated: '2026-06-12',
    trend: 'needs refresh',
    related_certificates: [],
    related_projects: [],
    description: 'Analytical table partitioning, Iceberg metadata management, and PySpark DataFrame query tuning.',
    growth_milestones: ['Complete PySpark Lakehouse Masterclass', 'Achieve Level 4 competency'],
  },
];

// Progress & Skill Evidence History
export const MOCK_EVIDENCE_HISTORY: ProgressEvidence[] = [
  {
    id: 'ev-101',
    title: 'AWS Solutions Architect Professional Recertification',
    evidence_type: 'CERTIFICATE_UPLOAD',
    status: 'Verified',
    submission_date: '2026-08-28',
    related_skill: 'Cloud Architecture & Multi-Region Design',
    related_project: 'Cloud Infrastructure Modernization',
    reviewer_feedback: 'Official certificate validated via Credly token. Skill proficiency verified at Level 5.',
    last_updated: '2026-08-29',
    url_or_file: 'https://credly.com/badges/aws-sap-cert-chen',
    notes: 'Renewed credential demonstrating advanced multi-tier VPC architecture expertise.',
  },
  {
    id: 'ev-102',
    title: 'Cross-Region Kubernetes Ingress Automation Script',
    evidence_type: 'PROJECT_REPO_LINK',
    status: 'Verified',
    submission_date: '2026-08-15',
    related_skill: 'Kubernetes Cluster Orchestration',
    related_project: 'Cloud Infrastructure Modernization',
    reviewer_feedback: 'Production PR merged and verified across staging clusters. Exceptional code hygiene.',
    last_updated: '2026-08-16',
    url_or_file: 'https://github.internal/enterprise/cloud-infra/pull/412',
    notes: 'Implemented automated TLS certificate renewal and dynamic DNS endpoint routing.',
  },
  {
    id: 'ev-103',
    title: 'NestJS Microservices Enterprise Architecture Course',
    evidence_type: 'COURSE_COMPLETION',
    status: 'Under Review',
    submission_date: '2026-09-02',
    related_skill: 'Node.js / NestJS Microservices',
    reviewer_feedback: 'Pending verification of hands-on project artifacts.',
    last_updated: '2026-09-03',
    url_or_file: 'https://learning.platform/certificates/nestjs-arch-2026',
    notes: 'Completed 30 hours of advanced backend design patterns and message broker integration.',
    self_rating_delta: 0.5,
  },
  {
    id: 'ev-104',
    title: 'Sprint 34 Deliverable Completion & Allocation Release Request',
    evidence_type: 'ALLOCATION_RELEASE_REQUEST',
    status: 'Submitted',
    submission_date: '2026-09-06',
    related_project: 'Identity & Access Zero-Trust Guardrails',
    reviewer_feedback: 'Under manager review for sprint release sign-off.',
    last_updated: '2026-09-06',
    notes: 'Completed all 5 assigned story points for token revocation webhooks ahead of deadline.',
  },
];

// Employee Project Allocations View
export const MOCK_EMPLOYEE_ALLOCATIONS: EmployeeProjectAllocation[] = [
  {
    project_id: 'proj-1',
    project_name: 'Cloud Infrastructure Modernization',
    domain: 'Cloud Platform',
    role: 'Lead Cloud Architect',
    allocated_hours: 20,
    allocated_pct: 50.0,
    deadline: '2026-09-18',
    status: 'Active',
    progress_pct: 75,
    assigned_tickets: [
      {
        id: 'TCK-402',
        project_id: 'proj-1',
        project_name: 'Cloud Infrastructure Modernization',
        title: 'Automate Terraform state migration with locking DynamoDB tables',
        status: 'REVIEW',
        priority: 'URGENT',
        story_points: 8,
        updated_at: '4 hours ago',
        due_date: '2026-09-10',
      },
      {
        id: 'TCK-405',
        project_id: 'proj-1',
        project_name: 'Cloud Infrastructure Modernization',
        title: 'Conduct architecture peer review for Kubernetes multi-cluster failover',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        story_points: 5,
        updated_at: 'Yesterday',
        due_date: '2026-09-14',
      },
    ],
    release_requested: false,
  },
  {
    project_id: 'proj-3',
    project_name: 'Identity & Access Zero-Trust Guardrails',
    domain: 'Security & Auth',
    role: 'Lead Security Architect',
    allocated_hours: 5,
    allocated_pct: 12.5,
    deadline: '2026-09-15',
    status: 'Awaiting release confirmation',
    progress_pct: 100,
    assigned_tickets: [
      {
        id: 'TCK-404',
        project_id: 'proj-3',
        project_name: 'Identity & Access Zero-Trust Guardrails',
        title: 'Implement token revocation webhook in Supabase Auth Guard',
        status: 'DONE',
        priority: 'HIGH',
        story_points: 5,
        updated_at: '2 days ago',
        due_date: '2026-09-06',
      },
    ],
    release_requested: true,
    release_request_date: '2026-09-06',
  },
];

// Contribution Activity Map (Last 84 days)
export const MOCK_ACTIVITY_MAP: ContributionActivityDay[] = Array.from({ length: 84 }).map((_, i) => {
  const d = new Date(2026, 8, 7);
  d.setDate(d.getDate() - (83 - i));
  const dateStr = d.toISOString().slice(0, 10);
  const dayOfWeek = d.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  let level: 0 | 1 | 2 | 3 | 4 = 0;
  let tasks = 0;
  let contributions = 0;
  let learning = 0;
  let certs = 0;
  let evidence = 0;
  const details = [];

  if (!isWeekend) {
    const seed = (i * 7 + 13) % 10;
    if (seed > 7) {
      level = 4;
      tasks = 3;
      contributions = 4;
      learning = 1;
      details.push(
        { time: '10:30 AM', type: 'TASK' as const, title: 'Merged Terraform state automation PR', project: 'Cloud Modernization' },
        { time: '02:15 PM', type: 'PROJECT' as const, title: 'Architecture design sign-off for multi-region ingress', project: 'Cloud Modernization' },
        { time: '04:45 PM', type: 'EVIDENCE' as const, title: 'Submitted CKA credential evidence' }
      );
    } else if (seed > 4) {
      level = 3;
      tasks = 2;
      contributions = 2;
      details.push(
        { time: '11:00 AM', type: 'TASK' as const, title: 'Configured Prometheus cluster metrics', project: 'Cloud Modernization' },
        { time: '03:30 PM', type: 'PROJECT' as const, title: 'Code review for Zero-Trust RBAC hooks', project: 'Identity Guardrails' }
      );
    } else if (seed > 2) {
      level = 2;
      tasks = 1;
      contributions = 1;
      details.push({ time: '01:30 PM', type: 'TASK' as const, title: 'Updated service ingress certificates' });
    } else {
      level = 1;
      tasks = 1;
      details.push({ time: '09:45 AM', type: 'PROGRESS' as const, title: 'Logged weekly progress summary' });
    }
  }

  return {
    date: dateStr,
    day_of_week: dayOfWeek,
    activity_level: level,
    tasks_completed: tasks,
    project_contributions: contributions,
    learning_milestones: learning,
    certificates_uploaded: certs,
    evidence_submissions: evidence,
    details,
  };
});

// Non-Selection Evaluations (Respectful, privacy-preserving explanation of employee's own status)
export const MOCK_NON_SELECTION_EVALUATIONS: NonSelectionEvaluation[] = [
  {
    project_id: 'proj-4',
    project_name: 'Data Lakehouse Pipeline Optimization',
    role: 'Data Engineer (PySpark / Iceberg)',
    domain: 'Data Platform',
    evaluated_at: '2026-09-07 09:00:00',
    requirements: [
      {
        requirement: 'Required Primary Skill: PySpark Lakehouse Optimization',
        candidate_status: 'Level 2.7 / 5.0 (Threshold: Level 4.0)',
        passed: false,
        details: 'Project requires proven expertise in PySpark partition tuning and Iceberg metadata catalog operations. Current verified profile indicates introductory knowledge.',
        suggested_next_step: 'Complete PySpark Lakehouse Optimization masterclass and submit work artifact evidence.',
        learning_recommendation: 'PySpark & Iceberg High-Throughput Partitioning (Advanced Path)',
      },
      {
        requirement: 'Available Weekly Bandwidth: 25 hrs / week',
        candidate_status: 'Available: 15 hrs / week',
        passed: false,
        details: 'You are currently committed to Cloud Infrastructure Modernization (20h) and Identity Guardrails (5h). Accepting 25h would increase utilization to 100%, violating workload protection safety guardrails.',
        suggested_next_step: 'Awaiting sprint release from Identity Guardrails (release pending Sept 12) to unlock additional weekly bandwidth.',
      },
      {
        requirement: 'Domain Fit: Cloud & Distributed Systems',
        candidate_status: 'Excellent Match (Level 5.0)',
        passed: true,
        details: 'Your cloud platform and infrastructure architecture background fully satisfies the domain prerequisites.',
        suggested_next_step: 'Leverage cloud architecture foundation when advancing data engineering proficiencies.',
      },
    ],
    suggested_actions: [
      { label: 'Enroll in PySpark Masterclass', action_type: 'LEARNING', link: '/employee/learning' },
      { label: 'Submit Lakehouse Evidence', action_type: 'EVIDENCE', link: '/employee/progress/new' },
      { label: 'Request Skill Assessment Review', action_type: 'REVIEW', link: '/employee/skills' },
    ],
  },
  {
    project_id: 'proj-2',
    project_name: 'Real-time Event Streaming Architecture',
    role: 'Backend Streaming Engineer',
    domain: 'Data Platform',
    evaluated_at: '2026-08-30 14:00:00',
    requirements: [
      {
        requirement: 'Primary Skill: Node.js / NestJS Microservices',
        candidate_status: 'Level 3.9 / 5.0 (Threshold: Level 4.0)',
        passed: true,
        details: 'Profile met operational requirements. Assigned to higher-priority Cloud Infrastructure Modernization initiative.',
        suggested_next_step: 'Maintain current active sprint priority.',
      },
      {
        requirement: 'Workload Protection Gate',
        candidate_status: 'Optimal Allocation Managed',
        passed: true,
        details: 'Workload distribution engine prioritized your expertise on the platform migration critical path.',
        suggested_next_step: 'No action required.',
      },
    ],
    suggested_actions: [
      { label: 'View Cloud Infrastructure Allocation', action_type: 'REVIEW', link: '/employee/projects/proj-1' },
    ],
  },
];

// Active Learning Goals
export const MOCK_LEARNING_GOALS: LearningGoal[] = [
  {
    id: 'lg-1',
    title: 'PySpark & Iceberg High-Throughput Partitioning',
    category: 'Data Platform',
    provider: 'Internal Data Academy',
    target_skill: 'PySpark & Iceberg Lakehouse Optimization',
    progress_pct: 45,
    due_date: '2026-09-30',
    status: 'IN_PROGRESS',
    estimated_hours: 15,
  },
  {
    id: 'lg-2',
    title: 'eBPF Cilium Enterprise Network Security',
    category: 'DevOps & Security',
    provider: 'Linux Foundation',
    target_skill: 'Kubernetes Cluster Orchestration',
    progress_pct: 80,
    due_date: '2026-09-20',
    status: 'IN_PROGRESS',
    estimated_hours: 10,
  },
  {
    id: 'lg-3',
    title: 'Event-Driven Microservices with Kafka & NestJS',
    category: 'Backend Architecture',
    provider: 'Confluent Developer Hub',
    target_skill: 'Node.js / NestJS Microservices',
    progress_pct: 0,
    due_date: '2026-10-15',
    status: 'RECOMMENDED',
    estimated_hours: 20,
  },
];

// Employee Notifications
export const MOCK_EMPLOYEE_NOTIFICATIONS: EmployeeNotification[] = [
  {
    id: 'notif-1',
    title: 'Allocation Proposal Approved by Manager',
    description: 'You have been assigned to Cloud Infrastructure Modernization as Lead Cloud Architect (20h/wk).',
    type: 'ALLOCATION',
    timestamp: '2 hours ago',
    is_read: false,
    link: '/employee/projects/proj-1',
  },
  {
    id: 'notif-2',
    title: 'Skill Evidence Verified: AWS Solutions Architect',
    description: 'Manager Alex Rivera approved your certification evidence. Cloud Architecture updated to Level 4.8 / 5.',
    type: 'EVIDENCE_VERIFIED',
    timestamp: '1 day ago',
    is_read: false,
    link: '/employee/skills/skill-1',
  },
  {
    id: 'notif-3',
    title: 'Sprint Deliverable Due in 3 Days',
    description: 'Ticket TCK-402 (Automate Terraform state migration) is due on Sept 10.',
    type: 'DEADLINE',
    timestamp: 'Yesterday',
    is_read: true,
    link: '/employee/projects/proj-1',
  },
  {
    id: 'notif-4',
    title: 'New High-Demand Learning Recommendation',
    description: 'Platform team has opened 2 PySpark engineering slots. Enroll in Lakehouse masterclass to close eligibility threshold.',
    type: 'SKILL_UPDATE',
    timestamp: '2 days ago',
    is_read: true,
    link: '/employee/learning',
  },
];

// Backward compatibility exports for existing pages


// Synthetic Enterprise Proposals and Candidates
export const MOCK_TEAM_PROPOSALS: TeamAllocationProposal[] = SYNTHETIC_TEAM_PROPOSALS;
export const MOCK_PROPOSALS: AllocationProposal[] = SYNTHETIC_PROPOSALS;

export const MOCK_SLOT_CANDIDATES: Record<string, RankedCandidate[]> = {
  'slot-101': [
    {
      employee_id: 'emp-101',
      employee_name: 'Dr. Sarah Chen',
      role: 'Lead Cloud Architect',
      slot_id: 'slot-101',
      slot_role: 'Lead Cloud Architect',
      slot_skill: 'AWS',
      remaining: 15,
      fairness: 0.94,
      performance: 0.95,
      skillScore: 0.98,
      knowledge: 0.95,
      risk_score: 0.10,
      confidence: 0.96,
      final_score: 0.948,
      completion_estimate_hours: 22,
      hard_constraint_status: 'ELIGIBLE',
      features_9: {
        skill_match_score: 1.0,
        workload_ratio: 0.625,
        task_complexity: 0.8,
        estimated_hours: 25,
        efficiency_score: 0.94,
        consistency_score: 0.95,
        reliability_score: 0.96,
        availability_score: 0.88,
        project_priority: 1.0,
      },
    },
  ],
  'slot-203': [
    {
      employee_id: 'emp-129',
      employee_name: 'Gabriel Morales',
      role: 'Data Platform Engineer',
      slot_id: 'slot-203',
      slot_role: 'Distributed Systems Engineer',
      slot_skill: 'Kafka',
      remaining: 28,
      fairness: 0.95,
      performance: 0.94,
      skillScore: 0.96,
      knowledge: 0.92,
      risk_score: 0.08,
      confidence: 0.95,
      final_score: 0.934,
      completion_estimate_hours: 20,
      hard_constraint_status: 'ELIGIBLE',
      features_9: {
        skill_match_score: 1.0,
        workload_ratio: 0.30,
        task_complexity: 1.0,
        estimated_hours: 20,
        efficiency_score: 0.93,
        consistency_score: 0.94,
        reliability_score: 0.95,
        availability_score: 0.90,
        project_priority: 1.0,
      },
    },
  ],
};

export const MOCK_CANDIDATES: RankedCandidate[] = Object.values(MOCK_SLOT_CANDIDATES).flat();
export const MOCK_EXCLUDED_CANDIDATES: ExcludedCandidate[] = SYNTHETIC_EXCLUDED_CANDIDATES;

// Synthetic Enterprise Tickets (32 enterprise tickets across 8 projects)
export const MOCK_TICKETS: Ticket[] = SYNTHETIC_TICKETS;

// Synthetic Enterprise Decision Logs & Operational Alerts
export const MOCK_DECISION_LOGS: AllocationDecisionLog[] = SYNTHETIC_DECISION_LOGS;
export const MOCK_ALERTS: SystemAlert[] = SYNTHETIC_ALERTS;

// Global App Notifications (Temporary User Event Inbox)
export const APP_NOTIFICATIONS: AppNotification[] = SYNTHETIC_NOTIFICATIONS;

export const MOCK_AUDIT_LOGS: SystemAuditLog[] = [
  {
    id: 'aud-101',
    actor_id: 'usr-mgr-1',
    actor_name: 'Alex Rivera',
    actor_role: 'MANAGER',
    action_type: 'PROPOSAL_APPROVED',
    project_id: 'proj-1',
    project_name: 'Cloud Infrastructure Modernization',
    employee_id: 'emp-101',
    employee_name: 'Dr. Sarah Chen',
    timestamp: '2026-09-02 09:30:15',
    proposal_id: 'prop-101',
    score_snapshot_ref: 'snap-9124-v2',
    model_version: 'v2.4.1 (Composite)',
    details: 'Approved allocation proposal for Dr. Sarah Chen in Lead Cloud Architect role (25 hrs/wk). Hard constraints satisfied, fairness index 0.88.',
    previous_state: 'PROPOSED',
    new_state: 'APPROVED',
  },
  {
    id: 'aud-102',
    actor_id: 'usr-admin-1',
    actor_name: 'System Admin (DevOps)',
    actor_role: 'ADMIN',
    action_type: 'WEIGHTS_UPDATED',
    timestamp: '2026-09-01 14:00:00',
    model_version: 'Engine-v3.2',
    details: 'Calibrated scoring weights: increased fairness weight from 0.15 to 0.20 and reduced risk penalty from 0.25 to 0.20.',
    previous_state: 'Weights Config v3.1',
    new_state: 'Weights Config v3.2',
  },
  {
    id: 'aud-103',
    actor_id: 'usr-mgr-1',
    actor_name: 'Alex Rivera',
    actor_role: 'MANAGER',
    action_type: 'EVIDENCE_VERIFIED',
    project_id: 'proj-3',
    project_name: 'Identity & Access Zero-Trust Guardrails',
    employee_id: 'emp-101',
    employee_name: 'Dr. Sarah Chen',
    timestamp: '2026-09-05 18:00:00',
    details: 'Verified milestone artifact PR #88 and signed off OAuth 2.0 Webhook task completion.',
    previous_state: 'UNDER_REVIEW',
    new_state: 'VERIFIED',
  },
  {
    id: 'aud-104',
    actor_id: 'usr-admin-1',
    actor_name: 'System Admin (DevOps)',
    actor_role: 'ADMIN',
    action_type: 'ROLE_CHANGED',
    employee_id: 'emp-104',
    employee_name: 'Devon Hughes',
    timestamp: '2026-08-28 11:30:00',
    details: 'Granted Manager authorization permissions to Devon Hughes following team lead promotion.',
    previous_state: 'EMPLOYEE',
    new_state: 'MANAGER',
  },
  {
    id: 'aud-105',
    actor_id: 'usr-mgr-1',
    actor_name: 'Alex Rivera',
    actor_role: 'MANAGER',
    action_type: 'RELEASE_APPROVED',
    project_id: 'proj-3',
    project_name: 'Identity & Access Zero-Trust Guardrails',
    employee_id: 'emp-101',
    employee_name: 'Dr. Sarah Chen',
    timestamp: '2026-09-06 09:15:00',
    details: 'Approved early allocation release request for Dr. Sarah Chen. Released 15 hrs/wk capacity back to available talent pool.',
    previous_state: 'ACTIVE',
    new_state: 'RELEASED',
  },
  {
    id: 'aud-106',
    actor_id: 'usr-sys-auto',
    actor_name: 'Backend Decision Engine',
    actor_role: 'ADMIN',
    action_type: 'PROPOSAL_GENERATED',
    project_id: 'proj-2',
    project_name: 'Real-time Event Streaming Architecture',
    timestamp: '2026-09-03 16:45:00',
    proposal_id: 'prop-202',
    model_version: 'v2.4.1 (ML Signal Engine)',
    details: 'Formed multi-person team proposal satisfying 4 required roles with 0 hard-constraint violations.',
  },
];

export const MOCK_DECISION_WEIGHTS: DecisionWeightsConfig = {
  version: 'v3.2',
  updated_at: '2026-09-01 14:00:00',
  updated_by: 'DevOps Security Admin',
  skill_match_weight: 0.35,
  performance_weight: 0.25,
  fairness_weight: 0.20,
  risk_penalty_weight: 0.20,
  workload_threshold_ratio: 0.85,
  strict_hard_constraints: true,
  enable_ml_fairness_calibration: true,
  auto_archive_proposals_days: 30,
  change_history: [
    {
      version: 'v3.2',
      changed_at: '2026-09-01 14:00',
      changed_by: 'DevOps Security Admin',
      rationale: 'Adjusted fairness coefficients to prevent workload clustering on top senior architects.',
      weights_summary: 'Skill: 35%, Performance: 25%, Fairness: 20%, Risk: 20%',
    },
    {
      version: 'v3.1',
      changed_at: '2026-08-15 10:30',
      changed_by: 'Operations Lead',
      rationale: 'Incorporated ML burnout signal penalty into candidate ranking function.',
      weights_summary: 'Skill: 40%, Performance: 25%, Fairness: 15%, Risk: 20%',
    },
    {
      version: 'v3.0',
      changed_at: '2026-07-01 09:00',
      changed_by: 'Platform Architect',
      rationale: 'Baseline decision weight configuration for multi-person project allocation engine.',
      weights_summary: 'Skill: 45%, Performance: 30%, Fairness: 15%, Risk: 10%',
    },
  ],
};

export const MOCK_MODEL_TELEMETRY: ModelTelemetry[] = [
  {
    id: 'mod-1',
    name: 'Performance & Velocity Signal Predictor',
    model_type: 'PERFORMANCE',
    version: 'v2.4.1',
    framework: 'Ridge Regression & XGBoost Regressor',
    status: 'OPERATIONAL',
    last_training_date: '2026-08-25',
    last_evaluation_date: '2026-09-01',
    dataset_version: 'ds-eval-2026q3-v1',
    dataset_sample_count: 14280,
    latency_p95_ms: 18,
    inference_throughput_rps: 420,
    registered_metrics: [
      { metric_name: 'RMSE', value: '0.042', description: 'Root mean squared error on velocity prediction benchmark' },
      { metric_name: 'R2 Score', value: '0.914', description: 'Coefficient of determination across historical sprint completions' },
      { metric_name: 'MAE', value: '0.029', description: 'Mean absolute error on sprint delivery velocity' },
    ],
    notes: 'Telemetric evaluation verified against Q2 ground-truth project deliverables.',
  },
  {
    id: 'mod-2',
    name: 'Milestone & Project Completion Probability',
    model_type: 'COMPLETION',
    version: 'v1.9.0',
    framework: 'Gradient Boosting Classifier (LightGBM)',
    status: 'OPERATIONAL',
    last_training_date: '2026-08-20',
    last_evaluation_date: '2026-08-30',
    dataset_version: 'ds-completion-v4',
    dataset_sample_count: 8900,
    latency_p95_ms: 22,
    inference_throughput_rps: 310,
    registered_metrics: [
      { metric_name: 'ROC-AUC', value: '0.938', description: 'Area under ROC curve on milestone completion outcomes' },
      { metric_name: 'F1 Score', value: '0.892', description: 'Harmonic mean of precision and recall on on-time delivery' },
      { metric_name: 'Brier Score', value: '0.061', description: 'Calibration error of predicted probability distributions' },
    ],
    notes: 'Includes dependency graph depth and cross-functional team familiarity signals.',
  },
  {
    id: 'mod-3',
    name: 'Burnout & Overutilization Risk Signal',
    model_type: 'BURNOUT_RISK',
    version: 'v3.1.2',
    framework: 'Calibrated Random Forest & Isolation Forest',
    status: 'OPERATIONAL',
    last_training_date: '2026-09-01',
    last_evaluation_date: '2026-09-05',
    dataset_version: 'ds-workload-risk-v2',
    dataset_sample_count: 6540,
    latency_p95_ms: 12,
    inference_throughput_rps: 540,
    registered_metrics: [
      { metric_name: 'Recall@Top10%', value: '0.951', description: 'Sensitivity to extreme overutilization occurrences' },
      { metric_name: 'PR-AUC', value: '0.884', description: 'Precision-Recall AUC for high-risk workload trajectories' },
      { metric_name: 'False Alarm Rate', value: '0.048', description: 'Rate of spurious burnout alerts on normal workload spikes' },
    ],
    notes: 'Strict privacy guardrails: uses anonymized capacity ratios and sprint velocity aggregates only.',
  },
];

export const MOCK_SYSTEM_HEALTH: SystemHealthSummary = {
  overall_status: 'HEALTHY',
  last_successful_prediction: '2 minutes ago (2026-09-07 18:27:14 UTC)',
  last_successful_allocation: '35 minutes ago (2026-09-07 17:54:02 UTC)',
  active_background_jobs: 4,
  services: [
    {
      name: 'NestJS REST Gateway API',
      component: 'BACKEND_API',
      status: 'HEALTHY',
      uptime_pct: 99.98,
      latency_ms: 14,
      last_heartbeat: '5s ago',
      details: 'HTTP/2 enabled with JWT verification filter & rate limiter active.',
      active_connections: 42,
      error_rate_pct: 0.01,
    },
    {
      name: 'FastAPI ML Inference Service',
      component: 'ML_SERVICE',
      status: 'HEALTHY',
      uptime_pct: 99.95,
      latency_ms: 38,
      last_heartbeat: '8s ago',
      details: '3 worker pods active with GPU acceleration enabled for vector embeddings.',
      active_connections: 12,
      error_rate_pct: 0.00,
    },
    {
      name: 'Supabase PostgreSQL Database',
      component: 'DATABASE',
      status: 'HEALTHY',
      uptime_pct: 99.99,
      latency_ms: 6,
      last_heartbeat: '2s ago',
      details: 'Connection pool operating at 16% capacity (8/50 connections).',
      active_connections: 8,
      error_rate_pct: 0.00,
    },
    {
      name: 'Cron Job & Telemetry Scheduler',
      component: 'JOB_SCHEDULER',
      status: 'HEALTHY',
      uptime_pct: 100.0,
      latency_ms: 2,
      last_heartbeat: '10s ago',
      details: 'Next automated capacity scan scheduled in 14 minutes.',
      active_connections: 2,
      error_rate_pct: 0.00,
    },
  ],
  recent_error_logs: [
    {
      id: 'err-1',
      timestamp: '2026-09-07 16:42:11',
      service: 'NestJS REST Gateway API',
      level: 'WARN',
      endpoint: 'POST /auth/refresh',
      message: 'Client session token expired before refresh handshake completed (User ID usr-emp-88). Handled with 401 redirect.',
      status_code: 401,
    },
    {
      id: 'err-2',
      timestamp: '2026-09-07 14:15:33',
      service: 'FastAPI ML Inference Service',
      level: 'INFO',
      endpoint: 'POST /predict/velocity',
      message: 'Cold start initialization completed in 240ms. Pre-warmed tensor caches loaded.',
      status_code: 200,
    },
    {
      id: 'err-3',
      timestamp: '2026-09-06 23:10:04',
      service: 'Supabase PostgreSQL Database',
      level: 'WARN',
      endpoint: 'SELECT * FROM allocations',
      message: 'Query execution time exceeded 120ms (142ms) during batch index maintenance.',
      status_code: 200,
    },
  ],
};

export const MOCK_ROLE_PERMISSIONS: RolePermissionMatrixItem[] = [
  {
    feature_area: 'Project Management',
    permission: 'Create / Edit Projects & Requirements',
    description: 'Define project scope, deadlines, domains, and staffing slot requirements.',
    manager: true,
    employee: false,
    admin: true,
  },
  {
    feature_area: 'Project Management',
    permission: 'View Assigned Project Workspace',
    description: 'Inspect sprint milestones, assigned tickets, and deliverable specifications.',
    manager: true,
    employee: true,
    admin: true,
  },
  {
    feature_area: 'Allocation Engine',
    permission: 'Trigger Automated Multi-Role Allocation',
    description: 'Execute deterministic optimization engine to generate team proposals.',
    manager: true,
    employee: false,
    admin: true,
  },
  {
    feature_area: 'Allocation Engine',
    permission: 'Approve / Reject Allocation Proposals',
    description: 'Final human governance sign-off on team candidate assignments.',
    manager: true,
    employee: false,
    admin: true,
  },
  {
    feature_area: 'Ticketing & Tasks',
    permission: 'Global Backlog Triage & Kanban Management',
    description: 'Create, prioritize, assign, and manage enterprise project tickets.',
    manager: true,
    employee: false,
    admin: true,
  },
  {
    feature_area: 'Ticketing & Tasks',
    permission: 'Execute & Submit Deliverable Evidence',
    description: 'Transition task statuses, submit code PRs, and request allocation release.',
    manager: false,
    employee: true,
    admin: false,
  },
  {
    feature_area: 'Workforce Governance',
    permission: 'Inspect Organization-wide Capacity & Burnout Telemetry',
    description: 'Monitor enterprise utilization trends, hiring signals, and risk alerts.',
    manager: true,
    employee: false,
    admin: true,
  },
  {
    feature_area: 'Workforce Governance',
    permission: 'Manage Employee Roles & RBAC Matrix',
    description: 'Promote users, configure permissions, and enforce security policies.',
    manager: false,
    employee: false,
    admin: true,
  },
  {
    feature_area: 'Decision Engine Configuration',
    permission: 'Modify Decision Scoring Weights & Constraints',
    description: 'Calibrate skill, performance, fairness, and risk penalty coefficients.',
    manager: false,
    employee: false,
    admin: true,
  },
  {
    feature_area: 'Security & Telemetry',
    permission: 'View Immutable System Audit Logs',
    description: 'Inspect full audit trail of allocation decisions, role modifications, and ML metadata.',
    manager: false,
    employee: false,
    admin: true,
  },
  {
    feature_area: 'Security & Telemetry',
    permission: 'Inspect ML Model Status & System Health',
    description: 'Review backend service uptimes, latencies, model versions, and error summaries.',
    manager: false,
    employee: false,
    admin: true,
  },
];

export const MOCK_SKILL_CATALOG: SkillCategoryDefinition[] = [
  {
    id: 'cat-cloud',
    name: 'Cloud & Infrastructure Architecture',
    domain: 'Platform Engineering',
    description: 'Multi-cloud architectures, Kubernetes container orchestration, Infrastructure as Code, and enterprise networking.',
    skills_count: 14,
    validation_frequency_months: 12,
    accepted_evidence_types: ['CERTIFICATE_UPLOAD', 'CREDENTIAL_URL', 'PROJECT_REPO_LINK', 'WORK_ARTIFACT'],
    proficiency_levels: [
      { level: 1, title: 'Novice', description: 'Basic familiarity with cloud consoles and simple VM deployments.', expected_evidence: 'Course completion or entry-level cloud certification.' },
      { level: 2, title: 'Developing', description: 'Can deploy standardized Terraform modules and manage basic container pods.', expected_evidence: 'Project PR references and associate cloud credential.' },
      { level: 3, title: 'Competent', description: 'Autonomous management of VPC networking, IAM boundaries, and CI/CD pipelines.', expected_evidence: 'Verified project deliverable and manager sign-off.' },
      { level: 4, title: 'Advanced', description: 'Designs high-availability multi-region clusters with zero-downtime failover.', expected_evidence: 'Production architecture design and senior credential.' },
      { level: 5, title: 'Expert / Lead', description: 'Organization-wide architectural governance, FinOps optimization, and disaster recovery.', expected_evidence: 'Multi-year track record, patent or enterprise blueprint authoring.' },
    ],
  },
  {
    id: 'cat-devops',
    name: 'DevOps & SRE Engineering',
    domain: 'Operations & Reliability',
    description: 'CI/CD pipeline automation, observability, incident response, Prometheus/Grafana monitoring, and chaos testing.',
    skills_count: 10,
    validation_frequency_months: 6,
    accepted_evidence_types: ['PROJECT_REPO_LINK', 'WORK_ARTIFACT', 'CERTIFICATE_UPLOAD'],
    proficiency_levels: [
      { level: 1, title: 'Novice', description: 'Understands Git workflows and basic pipeline trigger syntax.', expected_evidence: 'Basic workflow yaml contributions.' },
      { level: 2, title: 'Developing', description: 'Maintains Docker builds, automated test execution, and artifact registries.', expected_evidence: 'CI pipeline maintenance logs.' },
      { level: 3, title: 'Competent', description: 'Configures SLOs/SLIs, Prometheus alert rules, and automated rollbacks.', expected_evidence: 'Production monitoring dashboard deployment.' },
      { level: 4, title: 'Advanced', description: 'Implements GitOps (ArgoCD/Flux), service meshes (Istio), and progressive delivery.', expected_evidence: 'Enterprise GitOps architecture rollouts.' },
      { level: 5, title: 'Expert / Lead', description: 'Sets organizational SRE policies, error budget frameworks, and global incident protocols.', expected_evidence: 'Post-mortem leadership and SRE curriculum design.' },
    ],
  },
  {
    id: 'cat-data',
    name: 'Data Engineering & Stream Processing',
    domain: 'Data & Analytics',
    description: 'Kafka event streaming, distributed databases, BigQuery/Snowflake warehouses, and ETL/ELT pipelines.',
    skills_count: 12,
    validation_frequency_months: 12,
    accepted_evidence_types: ['PROJECT_REPO_LINK', 'WORK_ARTIFACT', 'CREDENTIAL_URL'],
    proficiency_levels: [
      { level: 1, title: 'Novice', description: 'Basic SQL queries and data extraction scripts.', expected_evidence: 'SQL assessment or coursework.' },
      { level: 2, title: 'Developing', description: 'Builds dbt models and scheduled cron ingestion tasks.', expected_evidence: 'dbt repository PRs.' },
      { level: 3, title: 'Competent', description: 'Implements PySpark batch jobs and Kafka consumer groups with error handling.', expected_evidence: 'Production pipeline verified by data lead.' },
      { level: 4, title: 'Advanced', description: 'Architects real-time streaming topologies with exactly-once processing guarantees.', expected_evidence: 'High-throughput Kafka cluster design.' },
      { level: 5, title: 'Expert / Lead', description: 'Governs enterprise data mesh, Lakehouse federation, and strict schema registries.', expected_evidence: 'Enterprise data architecture manifesto.' },
    ],
  },
  {
    id: 'cat-security',
    name: 'Cybersecurity & Zero-Trust Governance',
    domain: 'Security & Compliance',
    description: 'IAM fine-grained permissions, OAuth 2.0 / OIDC, secrets management, vulnerability scanning, and SOC2/ISO compliance.',
    skills_count: 8,
    validation_frequency_months: 6,
    accepted_evidence_types: ['CERTIFICATE_UPLOAD', 'CREDENTIAL_URL', 'WORK_ARTIFACT'],
    proficiency_levels: [
      { level: 1, title: 'Novice', description: 'Understands basic least-privilege principles and password security.', expected_evidence: 'Security awareness certification.' },
      { level: 2, title: 'Developing', description: 'Configures OAuth client credentials and scans dependencies for CVEs.', expected_evidence: 'Dependency audit pull requests.' },
      { level: 3, title: 'Competent', description: 'Implements JWT guardrails, KMS encryption keys, and mutual TLS.', expected_evidence: 'Security feature implementation.' },
      { level: 4, title: 'Advanced', description: 'Conducts threat modeling, zero-trust network policy enforcement, and audit defense.', expected_evidence: 'SOC2 Type II compliance audit pass.' },
      { level: 5, title: 'Expert / Lead', description: 'Enterprise CISO advisory, cryptographic protocols, and organizational security policy.', expected_evidence: 'CISSP / CISM credentials and security leadership.' },
    ],
  },
];
