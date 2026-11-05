-- OPTIONAL STRESS-TEST FIXTURE (DISABLED BY DEFAULT)
-- Apply ONLY to test capacity alert triggers and rebalancing flows:
BEGIN;
INSERT INTO allocations (id, employee_id, project_id, allocated_hours, allocated_hours_per_week, week_start_date, status, assigned_role) VALUES
  ('55000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', 10, 10, '2026-11-02', 'ACTIVE', 'Senior Cloud Architect'),
  ('55000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000002', 10, 10, '2026-11-02', 'ACTIVE', 'Staff Backend Engineer')
ON CONFLICT (id) DO NOTHING;

INSERT INTO alerts (id, type, severity, message, status, employee_id, metadata) VALUES
  ('95000000-0000-4000-8000-000000000001', 'CAPACITY_EXCEEDED', 'CRITICAL', 'Capacity exceeded: Aarav Sharma is allocated 48h/40h (120% capacity).', 'ACTIVE', '10000000-0000-4000-8000-000000000001', '{"total_allocated_hours":48,"max_capacity_hours":40,"utilization_percentage":120}'::jsonb),
  ('95000000-0000-4000-8000-000000000002', 'CAPACITY_EXCEEDED', 'CRITICAL', 'Capacity exceeded: Priya Patel is allocated 46h/40h (115% capacity).', 'ACTIVE', '10000000-0000-4000-8000-000000000002', '{"total_allocated_hours":46,"max_capacity_hours":40,"utilization_percentage":115}'::jsonb)
ON CONFLICT (id) DO NOTHING;
COMMIT;
