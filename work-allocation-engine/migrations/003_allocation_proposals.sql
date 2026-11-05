-- ============================================================================
-- MIGRATION: 003_allocation_proposals.sql
-- PURPOSE: Multi-role team allocation proposals and candidate scoring snapshot
-- ============================================================================

-- Proposals table
CREATE TABLE IF NOT EXISTS allocation_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    requested_by UUID REFERENCES employees(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (
        status IN (
            'DRAFT',
            'GENERATING',
            'PENDING_APPROVAL',
            'APPROVED',
            'REJECTED',
            'PARTIALLY_COMMITTED',
            'EXPIRED',
            'FAILED'
        )
    ),
    requested_team_size INTEGER NOT NULL DEFAULT 1 CHECK (requested_team_size > 0),
    selected_headcount INTEGER NOT NULL DEFAULT 0 CHECK (selected_headcount >= 0),
    proposal_summary JSONB,
    staffing_gap_summary JSONB,
    decision_weight_version TEXT,
    model_version_summary JSONB,
    explanation TEXT,
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES employees(id) ON DELETE SET NULL,
    review_comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_proposals_project_id ON allocation_proposals(project_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON allocation_proposals(status);

-- Dedicated table-scoped trigger function to avoid collisions
CREATE OR REPLACE FUNCTION trg_fn_allocation_proposals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_proposals_updated_at ON allocation_proposals;
CREATE TRIGGER trg_proposals_updated_at
    BEFORE UPDATE ON allocation_proposals
    FOR EACH ROW
    EXECUTE FUNCTION trg_fn_allocation_proposals_updated_at();

-- Proposed team member allocations per slot
-- IMPORTANT: employee_id uses ON DELETE RESTRICT to preserve proposal and scoring history
CREATE TABLE IF NOT EXISTS allocation_proposal_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID NOT NULL REFERENCES allocation_proposals(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
    staffing_requirement_id UUID NOT NULL REFERENCES project_staffing_requirements(id) ON DELETE CASCADE,
    proposed_role TEXT NOT NULL,
    allocated_hours_per_week INTEGER CHECK (allocated_hours_per_week IS NULL OR allocated_hours_per_week > 0),
    allocation_percentage NUMERIC(5,2) CHECK (allocation_percentage IS NULL OR (allocation_percentage > 0 AND allocation_percentage <= 100)),
    eligibility_status TEXT NOT NULL DEFAULT 'ELIGIBLE',
    constraint_snapshot JSONB,
    score_breakdown JSONB,
    skill_match_score NUMERIC(5,4),
    predicted_performance NUMERIC(5,4),
    predicted_completion_hours NUMERIC(7,2),
    burnout_risk_probability NUMERIC(5,4),
    fairness_adjustment NUMERIC(5,4),
    final_score NUMERIC(5,4),
    availability_status TEXT NOT NULL DEFAULT 'AVAILABLE_NOW' CHECK (
        availability_status IN (
            'AVAILABLE_NOW',
            'AVAILABLE_AFTER_RELEASE_CONFIRMATION',
            'ACTIVE_UNFINISHED_WORK',
            'UNAVAILABLE',
            'ON_LEAVE',
            'CAPACITY_CONSTRAINED'
        )
    ),
    explanation TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_proposal_employee UNIQUE (proposal_id, employee_id)
);

CREATE INDEX IF NOT EXISTS idx_proposal_members_proposal_id ON allocation_proposal_members(proposal_id);
CREATE INDEX IF NOT EXISTS idx_proposal_members_employee_id ON allocation_proposal_members(employee_id);
CREATE INDEX IF NOT EXISTS idx_proposal_members_requirement_id ON allocation_proposal_members(staffing_requirement_id);
