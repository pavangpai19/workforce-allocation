-- ============================================================================
-- MIGRATION: 005_alerts_and_tasks_assessment.sql
-- PURPOSE: Assessment & non-breaking reuse strategy for existing alerts & tasks tables
-- ============================================================================

-- ASSESSMENT:
-- 1. ALERTS:
--    The system already references an 'alerts' table for capacity, burnout, and hiring signals.
--    Instead of creating a duplicate 'system_alerts' table, the existing 'alerts' table is
--    extended additively to support staffing_requirement_id and proposal_id.
--
-- 2. TASKS / TICKETS:
--    The system references 'task_history' for completed deliverables and 'tasks' for sprint work.
--    Ticketing and full sprint board persistence will be phased additively without breaking
--    existing knowledge score calculations that read 'task_history'.

DO $$
BEGIN
    -- Ensure alerts table supports staffing and proposal alerts if alerts exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'alerts') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'alerts' AND column_name = 'project_id') THEN
            ALTER TABLE alerts ADD COLUMN project_id UUID REFERENCES projects(id) ON DELETE SET NULL;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'alerts' AND column_name = 'proposal_id') THEN
            ALTER TABLE alerts ADD COLUMN proposal_id UUID REFERENCES allocation_proposals(id) ON DELETE SET NULL;
        END IF;

        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'alerts' AND column_name = 'status') THEN
            ALTER TABLE alerts ADD COLUMN status TEXT DEFAULT 'ACTIVE';
        END IF;
    END IF;
END $$;
