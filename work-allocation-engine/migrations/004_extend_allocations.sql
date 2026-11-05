-- ============================================================================
-- MIGRATION: 004_extend_allocations.sql
-- PURPOSE: Additive columns on existing allocations table for lifecycle tracking
-- ============================================================================

-- Safely add additive columns if they do not already exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'allocations' AND column_name = 'proposal_id') THEN
        ALTER TABLE allocations ADD COLUMN proposal_id UUID REFERENCES allocation_proposals(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'allocations' AND column_name = 'proposal_member_id') THEN
        ALTER TABLE allocations ADD COLUMN proposal_member_id UUID REFERENCES allocation_proposal_members(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'allocations' AND column_name = 'staffing_requirement_id') THEN
        ALTER TABLE allocations ADD COLUMN staffing_requirement_id UUID REFERENCES project_staffing_requirements(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'allocations' AND column_name = 'assigned_role') THEN
        ALTER TABLE allocations ADD COLUMN assigned_role TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'allocations' AND column_name = 'allocated_hours_per_week') THEN
        ALTER TABLE allocations ADD COLUMN allocated_hours_per_week INTEGER;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'allocations' AND column_name = 'allocation_percentage') THEN
        ALTER TABLE allocations ADD COLUMN allocation_percentage NUMERIC(5,2);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'allocations' AND column_name = 'start_date') THEN
        ALTER TABLE allocations ADD COLUMN start_date DATE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'allocations' AND column_name = 'planned_end_date') THEN
        ALTER TABLE allocations ADD COLUMN planned_end_date DATE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'allocations' AND column_name = 'actual_end_date') THEN
        ALTER TABLE allocations ADD COLUMN actual_end_date DATE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'allocations' AND column_name = 'status') THEN
        ALTER TABLE allocations ADD COLUMN status TEXT DEFAULT 'ACTIVE';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'allocations' AND column_name = 'released_at') THEN
        ALTER TABLE allocations ADD COLUMN released_at TIMESTAMPTZ;
    END IF;
END $$;

-- Add safe check constraint for canonical allocation lifecycle states if not present
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'chk_allocations_status'
    ) THEN
        ALTER TABLE allocations ADD CONSTRAINT chk_allocations_status CHECK (
            status IS NULL OR status IN (
                'ACTIVE',
                'WORK_COMPLETED',
                'AWAITING_REVIEW',
                'AWAITING_RELEASE_CONFIRMATION',
                'RELEASED',
                'COMPLETED',
                'CANCELLED'
            )
        );
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- If pre-existing legacy data contains different values, log/skip rather than blocking
        RAISE NOTICE 'Constraint chk_allocations_status could not be added due to existing data; skipping.';
END $$;

CREATE INDEX IF NOT EXISTS idx_allocations_proposal_id ON allocations(proposal_id);
CREATE INDEX IF NOT EXISTS idx_allocations_status ON allocations(status);
