-- ============================================================================
-- MIGRATION: 002_project_staffing_requirements.sql
-- PURPOSE: Multi-role team staffing requirements per project
-- ============================================================================

CREATE TABLE IF NOT EXISTS project_staffing_requirements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    required_role TEXT NOT NULL,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE RESTRICT,
    minimum_proficiency INTEGER NOT NULL DEFAULT 3 CHECK (minimum_proficiency BETWEEN 1 AND 5),
    required_headcount INTEGER NOT NULL DEFAULT 1 CHECK (required_headcount > 0),
    allocation_hours_per_week INTEGER DEFAULT 40 CHECK (allocation_hours_per_week IS NULL OR allocation_hours_per_week > 0),
    allocation_percentage NUMERIC(5,2) CHECK (allocation_percentage IS NULL OR (allocation_percentage > 0 AND allocation_percentage <= 100)),
    is_mandatory BOOLEAN NOT NULL DEFAULT true,
    priority INTEGER NOT NULL DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for fast query joins
CREATE INDEX IF NOT EXISTS idx_staffing_req_project_id ON project_staffing_requirements(project_id);
CREATE INDEX IF NOT EXISTS idx_staffing_req_skill_id ON project_staffing_requirements(skill_id);

-- Dedicated table-scoped trigger function to avoid collisions
CREATE OR REPLACE FUNCTION trg_fn_staffing_requirements_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_staffing_req_updated_at ON project_staffing_requirements;
CREATE TRIGGER trg_staffing_req_updated_at
    BEFORE UPDATE ON project_staffing_requirements
    FOR EACH ROW
    EXECUTE FUNCTION trg_fn_staffing_requirements_updated_at();
