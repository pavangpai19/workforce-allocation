-- WorkforceIQ Live Pre-Reset Fresh Backup
-- Timestamp: 2026-11-04T15:54:35.945Z
BEGIN;

INSERT INTO public.skills (id, name) VALUES ('b4cc67f8-1eb1-4e9a-8980-f2a67584b3fc', 'React') ON CONFLICT DO NOTHING;
INSERT INTO public.skills (id, name) VALUES ('45c21a7c-1697-48ba-bf34-d2bdab25d501', 'Python') ON CONFLICT DO NOTHING;

INSERT INTO public.employees (id, name, email, weekly_capacity_hours, efficiency_score, reliability_score, created_at) VALUES ('32aed4c6-1d27-48cb-943a-3d28900d8992', 'Pavan', 'pavan@test.com', 40, 1, 1, '2026-02-22T04:50:40.74483+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.employees (id, name, email, weekly_capacity_hours, efficiency_score, reliability_score, created_at) VALUES ('04ca3551-d0df-45ab-851a-7e8d23aad45e', 'Rahul', 'rahul@test.com', 35, 1, 1, '2026-02-22T05:07:07.846205+00:00') ON CONFLICT DO NOTHING;

INSERT INTO public.employee_skills (employee_id, skill_id, proficiency_level) VALUES ('32aed4c6-1d27-48cb-943a-3d28900d8992', '45c21a7c-1697-48ba-bf34-d2bdab25d501', 4) ON CONFLICT DO NOTHING;
INSERT INTO public.employee_skills (employee_id, skill_id, proficiency_level) VALUES ('32aed4c6-1d27-48cb-943a-3d28900d8992', 'b4cc67f8-1eb1-4e9a-8980-f2a67584b3fc', 4) ON CONFLICT DO NOTHING;

INSERT INTO public.projects (id, name, project_priority, estimated_total_hours, start_date, end_date, status, created_at) VALUES ('d0032f98-9087-4aeb-841e-6b84b39c6151', 'AI Workforce Engine', 5, 200, '2026-02-25', '2026-03-30', 'PLANNED', '2026-02-22T05:16:14.30453+00:00') ON CONFLICT DO NOTHING;
INSERT INTO public.projects (id, name, project_priority, estimated_total_hours, start_date, end_date, status, created_at) VALUES ('02a90ed6-e4a6-4e3b-9950-69467c7d764c', 'AI Workforce Engine', 5, 200, '2026-02-25', '2026-03-30', 'PLANNED', '2026-02-25T09:33:53.100964+00:00') ON CONFLICT DO NOTHING;

INSERT INTO public.allocations (id, employee_id, project_id, week_start_date, allocated_hours, status, created_at, proposal_id, proposal_member_id, staffing_requirement_id, assigned_role, allocated_hours_per_week, allocation_percentage, start_date, planned_end_date, actual_end_date, released_at) VALUES ('18de9afe-d0be-473d-b1e1-622d6fa1e52e', '32aed4c6-1d27-48cb-943a-3d28900d8992', 'd0032f98-9087-4aeb-841e-6b84b39c6151', '2026-02-24', 20, 'PROPOSED', '2026-02-22T05:50:07.919199+00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.allocations (id, employee_id, project_id, week_start_date, allocated_hours, status, created_at, proposal_id, proposal_member_id, staffing_requirement_id, assigned_role, allocated_hours_per_week, allocation_percentage, start_date, planned_end_date, actual_end_date, released_at) VALUES ('7237662c-09dc-4fb8-ba13-31f6fe3edaca', '32aed4c6-1d27-48cb-943a-3d28900d8992', '02a90ed6-e4a6-4e3b-9950-69467c7d764c', '2026-02-24', 10, 'PROPOSED', '2026-02-25T09:37:01.304318+00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT DO NOTHING;
INSERT INTO public.allocations (id, employee_id, project_id, week_start_date, allocated_hours, status, created_at, proposal_id, proposal_member_id, staffing_requirement_id, assigned_role, allocated_hours_per_week, allocation_percentage, start_date, planned_end_date, actual_end_date, released_at) VALUES ('1e5bf114-6e7a-4b78-8dfd-78b06debb74e', '32aed4c6-1d27-48cb-943a-3d28900d8992', '02a90ed6-e4a6-4e3b-9950-69467c7d764c', '2026-02-24', 10, 'PROPOSED', '2026-03-04T07:50:55.639632+00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL) ON CONFLICT DO NOTHING;

INSERT INTO public.employee_performance (id, employee_id, project_id, week_start_date, delivery_score, quality_score, completion_status, created_at) VALUES ('fb648c59-1fb3-4134-9aaa-f78e00321ed3', '32aed4c6-1d27-48cb-943a-3d28900d8992', '02a90ed6-e4a6-4e3b-9950-69467c7d764c', '2026-02-24', 0.9, 0.8, 'COMPLETED', '2026-02-25T09:46:54.823765') ON CONFLICT DO NOTHING;
INSERT INTO public.employee_performance (id, employee_id, project_id, week_start_date, delivery_score, quality_score, completion_status, created_at) VALUES ('29c562ec-1cc5-4f63-a2df-5d4ca33a1bd3', '32aed4c6-1d27-48cb-943a-3d28900d8992', '02a90ed6-e4a6-4e3b-9950-69467c7d764c', '2026-02-24', 0.95, 0.9, 'COMPLETED', '2026-02-25T10:24:01.922985') ON CONFLICT DO NOTHING;

INSERT INTO public.decision_weights (id, fairness_weight, performance_weight, skill_weight, updated_at, knowledge_weight, risk_weight) VALUES ('29a9f570-7dd9-4dca-ad01-9ec7a3fc048f', 0.3, 0.4, 0.3, '2026-04-21T06:04:54.770286', 0.15, 0.1) ON CONFLICT DO NOTHING;

COMMIT;
