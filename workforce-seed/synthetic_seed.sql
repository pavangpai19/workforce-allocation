-- ============================================================================
-- WORKFORCEIQ SYNTHETIC ENTERPRISE DATASET (APEXCORE TECHNOLOGIES)
-- ============================================================================
-- Reference Date: 2026-11-04
-- Random Seed: 20261104
-- Provenance: Fully synthetic dataset conforming 100% to live Supabase PostgreSQL schema
-- Target: 21 verified relational tables in exact foreign key dependency order
-- SAFETY NOTICE: Prepared for manual review / staging execution.
-- DO NOT APPLY TO REMOTE PRODUCTION WITHOUT EXPLICIT USER AUTHORIZATION.
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. CANONICAL SKILLS (28 records)
-- ----------------------------------------------------------------------------
INSERT INTO skills (id, name) VALUES
  ('20000000-0000-4000-8000-000000000001', 'TypeScript'),
  ('b4cc67f8-1eb1-4e9a-8980-f2a67584b3fc', 'React'),
  ('20000000-0000-4000-8000-000000000003', 'Node.js'),
  ('45c21a7c-1697-48ba-bf34-d2bdab25d501', 'Python'),
  ('20000000-0000-4000-8000-000000000005', 'Go'),
  ('20000000-0000-4000-8000-000000000006', 'PostgreSQL'),
  ('20000000-0000-4000-8000-000000000007', 'Kubernetes'),
  ('20000000-0000-4000-8000-000000000008', 'Docker'),
  ('20000000-0000-4000-8000-000000000009', 'AWS'),
  ('20000000-0000-4000-8000-00000000000a', 'Terraform'),
  ('20000000-0000-4000-8000-00000000000b', 'PyTorch'),
  ('20000000-0000-4000-8000-00000000000c', 'Kafka'),
  ('20000000-0000-4000-8000-00000000000d', 'Redis'),
  ('20000000-0000-4000-8000-00000000000e', 'Next.js'),
  ('20000000-0000-4000-8000-00000000000f', 'GraphQL'),
  ('20000000-0000-4000-8000-000000000010', 'FastAPI'),
  ('20000000-0000-4000-8000-000000000011', 'Java'),
  ('20000000-0000-4000-8000-000000000012', 'Spring Boot'),
  ('20000000-0000-4000-8000-000000000013', 'Flutter'),
  ('20000000-0000-4000-8000-000000000014', 'React Native'),
  ('20000000-0000-4000-8000-000000000015', 'CI/CD Pipelines'),
  ('20000000-0000-4000-8000-000000000016', 'SRE & Observability'),
  ('20000000-0000-4000-8000-000000000017', 'Data Modeling'),
  ('20000000-0000-4000-8000-000000000018', 'Snowflake'),
  ('20000000-0000-4000-8000-000000000019', 'Automated Testing'),
  ('20000000-0000-4000-8000-00000000001a', 'System Architecture'),
  ('20000000-0000-4000-8000-00000000001b', 'Cybersecurity & IAM'),
  ('20000000-0000-4000-8000-00000000001c', 'UI/UX Design Systems')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- ----------------------------------------------------------------------------
-- 2. EMPLOYEES BASE DIRECTORY (40 records)
-- ----------------------------------------------------------------------------
INSERT INTO employees (id, name, email, weekly_capacity_hours, efficiency_score, reliability_score, created_at) VALUES
  ('10000000-0000-4000-8000-000000000001', 'Elena Rostova', 'elena.rostova@workforce.example', 40, 1.05, 0.99, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000002', 'Marcus Vance', 'marcus.vance@workforce.example', 40, 1.02, 0.97, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000003', 'Devansh Sharma', 'devansh.sharma@workforce.example', 40, 1.15, 0.98, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000004', 'Sarah Jenkins', 'sarah.jenkins@workforce.example', 40, 1.1, 0.94, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000005', 'Liam O''Connor', 'liam.oconnor@workforce.example', 40, 1.04, 0.95, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000006', 'Priya Patel', 'priya.patel@workforce.example', 40, 1.08, 0.96, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000007', 'Alex Chen', 'alex.chen@workforce.example', 40, 1.02, 0.93, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000008', 'Maya Lin', 'maya.lin@workforce.example', 40, 0.98, 0.91, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000009', 'Tariq Al-Mansoor', 'tariq.mansoor@workforce.example', 40, 1.06, 0.92, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-00000000000a', 'Chloe Dubois', 'chloe.dubois@workforce.example', 40, 0.97, 0.9, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-00000000000b', 'Lucas Silva', 'lucas.silva@workforce.example', 40, 0.9, 0.88, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-00000000000c', 'Emily Watson', 'emily.watson@workforce.example', 40, 0.92, 0.89, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-00000000000d', 'Mateo Rossi', 'mateo.rossi@workforce.example', 20, 1.12, 0.95, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-00000000000e', 'Aisha Bello', 'aisha.bello@workforce.example', 40, 1.05, 0.94, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-00000000000f', 'Kenji Sato', 'kenji.sato@workforce.example', 40, 1.01, 0.93, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000010', 'Sofia Gomez', 'sofia.gomez@workforce.example', 40, 0.99, 0.92, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000011', 'David Kim', 'david.kim@workforce.example', 40, 1.03, 0.93, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000012', 'Rachel Green', 'rachel.green@workforce.example', 40, 0.89, 0.87, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000013', 'Jordan Taylor', 'jordan.taylor@workforce.example', 40, 1.06, 0.97, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000014', 'Hannah Abbott', 'hannah.abbott@workforce.example', 40, 1.04, 0.96, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000015', 'Gabriel Santos', 'gabriel.santos@workforce.example', 40, 1.14, 0.98, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000016', 'Zoe Kravitz', 'zoe.kravitz@workforce.example', 40, 1.02, 0.94, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000017', 'Oliver Wright', 'oliver.wright@workforce.example', 30, 1, 0.95, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000018', 'Nora Helmer', 'nora.helmer@workforce.example', 40, 0.94, 0.9, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000019', 'Viktor Meyer', 'viktor.meyer@workforce.example', 40, 1.18, 0.97, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-00000000001a', 'Fatima Zahra', 'fatima.zahra@workforce.example', 40, 1.11, 0.98, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-00000000001b', 'Christian Bale', 'christian.bale@workforce.example', 40, 1.07, 0.96, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-00000000001c', 'Ananya Roy', 'ananya.roy@workforce.example', 40, 1.03, 0.94, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-00000000001d', 'Sean Murphy', 'sean.murphy@workforce.example', 40, 0.96, 0.91, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-00000000001e', 'Carlos Vega', 'carlos.vega@workforce.example', 20, 0.88, 0.86, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-00000000001f', 'Dr. Aris Thorne', 'aris.thorne@workforce.example', 40, 1.16, 0.98, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000020', 'Leila Mahmoud', 'leila.mahmoud@workforce.example', 40, 1.09, 0.96, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000021', 'Ethan Hunt', 'ethan.hunt@workforce.example', 40, 1.06, 0.94, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000022', 'Nina Simone', 'nina.simone@workforce.example', 40, 1.02, 0.93, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000023', 'Kevin Bacon', 'kevin.bacon@workforce.example', 40, 0.98, 0.91, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000024', 'Mira Nair', 'mira.nair@workforce.example', 40, 0.91, 0.89, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000025', 'Travis Scott', 'travis.scott@workforce.example', 40, 1.1, 0.97, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000026', 'Megan Fox', 'megan.fox@workforce.example', 40, 1.04, 0.94, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000027', 'Samuel Jackson', 'samuel.jackson@workforce.example', 40, 0.99, 0.92, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000028', 'Jessica Alba', 'jessica.alba@workforce.example', 40, 0.93, 0.88, '2025-06-01 09:00:00+00')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  weekly_capacity_hours = EXCLUDED.weekly_capacity_hours,
  efficiency_score = EXCLUDED.efficiency_score,
  reliability_score = EXCLUDED.reliability_score;

-- ----------------------------------------------------------------------------
-- 3. EMPLOYEE AUTH & RBAC (40 records)
-- ----------------------------------------------------------------------------
INSERT INTO employee_auth (employee_id, auth_user_id, role, is_active, created_at) VALUES
  ('10000000-0000-4000-8000-000000000001', 'f0000000-0000-4000-8000-000000000001', 'MANAGER', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000002', 'f0000000-0000-4000-8000-000000000002', 'MANAGER', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000003', 'f0000000-0000-4000-8000-000000000003', 'EMPLOYEE', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000004', 'f0000000-0000-4000-8000-000000000004', 'EMPLOYEE', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000005', 'f0000000-0000-4000-8000-000000000005', 'EMPLOYEE', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000006', 'f0000000-0000-4000-8000-000000000006', 'EMPLOYEE', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000007', 'f0000000-0000-4000-8000-000000000007', 'EMPLOYEE', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000008', 'f0000000-0000-4000-8000-000000000008', 'EMPLOYEE', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000009', 'f0000000-0000-4000-8000-000000000009', 'EMPLOYEE', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-00000000000a', 'f0000000-0000-4000-8000-00000000000a', 'EMPLOYEE', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-00000000000b', 'f0000000-0000-4000-8000-00000000000b', 'EMPLOYEE', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-00000000000c', 'f0000000-0000-4000-8000-00000000000c', 'EMPLOYEE', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-00000000000d', 'f0000000-0000-4000-8000-00000000000d', 'EMPLOYEE', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-00000000000e', 'f0000000-0000-4000-8000-00000000000e', 'EMPLOYEE', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-00000000000f', 'f0000000-0000-4000-8000-00000000000f', 'EMPLOYEE', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000010', 'f0000000-0000-4000-8000-000000000010', 'EMPLOYEE', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000011', 'f0000000-0000-4000-8000-000000000011', 'EMPLOYEE', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000012', 'f0000000-0000-4000-8000-000000000012', 'EMPLOYEE', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000013', 'f0000000-0000-4000-8000-000000000013', 'EMPLOYEE', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000014', 'f0000000-0000-4000-8000-000000000014', 'EMPLOYEE', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000015', 'f0000000-0000-4000-8000-000000000015', 'EMPLOYEE', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000016', 'f0000000-0000-4000-8000-000000000016', 'EMPLOYEE', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000017', 'f0000000-0000-4000-8000-000000000017', 'EMPLOYEE', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000018', 'f0000000-0000-4000-8000-000000000018', 'EMPLOYEE', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000019', 'f0000000-0000-4000-8000-000000000019', 'EMPLOYEE', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-00000000001a', 'f0000000-0000-4000-8000-00000000001a', 'EMPLOYEE', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-00000000001b', 'f0000000-0000-4000-8000-00000000001b', 'EMPLOYEE', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-00000000001c', 'f0000000-0000-4000-8000-00000000001c', 'EMPLOYEE', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-00000000001d', 'f0000000-0000-4000-8000-00000000001d', 'EMPLOYEE', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-00000000001e', 'f0000000-0000-4000-8000-00000000001e', 'EMPLOYEE', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-00000000001f', 'f0000000-0000-4000-8000-00000000001f', 'EMPLOYEE', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000020', 'f0000000-0000-4000-8000-000000000020', 'EMPLOYEE', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000021', 'f0000000-0000-4000-8000-000000000021', 'EMPLOYEE', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000022', 'f0000000-0000-4000-8000-000000000022', 'EMPLOYEE', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000023', 'f0000000-0000-4000-8000-000000000023', 'EMPLOYEE', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000024', 'f0000000-0000-4000-8000-000000000024', 'EMPLOYEE', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000025', 'f0000000-0000-4000-8000-000000000025', 'EMPLOYEE', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000026', 'f0000000-0000-4000-8000-000000000026', 'EMPLOYEE', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000027', 'f0000000-0000-4000-8000-000000000027', 'EMPLOYEE', true, '2025-06-01 09:00:00+00'),
  ('10000000-0000-4000-8000-000000000028', 'f0000000-0000-4000-8000-000000000028', 'EMPLOYEE', true, '2025-06-01 09:00:00+00')
ON CONFLICT (employee_id) DO UPDATE SET
  auth_user_id = EXCLUDED.auth_user_id,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active;

-- ----------------------------------------------------------------------------
-- 4. EMPLOYEE PROFILES (40 records)
-- ----------------------------------------------------------------------------
INSERT INTO employee_profiles (
  id, employee_id, technical_strength, leadership_score, communication_score,
  ownership_score, adaptability_score, learning_speed, collaboration_score,
  documentation_score, preferred_domains, risk_flags, profile_summary,
  profile_version, strengths, weaknesses, recommended_roles,
  training_recommendations, career_path, consistency_score, reliability_score,
  workload_tolerance, availability_score, generated_by, llm_version
) VALUES
  (
    '70000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 4.69, 4.69, 3.94,
    4.45, 4.15, 3.84, 4.33,
    3.5, '{"Engineering Strategy","Resource Management"}'::text[], '{}'::text[], 'Elena Rostova is a VP of Engineering within Leadership with exceptional competence in System Architecture, Technical Mentorship, High Concurrency.',
    1, '{"System Architecture","Technical Mentorship","High Concurrency"}'::text[], '{"Occasional Reluctance to Delegate Critical Path Tasks"}'::text[], '{"VP of Engineering","Engineering Manager"}'::text[],
    '{"Executive Communication"}'::text[], 'Distinguished Engineer / Director', 0.95, 0.99,
    0.87, 0.31, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002', 4.63, 4.72, 4.44,
    4.7, 3.89, 3.72, 4.25,
    3.62, '{"Engineering Strategy","Resource Management"}'::text[], '{}'::text[], 'Marcus Vance is a Director of Engineering Operations within Leadership with exceptional competence in System Architecture, Technical Mentorship, High Concurrency.',
    1, '{"System Architecture","Technical Mentorship","High Concurrency"}'::text[], '{"Occasional Reluctance to Delegate Critical Path Tasks"}'::text[], '{"Director of Engineering Operations","Engineering Manager"}'::text[],
    '{"Executive Communication"}'::text[], 'Distinguished Engineer / Director', 0.88, 0.97,
    0.92, 0.22, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000003', 4.77, 4.34, 4.09,
    4.72, 4.18, 4.1, 4.84,
    4.43, '{"Fintech","Distributed Systems","Cloud Native"}'::text[], '{}'::text[], 'Devansh Sharma is a Principal Distributed Systems Lead within Software Engineering with exceptional competence in System Architecture, Technical Mentorship, High Concurrency.',
    1, '{"System Architecture","Technical Mentorship","High Concurrency"}'::text[], '{"Occasional Reluctance to Delegate Critical Path Tasks"}'::text[], '{"Principal Distributed Systems Lead","Engineering Manager"}'::text[],
    '{"Executive Communication"}'::text[], 'Distinguished Engineer / Director', 0.89, 0.98,
    0.84, 0.38, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000004', 4.87, 4.56, 3.53,
    4.56, 3.8, 4.38, 3.92,
    3.7, '{"Fintech","Distributed Systems","Cloud Native"}'::text[], '{"High Burnout Probability","Over-allocated >100%"}'::text[], 'Sarah Jenkins is a Staff Frontend Architect within Software Engineering with exceptional competence in System Architecture, Technical Mentorship, High Concurrency.',
    1, '{"System Architecture","Technical Mentorship","High Concurrency"}'::text[], '{"Occasional Reluctance to Delegate Critical Path Tasks"}'::text[], '{"Staff Frontend Architect","Engineering Manager"}'::text[],
    '{"Executive Communication"}'::text[], 'Distinguished Engineer / Director', 0.95, 0.94,
    0.86, 0, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000005', 3.92, 3.36, 3.89,
    3.64, 3.94, 4.38, 4.33,
    4.27, '{"Fintech","Distributed Systems","Cloud Native"}'::text[], '{}'::text[], 'Liam O''Connor is a Senior Backend Engineer within Software Engineering with exceptional competence in Domain Modeling, Clean Code, API Design.',
    1, '{"Domain Modeling","Clean Code","API Design"}'::text[], '{"Prefers Deep Work Over Frequent Context Switching"}'::text[], '{"Senior Backend Engineer","Tech Lead"}'::text[],
    '{"Executive Communication"}'::text[], 'Staff Engineer / Tech Lead', 0.89, 0.95,
    0.88, 0.45, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-000000000006', '10000000-0000-4000-8000-000000000006', 4.18, 3.5, 3.69,
    3.66, 3.91, 3.67, 4.22,
    4.04, '{"Fintech","Distributed Systems","Cloud Native"}'::text[], '{}'::text[], 'Priya Patel is a Senior Full Stack Engineer within Software Engineering with exceptional competence in Domain Modeling, Clean Code, API Design.',
    1, '{"Domain Modeling","Clean Code","API Design"}'::text[], '{"Prefers Deep Work Over Frequent Context Switching"}'::text[], '{"Senior Full Stack Engineer","Tech Lead"}'::text[],
    '{"Executive Communication"}'::text[], 'Staff Engineer / Tech Lead', 0.91, 0.96,
    0.92, 0.42, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-000000000007', '10000000-0000-4000-8000-000000000007', 3.94, 3.7, 4.57,
    4.05, 4.4, 4.05, 4.87,
    4.59, '{"Fintech","Distributed Systems","Cloud Native"}'::text[], '{}'::text[], 'Alex Chen is a Senior Mobile Engineer within Software Engineering with exceptional competence in Domain Modeling, Clean Code, API Design.',
    1, '{"Domain Modeling","Clean Code","API Design"}'::text[], '{"Prefers Deep Work Over Frequent Context Switching"}'::text[], '{"Senior Mobile Engineer","Tech Lead"}'::text[],
    '{"Executive Communication"}'::text[], 'Staff Engineer / Tech Lead', 0.85, 0.93,
    0.87, 0.19, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-000000000008', '10000000-0000-4000-8000-000000000008', 3.29, 1.9, 4.45,
    4.46, 3.84, 3.68, 4.41,
    3.97, '{"Fintech","Distributed Systems","Cloud Native"}'::text[], '{}'::text[], 'Maya Lin is a Mid Backend Engineer within Software Engineering with exceptional competence in Fast Learner, Detail Oriented, Eager to Contribute.',
    1, '{"Fast Learner","Detail Oriented","Eager to Contribute"}'::text[], '{"Prefers Deep Work Over Frequent Context Switching"}'::text[], '{"Mid Backend Engineer","Tech Lead"}'::text[],
    '{"Executive Communication"}'::text[], 'Senior Engineer', 0.89, 0.91,
    0.94, 0.34, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-000000000009', '10000000-0000-4000-8000-000000000009', 3.56, 2.74, 3.78,
    4.27, 4.16, 3.63, 3.95,
    3.84, '{"Fintech","Distributed Systems","Cloud Native"}'::text[], '{}'::text[], 'Tariq Al-Mansoor is a Mid Frontend Engineer within Software Engineering with exceptional competence in Fast Learner, Detail Oriented, Eager to Contribute.',
    1, '{"Fast Learner","Detail Oriented","Eager to Contribute"}'::text[], '{"Prefers Deep Work Over Frequent Context Switching"}'::text[], '{"Mid Frontend Engineer","Tech Lead"}'::text[],
    '{"Executive Communication"}'::text[], 'Senior Engineer', 0.9, 0.92,
    0.9, 0.37, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-00000000000a', '10000000-0000-4000-8000-00000000000a', 3.45, 2.41, 4.46,
    4.09, 4, 4.47, 4.28,
    4.69, '{"Fintech","Distributed Systems","Cloud Native"}'::text[], '{}'::text[], 'Chloe Dubois is a Mid Full Stack Engineer within Software Engineering with exceptional competence in Fast Learner, Detail Oriented, Eager to Contribute.',
    1, '{"Fast Learner","Detail Oriented","Eager to Contribute"}'::text[], '{"Prefers Deep Work Over Frequent Context Switching"}'::text[], '{"Mid Full Stack Engineer","Tech Lead"}'::text[],
    '{"Executive Communication"}'::text[], 'Senior Engineer', 0.95, 0.9,
    0.88, 0.35, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-00000000000b', '10000000-0000-4000-8000-00000000000b', 2.98, 2.65, 4.2,
    4.42, 3.87, 4.5, 3.81,
    4.06, '{"Fintech","Distributed Systems","Cloud Native"}'::text[], '{"Cold Start - Sparse Task History"}'::text[], 'Lucas Silva is a Junior Backend Engineer within Software Engineering with exceptional competence in Fast Learner, Detail Oriented, Eager to Contribute.',
    1, '{"Fast Learner","Detail Oriented","Eager to Contribute"}'::text[], '{"Limited Experience with Production Incidents","Needs Supervision on DB Tuning"}'::text[], '{"Junior Backend Engineer","Tech Lead"}'::text[],
    '{"Advanced Microservices Patterns","Production Observability"}'::text[], 'Senior Engineer', 0.94, 0.88,
    0.82, 0.2, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-00000000000c', '10000000-0000-4000-8000-00000000000c', 2.78, 2.73, 3.75,
    3.54, 4.4, 4.65, 4.77,
    4.24, '{"Fintech","Distributed Systems","Cloud Native"}'::text[], '{}'::text[], 'Emily Watson is a Junior Frontend Engineer within Software Engineering with exceptional competence in Fast Learner, Detail Oriented, Eager to Contribute.',
    1, '{"Fast Learner","Detail Oriented","Eager to Contribute"}'::text[], '{"Limited Experience with Production Incidents","Needs Supervision on DB Tuning"}'::text[], '{"Junior Frontend Engineer","Tech Lead"}'::text[],
    '{"Advanced Microservices Patterns","Production Observability"}'::text[], 'Senior Engineer', 0.9, 0.89,
    0.88, 0.6, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-00000000000d', '10000000-0000-4000-8000-00000000000d', 3.77, 2.04, 4.52,
    3.8, 4.35, 4.25, 4.62,
    3.85, '{"Fintech","Distributed Systems","Cloud Native"}'::text[], '{}'::text[], 'Mateo Rossi is a Systems & Performance Specialist within Software Engineering with exceptional competence in Fast Learner, Detail Oriented, Eager to Contribute.',
    1, '{"Fast Learner","Detail Oriented","Eager to Contribute"}'::text[], '{"Prefers Deep Work Over Frequent Context Switching"}'::text[], '{"Systems & Performance Specialist","Tech Lead"}'::text[],
    '{"Executive Communication"}'::text[], 'Senior Engineer', 0.92, 0.95,
    0.86, 0.18, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-00000000000e', '10000000-0000-4000-8000-00000000000e', 3.97, 3.49, 3.59,
    3.69, 4.17, 4.14, 4.13,
    4.36, '{"Fintech","Distributed Systems","Cloud Native"}'::text[], '{}'::text[], 'Aisha Bello is a Senior Backend Engineer within Software Engineering with exceptional competence in Domain Modeling, Clean Code, API Design.',
    1, '{"Domain Modeling","Clean Code","API Design"}'::text[], '{"Prefers Deep Work Over Frequent Context Switching"}'::text[], '{"Senior Backend Engineer","Tech Lead"}'::text[],
    '{"Executive Communication"}'::text[], 'Staff Engineer / Tech Lead', 0.91, 0.94,
    0.86, 0.27, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-00000000000f', '10000000-0000-4000-8000-00000000000f', 4.38, 3.87, 3.75,
    4.37, 3.58, 3.63, 4.82,
    3.68, '{"Fintech","Distributed Systems","Cloud Native"}'::text[], '{}'::text[], 'Kenji Sato is a Senior Mobile Engineer within Software Engineering with exceptional competence in Domain Modeling, Clean Code, API Design.',
    1, '{"Domain Modeling","Clean Code","API Design"}'::text[], '{"Prefers Deep Work Over Frequent Context Switching"}'::text[], '{"Senior Mobile Engineer","Tech Lead"}'::text[],
    '{"Executive Communication"}'::text[], 'Staff Engineer / Tech Lead', 0.86, 0.93,
    0.93, 0.55, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-000000000010', '10000000-0000-4000-8000-000000000010', 3.27, 2.22, 4.15,
    3.62, 4.62, 4.39, 3.88,
    4.65, '{"Fintech","Distributed Systems","Cloud Native"}'::text[], '{}'::text[], 'Sofia Gomez is a Mid Full Stack Engineer within Software Engineering with exceptional competence in Fast Learner, Detail Oriented, Eager to Contribute.',
    1, '{"Fast Learner","Detail Oriented","Eager to Contribute"}'::text[], '{"Prefers Deep Work Over Frequent Context Switching"}'::text[], '{"Mid Full Stack Engineer","Tech Lead"}'::text[],
    '{"Executive Communication"}'::text[], 'Senior Engineer', 0.96, 0.92,
    0.92, 1, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-000000000011', '10000000-0000-4000-8000-000000000011', 3.62, 2.16, 4.52,
    4.24, 3.75, 4.38, 3.83,
    3.63, '{"Fintech","Distributed Systems","Cloud Native"}'::text[], '{}'::text[], 'David Kim is a Mid Backend Engineer within Software Engineering with exceptional competence in Fast Learner, Detail Oriented, Eager to Contribute.',
    1, '{"Fast Learner","Detail Oriented","Eager to Contribute"}'::text[], '{"Prefers Deep Work Over Frequent Context Switching"}'::text[], '{"Mid Backend Engineer","Tech Lead"}'::text[],
    '{"Executive Communication"}'::text[], 'Senior Engineer', 0.97, 0.93,
    0.85, 0.45, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-000000000012', '10000000-0000-4000-8000-000000000012', 2.71, 2.56, 3.8,
    3.76, 4.14, 4.76, 4.36,
    3.77, '{"Fintech","Distributed Systems","Cloud Native"}'::text[], '{}'::text[], 'Rachel Green is a Junior Full Stack Engineer within Software Engineering with exceptional competence in Fast Learner, Detail Oriented, Eager to Contribute.',
    1, '{"Fast Learner","Detail Oriented","Eager to Contribute"}'::text[], '{"Limited Experience with Production Incidents","Needs Supervision on DB Tuning"}'::text[], '{"Junior Full Stack Engineer","Tech Lead"}'::text[],
    '{"Advanced Microservices Patterns","Production Observability"}'::text[], 'Senior Engineer', 0.98, 0.87,
    0.95, 0.6, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-000000000013', '10000000-0000-4000-8000-000000000013', 4.67, 4.42, 4.75,
    4.65, 4.15, 3.97, 4.65,
    4.62, '{"User Experience","Design Systems","Fintech"}'::text[], '{}'::text[], 'Jordan Taylor is a Lead Product Manager within Product & Design with exceptional competence in System Architecture, Technical Mentorship, High Concurrency.',
    1, '{"System Architecture","Technical Mentorship","High Concurrency"}'::text[], '{"Occasional Reluctance to Delegate Critical Path Tasks"}'::text[], '{"Lead Product Manager","Engineering Manager"}'::text[],
    '{"Executive Communication"}'::text[], 'Distinguished Engineer / Director', 0.88, 0.97,
    0.93, 0.19, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-000000000014', '10000000-0000-4000-8000-000000000014', 4.34, 3.93, 4.69,
    3.8, 4.12, 3.6, 4.11,
    4.11, '{"User Experience","Design Systems","Fintech"}'::text[], '{}'::text[], 'Hannah Abbott is a Senior Technical PM (FinTech) within Product & Design with exceptional competence in Domain Modeling, Clean Code, API Design.',
    1, '{"Domain Modeling","Clean Code","API Design"}'::text[], '{"Prefers Deep Work Over Frequent Context Switching"}'::text[], '{"Senior Technical PM (FinTech)","Tech Lead"}'::text[],
    '{"Executive Communication"}'::text[], 'Staff Engineer / Tech Lead', 0.87, 0.96,
    0.93, 0.37, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-000000000015', '10000000-0000-4000-8000-000000000015', 4.56, 4.87, 3.9,
    4.54, 4.47, 4.04, 4.44,
    4.41, '{"User Experience","Design Systems","Fintech"}'::text[], '{}'::text[], 'Gabriel Santos is a Principal Design System Architect within Product & Design with exceptional competence in System Architecture, Technical Mentorship, High Concurrency.',
    1, '{"System Architecture","Technical Mentorship","High Concurrency"}'::text[], '{"Occasional Reluctance to Delegate Critical Path Tasks"}'::text[], '{"Principal Design System Architect","Engineering Manager"}'::text[],
    '{"Executive Communication"}'::text[], 'Distinguished Engineer / Director', 0.92, 0.98,
    0.91, 0.54, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-000000000016', '10000000-0000-4000-8000-000000000016', 4.23, 3.44, 4.04,
    3.76, 4.49, 3.75, 4.2,
    3.92, '{"User Experience","Design Systems","Fintech"}'::text[], '{}'::text[], 'Zoe Kravitz is a Senior UX Researcher & Designer within Product & Design with exceptional competence in Domain Modeling, Clean Code, API Design.',
    1, '{"Domain Modeling","Clean Code","API Design"}'::text[], '{"Prefers Deep Work Over Frequent Context Switching"}'::text[], '{"Senior UX Researcher & Designer","Tech Lead"}'::text[],
    '{"Executive Communication"}'::text[], 'Staff Engineer / Tech Lead', 0.86, 0.94,
    0.88, 0.27, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-000000000017', '10000000-0000-4000-8000-000000000017', 4.51, 4.63, 3.57,
    4.58, 4.16, 4.08, 4.82,
    3.75, '{"User Experience","Design Systems","Fintech"}'::text[], '{}'::text[], 'Oliver Wright is a Technical Documentation Lead within Product & Design with exceptional competence in System Architecture, Technical Mentorship, High Concurrency.',
    1, '{"System Architecture","Technical Mentorship","High Concurrency"}'::text[], '{"Occasional Reluctance to Delegate Critical Path Tasks"}'::text[], '{"Technical Documentation Lead","Engineering Manager"}'::text[],
    '{"Executive Communication"}'::text[], 'Distinguished Engineer / Director', 0.92, 0.95,
    0.87, 0.47, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-000000000018', '10000000-0000-4000-8000-000000000018', 3.66, 2.68, 3.69,
    3.59, 4.4, 4.35, 4,
    3.87, '{"User Experience","Design Systems","Fintech"}'::text[], '{}'::text[], 'Nora Helmer is a Associate Product Manager within Product & Design with exceptional competence in Fast Learner, Detail Oriented, Eager to Contribute.',
    1, '{"Fast Learner","Detail Oriented","Eager to Contribute"}'::text[], '{"Prefers Deep Work Over Frequent Context Switching"}'::text[], '{"Associate Product Manager","Tech Lead"}'::text[],
    '{"Executive Communication"}'::text[], 'Senior Engineer', 0.95, 0.9,
    0.81, 0.41, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-000000000019', '10000000-0000-4000-8000-000000000019', 4.81, 4.77, 3.57,
    4.43, 4.51, 4.17, 4.63,
    4.48, '{"Infrastructure","Security","Observability"}'::text[], '{"Over-allocated >100%","Critical Path Dependency"}'::text[], 'Viktor Meyer is a Principal Cloud Architect within Cloud & DevOps with exceptional competence in System Architecture, Technical Mentorship, High Concurrency.',
    1, '{"System Architecture","Technical Mentorship","High Concurrency"}'::text[], '{"Occasional Reluctance to Delegate Critical Path Tasks"}'::text[], '{"Principal Cloud Architect","Engineering Manager"}'::text[],
    '{"Executive Communication"}'::text[], 'Distinguished Engineer / Director', 0.88, 0.97,
    0.83, 0, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-00000000001a', '10000000-0000-4000-8000-00000000001a', 4.7, 4.7, 3.64,
    4.54, 3.52, 4.15, 4.27,
    4.17, '{"Infrastructure","Security","Observability"}'::text[], '{}'::text[], 'Fatima Zahra is a Staff Site Reliability Engineer within Cloud & DevOps with exceptional competence in System Architecture, Technical Mentorship, High Concurrency.',
    1, '{"System Architecture","Technical Mentorship","High Concurrency"}'::text[], '{"Occasional Reluctance to Delegate Critical Path Tasks"}'::text[], '{"Staff Site Reliability Engineer","Engineering Manager"}'::text[],
    '{"Executive Communication"}'::text[], 'Distinguished Engineer / Director', 0.92, 0.98,
    0.9, 0.3, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-00000000001b', '10000000-0000-4000-8000-00000000001b', 4.16, 3.58, 4.39,
    3.81, 3.56, 4.07, 4.64,
    3.94, '{"Infrastructure","Security","Observability"}'::text[], '{}'::text[], 'Christian Bale is a Senior Cloud Security & IAM Engineer within Cloud & DevOps with exceptional competence in Domain Modeling, Clean Code, API Design.',
    1, '{"Domain Modeling","Clean Code","API Design"}'::text[], '{"Prefers Deep Work Over Frequent Context Switching"}'::text[], '{"Senior Cloud Security & IAM Engineer","Tech Lead"}'::text[],
    '{"Executive Communication"}'::text[], 'Staff Engineer / Tech Lead', 0.93, 0.96,
    0.89, 0.58, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-00000000001c', '10000000-0000-4000-8000-00000000001c', 3.95, 3.95, 3.73,
    4.01, 3.83, 4.29, 4.05,
    3.8, '{"Infrastructure","Security","Observability"}'::text[], '{}'::text[], 'Ananya Roy is a Senior Platform Engineer within Cloud & DevOps with exceptional competence in Domain Modeling, Clean Code, API Design.',
    1, '{"Domain Modeling","Clean Code","API Design"}'::text[], '{"Prefers Deep Work Over Frequent Context Switching"}'::text[], '{"Senior Platform Engineer","Tech Lead"}'::text[],
    '{"Executive Communication"}'::text[], 'Staff Engineer / Tech Lead', 0.93, 0.94,
    0.81, 0.35, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-00000000001d', '10000000-0000-4000-8000-00000000001d', 3.21, 2.14, 3.77,
    4.27, 3.98, 4.5, 4.1,
    4.57, '{"Infrastructure","Security","Observability"}'::text[], '{}'::text[], 'Sean Murphy is a Mid Infrastructure Engineer within Cloud & DevOps with exceptional competence in Fast Learner, Detail Oriented, Eager to Contribute.',
    1, '{"Fast Learner","Detail Oriented","Eager to Contribute"}'::text[], '{"Prefers Deep Work Over Frequent Context Switching"}'::text[], '{"Mid Infrastructure Engineer","Tech Lead"}'::text[],
    '{"Executive Communication"}'::text[], 'Senior Engineer', 0.97, 0.91,
    0.9, 0.15, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-00000000001e', '10000000-0000-4000-8000-00000000001e', 3.75, 1.69, 3.7,
    4.43, 4.62, 3.66, 4.02,
    3.67, '{"Infrastructure","Security","Observability"}'::text[], '{}'::text[], 'Carlos Vega is a Cloud Engineering Intern within Cloud & DevOps with exceptional competence in Fast Learner, Detail Oriented, Eager to Contribute.',
    1, '{"Fast Learner","Detail Oriented","Eager to Contribute"}'::text[], '{"Prefers Deep Work Over Frequent Context Switching"}'::text[], '{"Cloud Engineering Intern","Tech Lead"}'::text[],
    '{"Executive Communication"}'::text[], 'Senior Engineer', 0.87, 0.86,
    0.81, 0.28, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-00000000001f', '10000000-0000-4000-8000-00000000001f', 4.65, 4.31, 3.51,
    4.83, 3.89, 3.82, 4.17,
    3.54, '{"Machine Learning","Big Data","Stream Processing"}'::text[], '{}'::text[], 'Dr. Aris Thorne is a Staff ML Research Scientist within Data & AI with exceptional competence in System Architecture, Technical Mentorship, High Concurrency.',
    1, '{"System Architecture","Technical Mentorship","High Concurrency"}'::text[], '{"Occasional Reluctance to Delegate Critical Path Tasks"}'::text[], '{"Staff ML Research Scientist","Engineering Manager"}'::text[],
    '{"Executive Communication"}'::text[], 'Distinguished Engineer / Director', 0.87, 0.98,
    0.92, 0.28, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-000000000020', '10000000-0000-4000-8000-000000000020', 4.16, 3.36, 3.74,
    3.5, 3.81, 4.32, 3.92,
    4.14, '{"Machine Learning","Big Data","Stream Processing"}'::text[], '{}'::text[], 'Leila Mahmoud is a Senior Data Platform Engineer within Data & AI with exceptional competence in Domain Modeling, Clean Code, API Design.',
    1, '{"Domain Modeling","Clean Code","API Design"}'::text[], '{"Prefers Deep Work Over Frequent Context Switching"}'::text[], '{"Senior Data Platform Engineer","Tech Lead"}'::text[],
    '{"Executive Communication"}'::text[], 'Staff Engineer / Tech Lead', 0.88, 0.96,
    0.82, 0.47, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-000000000021', '10000000-0000-4000-8000-000000000021', 4.09, 3.55, 4.54,
    3.56, 4.2, 4.11, 4.08,
    3.73, '{"Machine Learning","Big Data","Stream Processing"}'::text[], '{}'::text[], 'Ethan Hunt is a Senior MLOps & Serving Engineer within Data & AI with exceptional competence in Domain Modeling, Clean Code, API Design.',
    1, '{"Domain Modeling","Clean Code","API Design"}'::text[], '{"Prefers Deep Work Over Frequent Context Switching"}'::text[], '{"Senior MLOps & Serving Engineer","Tech Lead"}'::text[],
    '{"Executive Communication"}'::text[], 'Staff Engineer / Tech Lead', 0.89, 0.94,
    0.81, 0.17, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-000000000022', '10000000-0000-4000-8000-000000000022', 4.24, 3.88, 4.59,
    3.97, 4.41, 4.04, 4.23,
    4.03, '{"Machine Learning","Big Data","Stream Processing"}'::text[], '{}'::text[], 'Nina Simone is a Senior Data Scientist within Data & AI with exceptional competence in Domain Modeling, Clean Code, API Design.',
    1, '{"Domain Modeling","Clean Code","API Design"}'::text[], '{"Prefers Deep Work Over Frequent Context Switching"}'::text[], '{"Senior Data Scientist","Tech Lead"}'::text[],
    '{"Executive Communication"}'::text[], 'Staff Engineer / Tech Lead', 0.87, 0.93,
    0.84, 0.27, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-000000000023', '10000000-0000-4000-8000-000000000023', 3.41, 2.34, 4.41,
    3.93, 3.51, 4.33, 4.22,
    4.22, '{"Machine Learning","Big Data","Stream Processing"}'::text[], '{}'::text[], 'Kevin Bacon is a Mid Data Engineer within Data & AI with exceptional competence in Fast Learner, Detail Oriented, Eager to Contribute.',
    1, '{"Fast Learner","Detail Oriented","Eager to Contribute"}'::text[], '{"Prefers Deep Work Over Frequent Context Switching"}'::text[], '{"Mid Data Engineer","Tech Lead"}'::text[],
    '{"Executive Communication"}'::text[], 'Senior Engineer', 0.93, 0.91,
    0.92, 0.31, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-000000000024', '10000000-0000-4000-8000-000000000024', 2.59, 2.63, 4.43,
    4.26, 4.42, 4.6, 4.5,
    3.93, '{"Machine Learning","Big Data","Stream Processing"}'::text[], '{}'::text[], 'Mira Nair is a Junior BI Analyst within Data & AI with exceptional competence in Fast Learner, Detail Oriented, Eager to Contribute.',
    1, '{"Fast Learner","Detail Oriented","Eager to Contribute"}'::text[], '{"Limited Experience with Production Incidents","Needs Supervision on DB Tuning"}'::text[], '{"Junior BI Analyst","Tech Lead"}'::text[],
    '{"Advanced Microservices Patterns","Production Observability"}'::text[], 'Senior Engineer', 0.89, 0.89,
    0.83, 0.6, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-000000000025', '10000000-0000-4000-8000-000000000025', 4.81, 4.47, 4.72,
    4.52, 3.51, 3.81, 4.81,
    4.62, '{"Test Automation","Performance Testing","CI/CD"}'::text[], '{}'::text[], 'Travis Scott is a Staff SDET & Automation Architect within QA & Testing with exceptional competence in System Architecture, Technical Mentorship, High Concurrency.',
    1, '{"System Architecture","Technical Mentorship","High Concurrency"}'::text[], '{"Occasional Reluctance to Delegate Critical Path Tasks"}'::text[], '{"Staff SDET & Automation Architect","Engineering Manager"}'::text[],
    '{"Executive Communication"}'::text[], 'Distinguished Engineer / Director', 0.93, 0.97,
    0.9, 0.54, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-000000000026', '10000000-0000-4000-8000-000000000026', 4.14, 3.99, 4.02,
    3.55, 4.6, 4.12, 3.91,
    4.33, '{"Test Automation","Performance Testing","CI/CD"}'::text[], '{}'::text[], 'Megan Fox is a Senior QA Automation Engineer within QA & Testing with exceptional competence in Domain Modeling, Clean Code, API Design.',
    1, '{"Domain Modeling","Clean Code","API Design"}'::text[], '{"Prefers Deep Work Over Frequent Context Switching"}'::text[], '{"Senior QA Automation Engineer","Tech Lead"}'::text[],
    '{"Executive Communication"}'::text[], 'Staff Engineer / Tech Lead', 0.93, 0.94,
    0.82, 0.3, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-000000000027', '10000000-0000-4000-8000-000000000027', 3.31, 2.07, 4.79,
    3.94, 4.04, 4.44, 3.98,
    4.17, '{"Test Automation","Performance Testing","CI/CD"}'::text[], '{}'::text[], 'Samuel Jackson is a Mid QA Engineer within QA & Testing with exceptional competence in Fast Learner, Detail Oriented, Eager to Contribute.',
    1, '{"Fast Learner","Detail Oriented","Eager to Contribute"}'::text[], '{"Prefers Deep Work Over Frequent Context Switching"}'::text[], '{"Mid QA Engineer","Tech Lead"}'::text[],
    '{"Executive Communication"}'::text[], 'Senior Engineer', 0.9, 0.92,
    0.83, 0.15, 'AI Engine', 'v2.1-workforce'
  ),
  (
    '70000000-0000-4000-8000-000000000028', '10000000-0000-4000-8000-000000000028', 2.89, 1.55, 4.38,
    4.36, 4.19, 4.31, 4.22,
    4.57, '{"Test Automation","Performance Testing","CI/CD"}'::text[], '{}'::text[], 'Jessica Alba is a Junior Test Automation Engineer within QA & Testing with exceptional competence in Fast Learner, Detail Oriented, Eager to Contribute.',
    1, '{"Fast Learner","Detail Oriented","Eager to Contribute"}'::text[], '{"Limited Experience with Production Incidents","Needs Supervision on DB Tuning"}'::text[], '{"Junior Test Automation Engineer","Tech Lead"}'::text[],
    '{"Advanced Microservices Patterns","Production Observability"}'::text[], 'Senior Engineer', 0.89, 0.88,
    0.8, 0.32, 'AI Engine', 'v2.1-workforce'
  )
ON CONFLICT (id) DO UPDATE SET
  technical_strength = EXCLUDED.technical_strength,
  leadership_score = EXCLUDED.leadership_score,
  communication_score = EXCLUDED.communication_score,
  ownership_score = EXCLUDED.ownership_score,
  adaptability_score = EXCLUDED.adaptability_score,
  learning_speed = EXCLUDED.learning_speed,
  collaboration_score = EXCLUDED.collaboration_score,
  documentation_score = EXCLUDED.documentation_score,
  preferred_domains = EXCLUDED.preferred_domains,
  risk_flags = EXCLUDED.risk_flags,
  profile_summary = EXCLUDED.profile_summary,
  strengths = EXCLUDED.strengths,
  weaknesses = EXCLUDED.weaknesses,
  recommended_roles = EXCLUDED.recommended_roles,
  training_recommendations = EXCLUDED.training_recommendations,
  career_path = EXCLUDED.career_path,
  consistency_score = EXCLUDED.consistency_score,
  reliability_score = EXCLUDED.reliability_score,
  workload_tolerance = EXCLUDED.workload_tolerance,
  availability_score = EXCLUDED.availability_score;

-- ----------------------------------------------------------------------------
-- 5. EMPLOYEE SKILLS MAPPINGS (167 records)
-- ----------------------------------------------------------------------------
INSERT INTO employee_skills (employee_id, skill_id, proficiency_level) VALUES
  ('10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-00000000001a', 5),
  ('10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000007', 4),
  ('10000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000009', 4),
  ('10000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-00000000001a', 5),
  ('10000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000007', 4),
  ('10000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000009', 4),
  ('10000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000005', 5),
  ('10000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000007', 5),
  ('10000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-00000000000c', 4),
  ('10000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-00000000001a', 5),
  ('10000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000001', 5),
  ('10000000-0000-4000-8000-000000000004', 'b4cc67f8-1eb1-4e9a-8980-f2a67584b3fc', 5),
  ('10000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-00000000000e', 4),
  ('10000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-00000000001c', 4),
  ('10000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000001', 4),
  ('10000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000003', 4),
  ('10000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-000000000006', 4),
  ('10000000-0000-4000-8000-000000000005', '20000000-0000-4000-8000-00000000000d', 3),
  ('10000000-0000-4000-8000-000000000006', '20000000-0000-4000-8000-000000000001', 4),
  ('10000000-0000-4000-8000-000000000006', '20000000-0000-4000-8000-000000000003', 4),
  ('10000000-0000-4000-8000-000000000006', '20000000-0000-4000-8000-000000000006', 4),
  ('10000000-0000-4000-8000-000000000006', '20000000-0000-4000-8000-00000000000d', 3),
  ('10000000-0000-4000-8000-000000000007', '20000000-0000-4000-8000-000000000013', 4),
  ('10000000-0000-4000-8000-000000000007', '20000000-0000-4000-8000-000000000014', 4),
  ('10000000-0000-4000-8000-000000000007', '20000000-0000-4000-8000-000000000001', 3),
  ('10000000-0000-4000-8000-000000000008', '20000000-0000-4000-8000-000000000001', 3),
  ('10000000-0000-4000-8000-000000000008', '20000000-0000-4000-8000-000000000003', 3),
  ('10000000-0000-4000-8000-000000000008', '20000000-0000-4000-8000-000000000006', 3),
  ('10000000-0000-4000-8000-000000000008', '20000000-0000-4000-8000-00000000000d', 2),
  ('10000000-0000-4000-8000-000000000008', '20000000-0000-4000-8000-000000000011', 3),
  ('10000000-0000-4000-8000-000000000008', '20000000-0000-4000-8000-000000000012', 3),
  ('10000000-0000-4000-8000-000000000009', '20000000-0000-4000-8000-000000000001', 3),
  ('10000000-0000-4000-8000-000000000009', 'b4cc67f8-1eb1-4e9a-8980-f2a67584b3fc', 3),
  ('10000000-0000-4000-8000-000000000009', '20000000-0000-4000-8000-00000000000e', 2),
  ('10000000-0000-4000-8000-000000000009', '20000000-0000-4000-8000-00000000001c', 2),
  ('10000000-0000-4000-8000-00000000000a', '20000000-0000-4000-8000-000000000001', 3),
  ('10000000-0000-4000-8000-00000000000a', '20000000-0000-4000-8000-000000000003', 3),
  ('10000000-0000-4000-8000-00000000000a', '20000000-0000-4000-8000-000000000006', 3),
  ('10000000-0000-4000-8000-00000000000a', '20000000-0000-4000-8000-00000000000d', 2),
  ('10000000-0000-4000-8000-00000000000b', '20000000-0000-4000-8000-000000000001', 3),
  ('10000000-0000-4000-8000-00000000000b', '20000000-0000-4000-8000-000000000003', 3),
  ('10000000-0000-4000-8000-00000000000b', '20000000-0000-4000-8000-000000000006', 3),
  ('10000000-0000-4000-8000-00000000000b', '20000000-0000-4000-8000-00000000000d', 2),
  ('10000000-0000-4000-8000-00000000000c', '20000000-0000-4000-8000-000000000001', 3),
  ('10000000-0000-4000-8000-00000000000c', 'b4cc67f8-1eb1-4e9a-8980-f2a67584b3fc', 3),
  ('10000000-0000-4000-8000-00000000000c', '20000000-0000-4000-8000-00000000000e', 2),
  ('10000000-0000-4000-8000-00000000000c', '20000000-0000-4000-8000-00000000001c', 2),
  ('10000000-0000-4000-8000-00000000000d', '20000000-0000-4000-8000-000000000005', 5),
  ('10000000-0000-4000-8000-00000000000d', '20000000-0000-4000-8000-000000000007', 5),
  ('10000000-0000-4000-8000-00000000000d', '20000000-0000-4000-8000-00000000000c', 4),
  ('10000000-0000-4000-8000-00000000000d', '20000000-0000-4000-8000-00000000001a', 5),
  ('10000000-0000-4000-8000-00000000000e', '20000000-0000-4000-8000-000000000001', 4),
  ('10000000-0000-4000-8000-00000000000e', '20000000-0000-4000-8000-000000000003', 4),
  ('10000000-0000-4000-8000-00000000000e', '20000000-0000-4000-8000-000000000006', 4),
  ('10000000-0000-4000-8000-00000000000e', '20000000-0000-4000-8000-00000000000d', 3),
  ('10000000-0000-4000-8000-00000000000f', '20000000-0000-4000-8000-000000000013', 4),
  ('10000000-0000-4000-8000-00000000000f', '20000000-0000-4000-8000-000000000014', 4),
  ('10000000-0000-4000-8000-00000000000f', '20000000-0000-4000-8000-000000000001', 3),
  ('10000000-0000-4000-8000-000000000010', '20000000-0000-4000-8000-000000000001', 3),
  ('10000000-0000-4000-8000-000000000010', '20000000-0000-4000-8000-000000000003', 3),
  ('10000000-0000-4000-8000-000000000010', '20000000-0000-4000-8000-000000000006', 3),
  ('10000000-0000-4000-8000-000000000010', '20000000-0000-4000-8000-00000000000d', 2),
  ('10000000-0000-4000-8000-000000000011', '20000000-0000-4000-8000-000000000001', 3),
  ('10000000-0000-4000-8000-000000000011', '20000000-0000-4000-8000-000000000003', 3),
  ('10000000-0000-4000-8000-000000000011', '20000000-0000-4000-8000-000000000006', 3),
  ('10000000-0000-4000-8000-000000000011', '20000000-0000-4000-8000-00000000000d', 2),
  ('10000000-0000-4000-8000-000000000011', '20000000-0000-4000-8000-000000000011', 3),
  ('10000000-0000-4000-8000-000000000011', '20000000-0000-4000-8000-000000000012', 3),
  ('10000000-0000-4000-8000-000000000012', '20000000-0000-4000-8000-000000000001', 3),
  ('10000000-0000-4000-8000-000000000012', '20000000-0000-4000-8000-000000000003', 3),
  ('10000000-0000-4000-8000-000000000012', '20000000-0000-4000-8000-000000000006', 3),
  ('10000000-0000-4000-8000-000000000012', '20000000-0000-4000-8000-00000000000d', 2),
  ('10000000-0000-4000-8000-000000000013', '20000000-0000-4000-8000-00000000001c', 5),
  ('10000000-0000-4000-8000-000000000013', '20000000-0000-4000-8000-000000000017', 4),
  ('10000000-0000-4000-8000-000000000013', '20000000-0000-4000-8000-00000000001a', 4),
  ('10000000-0000-4000-8000-000000000014', '20000000-0000-4000-8000-00000000001c', 4),
  ('10000000-0000-4000-8000-000000000014', '20000000-0000-4000-8000-000000000017', 4),
  ('10000000-0000-4000-8000-000000000014', '20000000-0000-4000-8000-00000000001a', 4),
  ('10000000-0000-4000-8000-000000000015', '20000000-0000-4000-8000-00000000001c', 5),
  ('10000000-0000-4000-8000-000000000016', '20000000-0000-4000-8000-00000000001c', 4),
  ('10000000-0000-4000-8000-000000000017', '20000000-0000-4000-8000-00000000001c', 5),
  ('10000000-0000-4000-8000-000000000017', '20000000-0000-4000-8000-000000000017', 4),
  ('10000000-0000-4000-8000-000000000017', '20000000-0000-4000-8000-00000000001a', 4),
  ('10000000-0000-4000-8000-000000000018', '20000000-0000-4000-8000-00000000001c', 3),
  ('10000000-0000-4000-8000-000000000019', '20000000-0000-4000-8000-000000000007', 5),
  ('10000000-0000-4000-8000-000000000019', '20000000-0000-4000-8000-000000000008', 5),
  ('10000000-0000-4000-8000-000000000019', '20000000-0000-4000-8000-000000000009', 5),
  ('10000000-0000-4000-8000-000000000019', '20000000-0000-4000-8000-00000000000a', 5),
  ('10000000-0000-4000-8000-000000000019', '20000000-0000-4000-8000-000000000015', 5),
  ('10000000-0000-4000-8000-000000000019', '20000000-0000-4000-8000-000000000016', 5),
  ('10000000-0000-4000-8000-00000000001a', '20000000-0000-4000-8000-000000000007', 5),
  ('10000000-0000-4000-8000-00000000001a', '20000000-0000-4000-8000-000000000008', 5),
  ('10000000-0000-4000-8000-00000000001a', '20000000-0000-4000-8000-000000000009', 5),
  ('10000000-0000-4000-8000-00000000001a', '20000000-0000-4000-8000-00000000000a', 5),
  ('10000000-0000-4000-8000-00000000001a', '20000000-0000-4000-8000-000000000015', 5),
  ('10000000-0000-4000-8000-00000000001a', '20000000-0000-4000-8000-000000000016', 5),
  ('10000000-0000-4000-8000-00000000001b', '20000000-0000-4000-8000-000000000007', 4),
  ('10000000-0000-4000-8000-00000000001b', '20000000-0000-4000-8000-000000000008', 4),
  ('10000000-0000-4000-8000-00000000001b', '20000000-0000-4000-8000-000000000009', 4),
  ('10000000-0000-4000-8000-00000000001b', '20000000-0000-4000-8000-00000000000a', 4),
  ('10000000-0000-4000-8000-00000000001b', '20000000-0000-4000-8000-000000000015', 4),
  ('10000000-0000-4000-8000-00000000001b', '20000000-0000-4000-8000-000000000016', 4),
  ('10000000-0000-4000-8000-00000000001b', '20000000-0000-4000-8000-00000000001b', 5),
  ('10000000-0000-4000-8000-00000000001c', '20000000-0000-4000-8000-000000000007', 4),
  ('10000000-0000-4000-8000-00000000001c', '20000000-0000-4000-8000-000000000008', 4),
  ('10000000-0000-4000-8000-00000000001c', '20000000-0000-4000-8000-000000000009', 4),
  ('10000000-0000-4000-8000-00000000001c', '20000000-0000-4000-8000-00000000000a', 4),
  ('10000000-0000-4000-8000-00000000001c', '20000000-0000-4000-8000-000000000015', 4),
  ('10000000-0000-4000-8000-00000000001c', '20000000-0000-4000-8000-000000000016', 4),
  ('10000000-0000-4000-8000-00000000001d', '20000000-0000-4000-8000-000000000007', 3),
  ('10000000-0000-4000-8000-00000000001d', '20000000-0000-4000-8000-000000000008', 3),
  ('10000000-0000-4000-8000-00000000001d', '20000000-0000-4000-8000-000000000009', 3),
  ('10000000-0000-4000-8000-00000000001d', '20000000-0000-4000-8000-00000000000a', 3),
  ('10000000-0000-4000-8000-00000000001d', '20000000-0000-4000-8000-000000000015', 3),
  ('10000000-0000-4000-8000-00000000001d', '20000000-0000-4000-8000-000000000016', 3),
  ('10000000-0000-4000-8000-00000000001e', '20000000-0000-4000-8000-000000000007', 3),
  ('10000000-0000-4000-8000-00000000001e', '20000000-0000-4000-8000-000000000008', 3),
  ('10000000-0000-4000-8000-00000000001e', '20000000-0000-4000-8000-000000000009', 3),
  ('10000000-0000-4000-8000-00000000001e', '20000000-0000-4000-8000-00000000000a', 3),
  ('10000000-0000-4000-8000-00000000001e', '20000000-0000-4000-8000-000000000015', 3),
  ('10000000-0000-4000-8000-00000000001e', '20000000-0000-4000-8000-000000000016', 3),
  ('10000000-0000-4000-8000-00000000001f', '45c21a7c-1697-48ba-bf34-d2bdab25d501', 5),
  ('10000000-0000-4000-8000-00000000001f', '20000000-0000-4000-8000-000000000006', 5),
  ('10000000-0000-4000-8000-00000000001f', '20000000-0000-4000-8000-000000000017', 5),
  ('10000000-0000-4000-8000-00000000001f', '20000000-0000-4000-8000-00000000000b', 5),
  ('10000000-0000-4000-8000-00000000001f', '20000000-0000-4000-8000-000000000010', 5),
  ('10000000-0000-4000-8000-000000000020', '45c21a7c-1697-48ba-bf34-d2bdab25d501', 4),
  ('10000000-0000-4000-8000-000000000020', '20000000-0000-4000-8000-000000000006', 4),
  ('10000000-0000-4000-8000-000000000020', '20000000-0000-4000-8000-000000000017', 4),
  ('10000000-0000-4000-8000-000000000020', '20000000-0000-4000-8000-00000000000c', 4),
  ('10000000-0000-4000-8000-000000000020', '20000000-0000-4000-8000-000000000018', 4),
  ('10000000-0000-4000-8000-000000000021', '45c21a7c-1697-48ba-bf34-d2bdab25d501', 4),
  ('10000000-0000-4000-8000-000000000021', '20000000-0000-4000-8000-000000000006', 4),
  ('10000000-0000-4000-8000-000000000021', '20000000-0000-4000-8000-000000000017', 4),
  ('10000000-0000-4000-8000-000000000021', '20000000-0000-4000-8000-00000000000b', 4),
  ('10000000-0000-4000-8000-000000000021', '20000000-0000-4000-8000-000000000010', 4),
  ('10000000-0000-4000-8000-000000000022', '45c21a7c-1697-48ba-bf34-d2bdab25d501', 4),
  ('10000000-0000-4000-8000-000000000022', '20000000-0000-4000-8000-000000000006', 4),
  ('10000000-0000-4000-8000-000000000022', '20000000-0000-4000-8000-000000000017', 4),
  ('10000000-0000-4000-8000-000000000022', '20000000-0000-4000-8000-00000000000b', 4),
  ('10000000-0000-4000-8000-000000000022', '20000000-0000-4000-8000-000000000010', 4),
  ('10000000-0000-4000-8000-000000000023', '45c21a7c-1697-48ba-bf34-d2bdab25d501', 3),
  ('10000000-0000-4000-8000-000000000023', '20000000-0000-4000-8000-000000000006', 3),
  ('10000000-0000-4000-8000-000000000023', '20000000-0000-4000-8000-000000000017', 3),
  ('10000000-0000-4000-8000-000000000023', '20000000-0000-4000-8000-00000000000c', 3),
  ('10000000-0000-4000-8000-000000000023', '20000000-0000-4000-8000-000000000018', 3),
  ('10000000-0000-4000-8000-000000000024', '45c21a7c-1697-48ba-bf34-d2bdab25d501', 3),
  ('10000000-0000-4000-8000-000000000024', '20000000-0000-4000-8000-000000000006', 3),
  ('10000000-0000-4000-8000-000000000024', '20000000-0000-4000-8000-000000000017', 3),
  ('10000000-0000-4000-8000-000000000024', '20000000-0000-4000-8000-00000000000c', 3),
  ('10000000-0000-4000-8000-000000000024', '20000000-0000-4000-8000-000000000018', 3),
  ('10000000-0000-4000-8000-000000000025', '20000000-0000-4000-8000-000000000019', 5),
  ('10000000-0000-4000-8000-000000000025', '20000000-0000-4000-8000-000000000001', 4),
  ('10000000-0000-4000-8000-000000000025', '45c21a7c-1697-48ba-bf34-d2bdab25d501', 4),
  ('10000000-0000-4000-8000-000000000025', '20000000-0000-4000-8000-000000000015', 5),
  ('10000000-0000-4000-8000-000000000026', '20000000-0000-4000-8000-000000000019', 4),
  ('10000000-0000-4000-8000-000000000026', '20000000-0000-4000-8000-000000000001', 3),
  ('10000000-0000-4000-8000-000000000026', '45c21a7c-1697-48ba-bf34-d2bdab25d501', 3),
  ('10000000-0000-4000-8000-000000000026', '20000000-0000-4000-8000-000000000015', 4),
  ('10000000-0000-4000-8000-000000000027', '20000000-0000-4000-8000-000000000019', 3),
  ('10000000-0000-4000-8000-000000000027', '20000000-0000-4000-8000-000000000001', 2),
  ('10000000-0000-4000-8000-000000000027', '45c21a7c-1697-48ba-bf34-d2bdab25d501', 2),
  ('10000000-0000-4000-8000-000000000027', '20000000-0000-4000-8000-000000000015', 3),
  ('10000000-0000-4000-8000-000000000028', '20000000-0000-4000-8000-000000000019', 3),
  ('10000000-0000-4000-8000-000000000028', '20000000-0000-4000-8000-000000000001', 2),
  ('10000000-0000-4000-8000-000000000028', '45c21a7c-1697-48ba-bf34-d2bdab25d501', 2),
  ('10000000-0000-4000-8000-000000000028', '20000000-0000-4000-8000-000000000015', 3)
ON CONFLICT (employee_id, skill_id) DO UPDATE SET
  proficiency_level = EXCLUDED.proficiency_level;

-- ----------------------------------------------------------------------------
-- 6. EMPLOYEE KNOWLEDGE VECTORS (40 records)
-- ----------------------------------------------------------------------------
INSERT INTO employee_knowledge (
  id, employee_id, projects_completed, average_quality, average_delay,
  attendance_score, workload_score, performance_score, reliability_score,
  skill_vector, feedback_summary, knowledge_version
) VALUES
  (
    '71000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 10, 4.66, 0.73,
    0.96, 42.75, 0.96, 0.99,
    '{"backend":0.3,"frontend":0.2,"devops":0.4,"data":0.3,"qa":0.3}'::jsonb, 'Elena Rostova consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002', 8, 4.3, 1.48,
    0.94, 41.04, 0.9, 0.97,
    '{"backend":0.3,"frontend":0.2,"devops":0.4,"data":0.3,"qa":0.3}'::jsonb, 'Marcus Vance consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000003', 11, 4.59, 1.15,
    0.98, 41.11, 0.96, 0.98,
    '{"backend":0.9,"frontend":0.2,"devops":0.4,"data":0.3,"qa":0.3}'::jsonb, 'Devansh Sharma consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000004', 9, 4.89, 0.33,
    0.94, 41.26, 0.9, 0.94,
    '{"backend":0.9,"frontend":0.95,"devops":0.4,"data":0.3,"qa":0.3}'::jsonb, 'Sarah Jenkins consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000005', 12, 4.48, 1.48,
    0.95, 42.35, 0.87, 0.95,
    '{"backend":0.9,"frontend":0.2,"devops":0.4,"data":0.3,"qa":0.3}'::jsonb, 'Liam O''Connor consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-000000000006', '10000000-0000-4000-8000-000000000006', 6, 4.51, 0.63,
    0.95, 43.05, 0.88, 0.96,
    '{"backend":0.9,"frontend":0.2,"devops":0.4,"data":0.3,"qa":0.3}'::jsonb, 'Priya Patel consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-000000000007', '10000000-0000-4000-8000-000000000007', 8, 4.27, 1.64,
    0.93, 37.98, 0.88, 0.93,
    '{"backend":0.9,"frontend":0.2,"devops":0.4,"data":0.3,"qa":0.3}'::jsonb, 'Alex Chen consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-000000000008', '10000000-0000-4000-8000-000000000008', 14, 4.22, 0.01,
    0.97, 39.06, 0.82, 0.91,
    '{"backend":0.9,"frontend":0.2,"devops":0.4,"data":0.3,"qa":0.3}'::jsonb, 'Maya Lin consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-000000000009', '10000000-0000-4000-8000-000000000009', 5, 4.17, 1.22,
    0.93, 39.32, 0.88, 0.92,
    '{"backend":0.9,"frontend":0.95,"devops":0.4,"data":0.3,"qa":0.3}'::jsonb, 'Tariq Al-Mansoor consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-00000000000a', '10000000-0000-4000-8000-00000000000a', 7, 4.82, 1.67,
    0.93, 37.6, 0.93, 0.9,
    '{"backend":0.9,"frontend":0.2,"devops":0.4,"data":0.3,"qa":0.3}'::jsonb, 'Chloe Dubois consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-00000000000b', '10000000-0000-4000-8000-00000000000b', 0, 0, 0,
    0.98, 43.44, 0.7, 0.88,
    '{"backend":0.9,"frontend":0.2,"devops":0.4,"data":0.3,"qa":0.3}'::jsonb, 'New onboarding employee with strong foundational qualifications.', 1
  ),
  (
    '71000000-0000-4000-8000-00000000000c', '10000000-0000-4000-8000-00000000000c', 2, 4.44, 0.77,
    0.96, 40.93, 0.96, 0.89,
    '{"backend":0.9,"frontend":0.95,"devops":0.4,"data":0.3,"qa":0.3}'::jsonb, 'Emily Watson consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-00000000000d', '10000000-0000-4000-8000-00000000000d', 10, 4.11, 0.74,
    0.94, 42.87, 0.85, 0.95,
    '{"backend":0.9,"frontend":0.2,"devops":0.4,"data":0.3,"qa":0.3}'::jsonb, 'Mateo Rossi consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-00000000000e', '10000000-0000-4000-8000-00000000000e', 10, 4.16, 0.63,
    0.96, 43.12, 0.86, 0.94,
    '{"backend":0.9,"frontend":0.2,"devops":0.4,"data":0.3,"qa":0.3}'::jsonb, 'Aisha Bello consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-00000000000f', '10000000-0000-4000-8000-00000000000f', 14, 4.44, 1.11,
    0.98, 38.07, 0.91, 0.93,
    '{"backend":0.9,"frontend":0.2,"devops":0.4,"data":0.3,"qa":0.3}'::jsonb, 'Kenji Sato consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-000000000010', '10000000-0000-4000-8000-000000000010', 14, 4.29, 1.03,
    0.98, 40.14, 0.95, 0.92,
    '{"backend":0.9,"frontend":0.2,"devops":0.4,"data":0.3,"qa":0.3}'::jsonb, 'Sofia Gomez consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-000000000011', '10000000-0000-4000-8000-000000000011', 8, 4.87, 0.12,
    0.96, 36.87, 0.88, 0.93,
    '{"backend":0.9,"frontend":0.2,"devops":0.4,"data":0.3,"qa":0.3}'::jsonb, 'David Kim consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-000000000012', '10000000-0000-4000-8000-000000000012', 1, 4.3, 1.05,
    0.94, 39.5, 0.86, 0.87,
    '{"backend":0.9,"frontend":0.2,"devops":0.4,"data":0.3,"qa":0.3}'::jsonb, 'Rachel Green consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-000000000013', '10000000-0000-4000-8000-000000000013', 13, 4.33, 1.59,
    0.99, 43.12, 0.86, 0.97,
    '{"backend":0.3,"frontend":0.2,"devops":0.4,"data":0.3,"qa":0.3}'::jsonb, 'Jordan Taylor consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-000000000014', '10000000-0000-4000-8000-000000000014', 9, 4.26, 1.66,
    0.99, 37.11, 0.87, 0.96,
    '{"backend":0.3,"frontend":0.2,"devops":0.4,"data":0.3,"qa":0.3}'::jsonb, 'Hannah Abbott consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-000000000015', '10000000-0000-4000-8000-000000000015', 12, 4.49, 0.35,
    0.96, 39.4, 0.86, 0.98,
    '{"backend":0.3,"frontend":0.95,"devops":0.4,"data":0.3,"qa":0.3}'::jsonb, 'Gabriel Santos consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-000000000016', '10000000-0000-4000-8000-000000000016', 12, 4.15, 0.01,
    0.96, 43.7, 0.89, 0.94,
    '{"backend":0.3,"frontend":0.95,"devops":0.4,"data":0.3,"qa":0.3}'::jsonb, 'Zoe Kravitz consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-000000000017', '10000000-0000-4000-8000-000000000017', 14, 4.11, 0.09,
    0.96, 43.51, 0.92, 0.95,
    '{"backend":0.3,"frontend":0.2,"devops":0.4,"data":0.3,"qa":0.3}'::jsonb, 'Oliver Wright consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-000000000018', '10000000-0000-4000-8000-000000000018', 6, 4.21, 0.05,
    0.96, 37.16, 0.84, 0.9,
    '{"backend":0.3,"frontend":0.2,"devops":0.4,"data":0.3,"qa":0.3}'::jsonb, 'Nora Helmer consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-000000000019', '10000000-0000-4000-8000-000000000019', 12, 4.53, 0.8,
    0.96, 42.69, 0.87, 0.97,
    '{"backend":0.3,"frontend":0.2,"devops":0.95,"data":0.3,"qa":0.3}'::jsonb, 'Viktor Meyer consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-00000000001a', '10000000-0000-4000-8000-00000000001a', 9, 4.36, 0.53,
    0.96, 38.81, 0.9, 0.98,
    '{"backend":0.3,"frontend":0.2,"devops":0.95,"data":0.3,"qa":0.3}'::jsonb, 'Fatima Zahra consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-00000000001b', '10000000-0000-4000-8000-00000000001b', 14, 4.81, 1.59,
    0.94, 36.37, 0.85, 0.96,
    '{"backend":0.3,"frontend":0.2,"devops":0.95,"data":0.3,"qa":0.3}'::jsonb, 'Christian Bale consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-00000000001c', '10000000-0000-4000-8000-00000000001c', 14, 4.6, 0.98,
    0.93, 41.35, 0.89, 0.94,
    '{"backend":0.3,"frontend":0.2,"devops":0.95,"data":0.3,"qa":0.3}'::jsonb, 'Ananya Roy consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-00000000001d', '10000000-0000-4000-8000-00000000001d', 10, 4.14, 0.51,
    0.95, 36.29, 0.95, 0.91,
    '{"backend":0.3,"frontend":0.2,"devops":0.95,"data":0.3,"qa":0.3}'::jsonb, 'Sean Murphy consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-00000000001e', '10000000-0000-4000-8000-00000000001e', 8, 4.78, 0.28,
    0.94, 38.44, 0.87, 0.86,
    '{"backend":0.3,"frontend":0.2,"devops":0.95,"data":0.3,"qa":0.3}'::jsonb, 'Carlos Vega consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-00000000001f', '10000000-0000-4000-8000-00000000001f', 12, 4.8, 0.14,
    0.97, 43.01, 0.87, 0.98,
    '{"backend":0.3,"frontend":0.2,"devops":0.4,"data":0.95,"qa":0.3}'::jsonb, 'Dr. Aris Thorne consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-000000000020', '10000000-0000-4000-8000-000000000020', 6, 4.26, 0.64,
    0.95, 39.75, 0.88, 0.96,
    '{"backend":0.3,"frontend":0.2,"devops":0.4,"data":0.95,"qa":0.3}'::jsonb, 'Leila Mahmoud consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-000000000021', '10000000-0000-4000-8000-000000000021', 13, 4.81, 1.64,
    0.96, 43.45, 0.86, 0.94,
    '{"backend":0.3,"frontend":0.2,"devops":0.4,"data":0.95,"qa":0.3}'::jsonb, 'Ethan Hunt consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-000000000022', '10000000-0000-4000-8000-000000000022', 8, 4.64, 1.41,
    0.98, 37.31, 0.86, 0.93,
    '{"backend":0.3,"frontend":0.2,"devops":0.4,"data":0.95,"qa":0.3}'::jsonb, 'Nina Simone consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-000000000023', '10000000-0000-4000-8000-000000000023', 6, 4.45, 0.51,
    0.98, 36.59, 0.96, 0.91,
    '{"backend":0.3,"frontend":0.2,"devops":0.4,"data":0.95,"qa":0.3}'::jsonb, 'Kevin Bacon consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-000000000024', '10000000-0000-4000-8000-000000000024', 2, 4.13, 1.77,
    0.95, 43.18, 0.93, 0.89,
    '{"backend":0.3,"frontend":0.2,"devops":0.4,"data":0.95,"qa":0.3}'::jsonb, 'Mira Nair consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-000000000025', '10000000-0000-4000-8000-000000000025', 13, 4.86, 1.68,
    0.93, 39.99, 0.97, 0.97,
    '{"backend":0.3,"frontend":0.2,"devops":0.4,"data":0.3,"qa":0.95}'::jsonb, 'Travis Scott consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-000000000026', '10000000-0000-4000-8000-000000000026', 5, 4.79, 1.32,
    0.98, 40.15, 0.93, 0.94,
    '{"backend":0.3,"frontend":0.2,"devops":0.4,"data":0.3,"qa":0.95}'::jsonb, 'Megan Fox consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-000000000027', '10000000-0000-4000-8000-000000000027', 6, 4.34, 1.71,
    0.94, 40.18, 0.94, 0.92,
    '{"backend":0.3,"frontend":0.2,"devops":0.4,"data":0.3,"qa":0.95}'::jsonb, 'Samuel Jackson consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  ),
  (
    '71000000-0000-4000-8000-000000000028', '10000000-0000-4000-8000-000000000028', 3, 4.29, 0.56,
    0.95, 41.43, 0.83, 0.88,
    '{"backend":0.3,"frontend":0.2,"devops":0.4,"data":0.3,"qa":0.95}'::jsonb, 'Jessica Alba consistently delivers high-velocity, high-quality deliverables across sprints.', 1
  )
ON CONFLICT (id) DO UPDATE SET
  projects_completed = EXCLUDED.projects_completed,
  average_quality = EXCLUDED.average_quality,
  average_delay = EXCLUDED.average_delay,
  attendance_score = EXCLUDED.attendance_score,
  workload_score = EXCLUDED.workload_score,
  performance_score = EXCLUDED.performance_score,
  reliability_score = EXCLUDED.reliability_score,
  skill_vector = EXCLUDED.skill_vector,
  feedback_summary = EXCLUDED.feedback_summary;

-- ----------------------------------------------------------------------------
-- 7. ML INFERENCE PREDICTIONS (40 records)
-- ----------------------------------------------------------------------------
INSERT INTO ml_predictions (
  id, employee_id, predicted_performance, predicted_completion_rate,
  burnout_probability, delivery_confidence, recommendation_score
) VALUES
  (
    '80000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 0.94, 0.9,
    0.2, 0.92, 96.83
  ),
  (
    '80000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002', 0.92, 0.89,
    0.26, 0.85, 91.73
  ),
  (
    '80000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000003', 0.96, 0.92,
    0.23, 0.91, 97.16
  ),
  (
    '80000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000004', 0.95, 0.78,
    0.82, 0.94, 62
  ),
  (
    '80000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000005', 0.94, 0.94,
    0.25, 0.91, 90.56
  ),
  (
    '80000000-0000-4000-8000-000000000006', '10000000-0000-4000-8000-000000000006', 0.87, 0.88,
    0.07, 0.91, 85.78
  ),
  (
    '80000000-0000-4000-8000-000000000007', '10000000-0000-4000-8000-000000000007', 0.93, 0.88,
    0.08, 0.93, 86.56
  ),
  (
    '80000000-0000-4000-8000-000000000008', '10000000-0000-4000-8000-000000000008', 0.87, 0.95,
    0.26, 0.97, 85.02
  ),
  (
    '80000000-0000-4000-8000-000000000009', '10000000-0000-4000-8000-000000000009', 0.88, 0.95,
    0.16, 0.96, 92
  ),
  (
    '80000000-0000-4000-8000-00000000000a', '10000000-0000-4000-8000-00000000000a', 0.88, 0.88,
    0.07, 0.98, 91.95
  ),
  (
    '80000000-0000-4000-8000-00000000000b', '10000000-0000-4000-8000-00000000000b', 0.75, 0.93,
    0.09, 0.65, 70
  ),
  (
    '80000000-0000-4000-8000-00000000000c', '10000000-0000-4000-8000-00000000000c', 0.86, 0.96,
    0.09, 0.91, 83.78
  ),
  (
    '80000000-0000-4000-8000-00000000000d', '10000000-0000-4000-8000-00000000000d', 0.84, 0.96,
    0.09, 0.92, 87.11
  ),
  (
    '80000000-0000-4000-8000-00000000000e', '10000000-0000-4000-8000-00000000000e', 0.84, 0.94,
    0.09, 0.87, 92.79
  ),
  (
    '80000000-0000-4000-8000-00000000000f', '10000000-0000-4000-8000-00000000000f', 0.83, 0.91,
    0.1, 0.96, 82.64
  ),
  (
    '80000000-0000-4000-8000-000000000010', '10000000-0000-4000-8000-000000000010', 0.86, 0.94,
    0.26, 0.92, 82.73
  ),
  (
    '80000000-0000-4000-8000-000000000011', '10000000-0000-4000-8000-000000000011', 0.87, 0.89,
    0.26, 0.92, 82.6
  ),
  (
    '80000000-0000-4000-8000-000000000012', '10000000-0000-4000-8000-000000000012', 0.9, 0.96,
    0.31, 0.91, 90.35
  ),
  (
    '80000000-0000-4000-8000-000000000013', '10000000-0000-4000-8000-000000000013', 0.96, 0.96,
    0.21, 0.91, 93.67
  ),
  (
    '80000000-0000-4000-8000-000000000014', '10000000-0000-4000-8000-000000000014', 0.83, 0.95,
    0.22, 0.94, 86.24
  ),
  (
    '80000000-0000-4000-8000-000000000015', '10000000-0000-4000-8000-000000000015', 0.94, 0.92,
    0.06, 0.87, 85.05
  ),
  (
    '80000000-0000-4000-8000-000000000016', '10000000-0000-4000-8000-000000000016', 0.82, 0.96,
    0.05, 0.96, 83.61
  ),
  (
    '80000000-0000-4000-8000-000000000017', '10000000-0000-4000-8000-000000000017', 0.93, 0.9,
    0.17, 0.87, 90.76
  ),
  (
    '80000000-0000-4000-8000-000000000018', '10000000-0000-4000-8000-000000000018', 0.86, 0.9,
    0.15, 0.97, 90.75
  ),
  (
    '80000000-0000-4000-8000-000000000019', '10000000-0000-4000-8000-000000000019', 0.95, 0.73,
    0.86, 0.94, 62
  ),
  (
    '80000000-0000-4000-8000-00000000001a', '10000000-0000-4000-8000-00000000001a', 0.87, 0.96,
    0.12, 0.9, 82.51
  ),
  (
    '80000000-0000-4000-8000-00000000001b', '10000000-0000-4000-8000-00000000001b', 0.94, 0.89,
    0.27, 0.86, 91.79
  ),
  (
    '80000000-0000-4000-8000-00000000001c', '10000000-0000-4000-8000-00000000001c', 0.96, 0.89,
    0.25, 0.92, 82.19
  ),
  (
    '80000000-0000-4000-8000-00000000001d', '10000000-0000-4000-8000-00000000001d', 0.9, 0.9,
    0.24, 0.96, 88
  ),
  (
    '80000000-0000-4000-8000-00000000001e', '10000000-0000-4000-8000-00000000001e', 0.93, 0.95,
    0.18, 0.95, 86.17
  ),
  (
    '80000000-0000-4000-8000-00000000001f', '10000000-0000-4000-8000-00000000001f', 0.92, 0.97,
    0.16, 0.98, 85.88
  ),
  (
    '80000000-0000-4000-8000-000000000020', '10000000-0000-4000-8000-000000000020', 0.83, 0.91,
    0.06, 0.98, 94.45
  ),
  (
    '80000000-0000-4000-8000-000000000021', '10000000-0000-4000-8000-000000000021', 0.84, 0.97,
    0.07, 0.95, 87.5
  ),
  (
    '80000000-0000-4000-8000-000000000022', '10000000-0000-4000-8000-000000000022', 0.94, 0.9,
    0.11, 0.87, 96.67
  ),
  (
    '80000000-0000-4000-8000-000000000023', '10000000-0000-4000-8000-000000000023', 0.89, 0.93,
    0.11, 0.94, 86.71
  ),
  (
    '80000000-0000-4000-8000-000000000024', '10000000-0000-4000-8000-000000000024', 0.96, 0.9,
    0.18, 0.93, 88.46
  ),
  (
    '80000000-0000-4000-8000-000000000025', '10000000-0000-4000-8000-000000000025', 0.95, 0.9,
    0.3, 0.87, 93.56
  ),
  (
    '80000000-0000-4000-8000-000000000026', '10000000-0000-4000-8000-000000000026', 0.89, 0.96,
    0.16, 0.86, 96.68
  ),
  (
    '80000000-0000-4000-8000-000000000027', '10000000-0000-4000-8000-000000000027', 0.86, 0.92,
    0.23, 0.93, 86.56
  ),
  (
    '80000000-0000-4000-8000-000000000028', '10000000-0000-4000-8000-000000000028', 0.82, 0.89,
    0.14, 0.88, 84.77
  )
ON CONFLICT (id) DO UPDATE SET
  predicted_performance = EXCLUDED.predicted_performance,
  predicted_completion_rate = EXCLUDED.predicted_completion_rate,
  burnout_probability = EXCLUDED.burnout_probability,
  delivery_confidence = EXCLUDED.delivery_confidence,
  recommendation_score = EXCLUDED.recommendation_score;

-- ----------------------------------------------------------------------------
-- 8. PROJECTS DIRECTORY (8 records)
-- ----------------------------------------------------------------------------
INSERT INTO projects (id, name, project_priority, estimated_total_hours, start_date, end_date, status, created_at) VALUES
  ('30000000-0000-4000-8000-000000000001', 'Apollo NextGen Core Platform', 5, 3200, '2026-01-01', '2026-12-31', 'ACTIVE', '2025-05-01 08:00:00+00'),
  ('30000000-0000-4000-8000-000000000002', 'Nova Financial Ledger Engine', 4, 2400, '2026-02-15', '2026-10-31', 'ACTIVE', '2025-05-01 08:00:00+00'),
  ('30000000-0000-4000-8000-000000000003', 'Helios Mobile Banking App', 3, 1800, '2026-03-01', '2026-11-30', 'ACTIVE', '2025-05-01 08:00:00+00'),
  ('30000000-0000-4000-8000-000000000004', 'Sentinel Real-Time Fraud Detector', 5, 2800, '2026-04-01', '2027-02-28', 'ACTIVE', '2025-05-01 08:00:00+00'),
  ('30000000-0000-4000-8000-000000000005', 'Pulse IoT Telemetry Pipeline', 3, 1600, '2026-12-01', '2027-06-30', 'PLANNED', '2025-05-01 08:00:00+00'),
  ('30000000-0000-4000-8000-000000000006', 'Orion Enterprise Design System', 2, 1200, '2026-02-01', '2026-09-30', 'ACTIVE', '2025-05-01 08:00:00+00'),
  ('30000000-0000-4000-8000-000000000007', 'Aegis Zero-Trust Security Gateway', 4, 2000, '2025-06-01', '2026-03-31', 'COMPLETED', '2025-05-01 08:00:00+00'),
  ('30000000-0000-4000-8000-000000000008', 'Vanguard Multi-Region Migration', 3, 1500, '2026-05-01', '2026-12-31', 'PAUSED', '2025-05-01 08:00:00+00')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  project_priority = EXCLUDED.project_priority,
  estimated_total_hours = EXCLUDED.estimated_total_hours,
  start_date = EXCLUDED.start_date,
  end_date = EXCLUDED.end_date,
  status = EXCLUDED.status;

-- ----------------------------------------------------------------------------
-- 9. PROJECT STAFFING REQUIREMENTS (20 records)
-- ----------------------------------------------------------------------------
INSERT INTO project_staffing_requirements (
  id, project_id, required_role, skill_id, minimum_proficiency,
  required_headcount, allocation_hours_per_week, allocation_percentage,
  is_mandatory, priority, created_at, updated_at
) VALUES
  (
    '40000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', 'Principal Distributed Systems Lead', '20000000-0000-4000-8000-000000000005', 4,
    1, 40, 100,
    true, 5, '2025-06-01 10:00:00+00', '2025-06-01 10:00:00+00'
  ),
  (
    '40000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000001', 'Senior Backend Engineer', '20000000-0000-4000-8000-000000000001', 4,
    2, 40, 100,
    true, 4, '2025-06-01 10:00:00+00', '2025-06-01 10:00:00+00'
  ),
  (
    '40000000-0000-4000-8000-000000000003', '30000000-0000-4000-8000-000000000001', 'Staff SRE Engineer', '20000000-0000-4000-8000-000000000007', 4,
    1, 40, 100,
    true, 5, '2025-06-01 10:00:00+00', '2025-06-01 10:00:00+00'
  ),
  (
    '40000000-0000-4000-8000-000000000004', '30000000-0000-4000-8000-000000000001', 'Staff Frontend Architect', 'b4cc67f8-1eb1-4e9a-8980-f2a67584b3fc', 4,
    1, 30, 75,
    true, 4, '2025-06-01 10:00:00+00', '2025-06-01 10:00:00+00'
  ),
  (
    '40000000-0000-4000-8000-000000000005', '30000000-0000-4000-8000-000000000002', 'Financial Backend Lead', '20000000-0000-4000-8000-000000000006', 4,
    1, 40, 100,
    true, 5, '2025-06-01 10:00:00+00', '2025-06-01 10:00:00+00'
  ),
  (
    '40000000-0000-4000-8000-000000000006', '30000000-0000-4000-8000-000000000002', 'Senior Java/Spring Engineer', '20000000-0000-4000-8000-000000000012', 4,
    1, 40, 100,
    true, 4, '2025-06-01 10:00:00+00', '2025-06-01 10:00:00+00'
  ),
  (
    '40000000-0000-4000-8000-000000000007', '30000000-0000-4000-8000-000000000002', 'Senior Security & IAM Specialist', '20000000-0000-4000-8000-00000000001b', 4,
    1, 40, 100,
    true, 4, '2025-06-01 10:00:00+00', '2025-06-01 10:00:00+00'
  ),
  (
    '40000000-0000-4000-8000-000000000008', '30000000-0000-4000-8000-000000000003', 'Senior Mobile Lead', '20000000-0000-4000-8000-000000000014', 4,
    1, 40, 100,
    true, 4, '2025-06-01 10:00:00+00', '2025-06-01 10:00:00+00'
  ),
  (
    '40000000-0000-4000-8000-000000000009', '30000000-0000-4000-8000-000000000003', 'Cross-Platform Flutter Engineer', '20000000-0000-4000-8000-000000000013', 3,
    1, 40, 100,
    true, 3, '2025-06-01 10:00:00+00', '2025-06-01 10:00:00+00'
  ),
  (
    '40000000-0000-4000-8000-00000000000a', '30000000-0000-4000-8000-000000000003', 'Mobile QA Automation Specialist', '20000000-0000-4000-8000-000000000019', 3,
    1, 40, 100,
    true, 3, '2025-06-01 10:00:00+00', '2025-06-01 10:00:00+00'
  ),
  (
    '40000000-0000-4000-8000-00000000000b', '30000000-0000-4000-8000-000000000004', 'Staff ML Research Scientist', '20000000-0000-4000-8000-00000000000b', 5,
    1, 40, 100,
    true, 5, '2025-06-01 10:00:00+00', '2025-06-01 10:00:00+00'
  ),
  (
    '40000000-0000-4000-8000-00000000000c', '30000000-0000-4000-8000-000000000004', 'Streaming Pipeline Engineer', '20000000-0000-4000-8000-00000000000c', 4,
    1, 40, 100,
    true, 5, '2025-06-01 10:00:00+00', '2025-06-01 10:00:00+00'
  ),
  (
    '40000000-0000-4000-8000-00000000000d', '30000000-0000-4000-8000-000000000004', 'MLOps Infrastructure Specialist', '20000000-0000-4000-8000-000000000008', 4,
    1, 40, 100,
    true, 4, '2025-06-01 10:00:00+00', '2025-06-01 10:00:00+00'
  ),
  (
    '40000000-0000-4000-8000-00000000000e', '30000000-0000-4000-8000-000000000005', 'IoT Ingestion Engineer', '20000000-0000-4000-8000-000000000005', 4,
    2, 40, 100,
    true, 4, '2025-06-01 10:00:00+00', '2025-06-01 10:00:00+00'
  ),
  (
    '40000000-0000-4000-8000-00000000000f', '30000000-0000-4000-8000-000000000005', 'Stream Analytics Engineer', '20000000-0000-4000-8000-00000000000c', 4,
    1, 40, 100,
    true, 3, '2025-06-01 10:00:00+00', '2025-06-01 10:00:00+00'
  ),
  (
    '40000000-0000-4000-8000-000000000010', '30000000-0000-4000-8000-000000000006', 'Design System Architect', '20000000-0000-4000-8000-00000000001c', 5,
    1, 40, 100,
    true, 3, '2025-06-01 10:00:00+00', '2025-06-01 10:00:00+00'
  ),
  (
    '40000000-0000-4000-8000-000000000011', '30000000-0000-4000-8000-000000000006', 'Senior Component Engineer', 'b4cc67f8-1eb1-4e9a-8980-f2a67584b3fc', 4,
    1, 20, 50,
    true, 3, '2025-06-01 10:00:00+00', '2025-06-01 10:00:00+00'
  ),
  (
    '40000000-0000-4000-8000-000000000012', '30000000-0000-4000-8000-000000000007', 'Zero-Trust Architect', '20000000-0000-4000-8000-00000000001b', 4,
    1, 40, 100,
    true, 4, '2025-06-01 10:00:00+00', '2025-06-01 10:00:00+00'
  ),
  (
    '40000000-0000-4000-8000-000000000013', '30000000-0000-4000-8000-000000000007', 'Cloud Security Engineer', '20000000-0000-4000-8000-000000000009', 4,
    1, 40, 100,
    true, 4, '2025-06-01 10:00:00+00', '2025-06-01 10:00:00+00'
  ),
  (
    '40000000-0000-4000-8000-000000000014', '30000000-0000-4000-8000-000000000008', 'Multi-Cloud Migration Lead', '20000000-0000-4000-8000-00000000000a', 4,
    1, 40, 100,
    true, 3, '2025-06-01 10:00:00+00', '2025-06-01 10:00:00+00'
  )
ON CONFLICT (id) DO UPDATE SET
  required_role = EXCLUDED.required_role,
  minimum_proficiency = EXCLUDED.minimum_proficiency,
  required_headcount = EXCLUDED.required_headcount,
  allocation_hours_per_week = EXCLUDED.allocation_hours_per_week,
  allocation_percentage = EXCLUDED.allocation_percentage,
  priority = EXCLUDED.priority;

-- ----------------------------------------------------------------------------
-- 10. PROJECT TASKS (140 records)
-- ----------------------------------------------------------------------------
INSERT INTO tasks (id, project_id, title, description, complexity, priority, estimated_hours, status, created_at) VALUES
  ('60000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', 'Apollo: Architect high-throughput event ingestion #1', 'Technical deliverable supporting Apollo NextGen Core Platform. Requires rigorous code review and CI verification.', 2, 3, 24, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000001', 'Apollo: Implement zero-downtime database migration script #2', 'Technical deliverable supporting Apollo NextGen Core Platform. Requires rigorous code review and CI verification.', 5, 4, 41, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000003', '30000000-0000-4000-8000-000000000001', 'Apollo: Harden OAuth2 / OIDC authentication service #3', 'Technical deliverable supporting Apollo NextGen Core Platform. Requires rigorous code review and CI verification.', 2, 3, 18, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000004', '30000000-0000-4000-8000-000000000001', 'Apollo: Implement rate-limiting middleware with Redis #4', 'Technical deliverable supporting Apollo NextGen Core Platform. Requires rigorous code review and CI verification.', 2, 3, 26, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000005', '30000000-0000-4000-8000-000000000001', 'Apollo: Refactor React component library for WCAG 2.1 AA accessibility #5', 'Technical deliverable supporting Apollo NextGen Core Platform. Requires rigorous code review and CI verification.', 4, 3, 35, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000006', '30000000-0000-4000-8000-000000000001', 'Apollo: Configure Prometheus alerting rules and Grafana dashboards #6', 'Technical deliverable supporting Apollo NextGen Core Platform. Requires rigorous code review and CI verification.', 2, 2, 19, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000007', '30000000-0000-4000-8000-000000000001', 'Apollo: Construct automated E2E regression test suite #7', 'Technical deliverable supporting Apollo NextGen Core Platform. Requires rigorous code review and CI verification.', 5, 5, 41, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000008', '30000000-0000-4000-8000-000000000001', 'Apollo: Build streaming feature pipeline in PyTorch #8', 'Technical deliverable supporting Apollo NextGen Core Platform. Requires rigorous code review and CI verification.', 4, 5, 37, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000009', '30000000-0000-4000-8000-000000000001', 'Apollo: Develop mobile push notification handler #9', 'Technical deliverable supporting Apollo NextGen Core Platform. Requires rigorous code review and CI verification.', 2, 4, 24, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000000a', '30000000-0000-4000-8000-000000000001', 'Apollo: Deploy multi-region Terraform infrastructure modules #10', 'Technical deliverable supporting Apollo NextGen Core Platform. Requires rigorous code review and CI verification.', 2, 5, 26, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000000b', '30000000-0000-4000-8000-000000000001', 'Apollo: Tune PostgreSQL query planner and B-tree indexes #11', 'Technical deliverable supporting Apollo NextGen Core Platform. Requires rigorous code review and CI verification.', 2, 2, 18, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000000c', '30000000-0000-4000-8000-000000000001', 'Apollo: Conduct threat model and API penetration audit #12', 'Technical deliverable supporting Apollo NextGen Core Platform. Requires rigorous code review and CI verification.', 5, 5, 46, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000000d', '30000000-0000-4000-8000-000000000001', 'Apollo: Optimize bundle size and tree-shaking for web client #13', 'Technical deliverable supporting Apollo NextGen Core Platform. Requires rigorous code review and CI verification.', 2, 4, 19, 'IN_PROGRESS', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000000e', '30000000-0000-4000-8000-000000000001', 'Apollo: Provision Kafka topic partitions and replication topology #14', 'Technical deliverable supporting Apollo NextGen Core Platform. Requires rigorous code review and CI verification.', 2, 4, 25, 'PENDING', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000000f', '30000000-0000-4000-8000-000000000001', 'Apollo: Dockerize microservice with non-root security context #15', 'Technical deliverable supporting Apollo NextGen Core Platform. Requires rigorous code review and CI verification.', 5, 4, 48, 'PENDING', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000010', '30000000-0000-4000-8000-000000000001', 'Apollo: Architect high-throughput event ingestion #16', 'Technical deliverable supporting Apollo NextGen Core Platform. Requires rigorous code review and CI verification.', 4, 5, 35, 'PENDING', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000011', '30000000-0000-4000-8000-000000000001', 'Apollo: Implement zero-downtime database migration script #17', 'Technical deliverable supporting Apollo NextGen Core Platform. Requires rigorous code review and CI verification.', 4, 3, 35, 'IN_PROGRESS', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000012', '30000000-0000-4000-8000-000000000001', 'Apollo: Harden OAuth2 / OIDC authentication service #18', 'Technical deliverable supporting Apollo NextGen Core Platform. Requires rigorous code review and CI verification.', 5, 3, 40, 'PENDING', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000013', '30000000-0000-4000-8000-000000000001', 'Apollo: Implement rate-limiting middleware with Redis #19', 'Technical deliverable supporting Apollo NextGen Core Platform. Requires rigorous code review and CI verification.', 4, 2, 33, 'PENDING', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000014', '30000000-0000-4000-8000-000000000001', 'Apollo: Refactor React component library for WCAG 2.1 AA accessibility #20', 'Technical deliverable supporting Apollo NextGen Core Platform. Requires rigorous code review and CI verification.', 5, 5, 46, 'PENDING', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000015', '30000000-0000-4000-8000-000000000002', 'Nova: Implement rate-limiting middleware with Redis #1', 'Technical deliverable supporting Nova Financial Ledger Engine. Requires rigorous code review and CI verification.', 4, 4, 35, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000016', '30000000-0000-4000-8000-000000000002', 'Nova: Refactor React component library for WCAG 2.1 AA accessibility #2', 'Technical deliverable supporting Nova Financial Ledger Engine. Requires rigorous code review and CI verification.', 4, 2, 37, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000017', '30000000-0000-4000-8000-000000000002', 'Nova: Configure Prometheus alerting rules and Grafana dashboards #3', 'Technical deliverable supporting Nova Financial Ledger Engine. Requires rigorous code review and CI verification.', 5, 2, 44, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000018', '30000000-0000-4000-8000-000000000002', 'Nova: Construct automated E2E regression test suite #4', 'Technical deliverable supporting Nova Financial Ledger Engine. Requires rigorous code review and CI verification.', 2, 3, 20, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000019', '30000000-0000-4000-8000-000000000002', 'Nova: Build streaming feature pipeline in PyTorch #5', 'Technical deliverable supporting Nova Financial Ledger Engine. Requires rigorous code review and CI verification.', 5, 3, 43, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000001a', '30000000-0000-4000-8000-000000000002', 'Nova: Develop mobile push notification handler #6', 'Technical deliverable supporting Nova Financial Ledger Engine. Requires rigorous code review and CI verification.', 5, 2, 41, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000001b', '30000000-0000-4000-8000-000000000002', 'Nova: Deploy multi-region Terraform infrastructure modules #7', 'Technical deliverable supporting Nova Financial Ledger Engine. Requires rigorous code review and CI verification.', 5, 3, 42, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000001c', '30000000-0000-4000-8000-000000000002', 'Nova: Tune PostgreSQL query planner and B-tree indexes #8', 'Technical deliverable supporting Nova Financial Ledger Engine. Requires rigorous code review and CI verification.', 2, 2, 21, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000001d', '30000000-0000-4000-8000-000000000002', 'Nova: Conduct threat model and API penetration audit #9', 'Technical deliverable supporting Nova Financial Ledger Engine. Requires rigorous code review and CI verification.', 5, 3, 41, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000001e', '30000000-0000-4000-8000-000000000002', 'Nova: Optimize bundle size and tree-shaking for web client #10', 'Technical deliverable supporting Nova Financial Ledger Engine. Requires rigorous code review and CI verification.', 3, 4, 34, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000001f', '30000000-0000-4000-8000-000000000002', 'Nova: Provision Kafka topic partitions and replication topology #11', 'Technical deliverable supporting Nova Financial Ledger Engine. Requires rigorous code review and CI verification.', 4, 3, 34, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000020', '30000000-0000-4000-8000-000000000002', 'Nova: Dockerize microservice with non-root security context #12', 'Technical deliverable supporting Nova Financial Ledger Engine. Requires rigorous code review and CI verification.', 4, 3, 37, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000021', '30000000-0000-4000-8000-000000000002', 'Nova: Architect high-throughput event ingestion #13', 'Technical deliverable supporting Nova Financial Ledger Engine. Requires rigorous code review and CI verification.', 5, 4, 47, 'IN_PROGRESS', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000022', '30000000-0000-4000-8000-000000000002', 'Nova: Implement zero-downtime database migration script #14', 'Technical deliverable supporting Nova Financial Ledger Engine. Requires rigorous code review and CI verification.', 2, 2, 22, 'PENDING', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000023', '30000000-0000-4000-8000-000000000002', 'Nova: Harden OAuth2 / OIDC authentication service #15', 'Technical deliverable supporting Nova Financial Ledger Engine. Requires rigorous code review and CI verification.', 5, 4, 47, 'PENDING', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000024', '30000000-0000-4000-8000-000000000002', 'Nova: Implement rate-limiting middleware with Redis #16', 'Technical deliverable supporting Nova Financial Ledger Engine. Requires rigorous code review and CI verification.', 2, 5, 21, 'PENDING', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000025', '30000000-0000-4000-8000-000000000002', 'Nova: Refactor React component library for WCAG 2.1 AA accessibility #17', 'Technical deliverable supporting Nova Financial Ledger Engine. Requires rigorous code review and CI verification.', 4, 4, 32, 'IN_PROGRESS', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000026', '30000000-0000-4000-8000-000000000002', 'Nova: Configure Prometheus alerting rules and Grafana dashboards #18', 'Technical deliverable supporting Nova Financial Ledger Engine. Requires rigorous code review and CI verification.', 2, 2, 17, 'PENDING', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000027', '30000000-0000-4000-8000-000000000002', 'Nova: Construct automated E2E regression test suite #19', 'Technical deliverable supporting Nova Financial Ledger Engine. Requires rigorous code review and CI verification.', 5, 4, 40, 'PENDING', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000028', '30000000-0000-4000-8000-000000000002', 'Nova: Build streaming feature pipeline in PyTorch #20', 'Technical deliverable supporting Nova Financial Ledger Engine. Requires rigorous code review and CI verification.', 4, 2, 35, 'PENDING', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000029', '30000000-0000-4000-8000-000000000003', 'Helios: Construct automated E2E regression test suite #1', 'Technical deliverable supporting Helios Mobile Banking App. Requires rigorous code review and CI verification.', 4, 4, 35, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000002a', '30000000-0000-4000-8000-000000000003', 'Helios: Build streaming feature pipeline in PyTorch #2', 'Technical deliverable supporting Helios Mobile Banking App. Requires rigorous code review and CI verification.', 3, 2, 24, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000002b', '30000000-0000-4000-8000-000000000003', 'Helios: Develop mobile push notification handler #3', 'Technical deliverable supporting Helios Mobile Banking App. Requires rigorous code review and CI verification.', 3, 3, 25, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000002c', '30000000-0000-4000-8000-000000000003', 'Helios: Deploy multi-region Terraform infrastructure modules #4', 'Technical deliverable supporting Helios Mobile Banking App. Requires rigorous code review and CI verification.', 4, 4, 38, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000002d', '30000000-0000-4000-8000-000000000003', 'Helios: Tune PostgreSQL query planner and B-tree indexes #5', 'Technical deliverable supporting Helios Mobile Banking App. Requires rigorous code review and CI verification.', 5, 5, 43, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000002e', '30000000-0000-4000-8000-000000000003', 'Helios: Conduct threat model and API penetration audit #6', 'Technical deliverable supporting Helios Mobile Banking App. Requires rigorous code review and CI verification.', 5, 3, 45, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000002f', '30000000-0000-4000-8000-000000000003', 'Helios: Optimize bundle size and tree-shaking for web client #7', 'Technical deliverable supporting Helios Mobile Banking App. Requires rigorous code review and CI verification.', 4, 4, 34, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000030', '30000000-0000-4000-8000-000000000003', 'Helios: Provision Kafka topic partitions and replication topology #8', 'Technical deliverable supporting Helios Mobile Banking App. Requires rigorous code review and CI verification.', 2, 2, 19, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000031', '30000000-0000-4000-8000-000000000003', 'Helios: Dockerize microservice with non-root security context #9', 'Technical deliverable supporting Helios Mobile Banking App. Requires rigorous code review and CI verification.', 5, 3, 47, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000032', '30000000-0000-4000-8000-000000000003', 'Helios: Architect high-throughput event ingestion #10', 'Technical deliverable supporting Helios Mobile Banking App. Requires rigorous code review and CI verification.', 2, 2, 20, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000033', '30000000-0000-4000-8000-000000000003', 'Helios: Implement zero-downtime database migration script #11', 'Technical deliverable supporting Helios Mobile Banking App. Requires rigorous code review and CI verification.', 3, 4, 27, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000034', '30000000-0000-4000-8000-000000000003', 'Helios: Harden OAuth2 / OIDC authentication service #12', 'Technical deliverable supporting Helios Mobile Banking App. Requires rigorous code review and CI verification.', 4, 3, 37, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000035', '30000000-0000-4000-8000-000000000003', 'Helios: Implement rate-limiting middleware with Redis #13', 'Technical deliverable supporting Helios Mobile Banking App. Requires rigorous code review and CI verification.', 4, 5, 32, 'IN_PROGRESS', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000036', '30000000-0000-4000-8000-000000000003', 'Helios: Refactor React component library for WCAG 2.1 AA accessibility #14', 'Technical deliverable supporting Helios Mobile Banking App. Requires rigorous code review and CI verification.', 2, 5, 22, 'PENDING', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000037', '30000000-0000-4000-8000-000000000003', 'Helios: Configure Prometheus alerting rules and Grafana dashboards #15', 'Technical deliverable supporting Helios Mobile Banking App. Requires rigorous code review and CI verification.', 3, 4, 25, 'PENDING', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000038', '30000000-0000-4000-8000-000000000003', 'Helios: Construct automated E2E regression test suite #16', 'Technical deliverable supporting Helios Mobile Banking App. Requires rigorous code review and CI verification.', 4, 5, 35, 'PENDING', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000039', '30000000-0000-4000-8000-000000000003', 'Helios: Build streaming feature pipeline in PyTorch #17', 'Technical deliverable supporting Helios Mobile Banking App. Requires rigorous code review and CI verification.', 2, 2, 23, 'IN_PROGRESS', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000003a', '30000000-0000-4000-8000-000000000003', 'Helios: Develop mobile push notification handler #18', 'Technical deliverable supporting Helios Mobile Banking App. Requires rigorous code review and CI verification.', 5, 3, 40, 'PENDING', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000003b', '30000000-0000-4000-8000-000000000003', 'Helios: Deploy multi-region Terraform infrastructure modules #19', 'Technical deliverable supporting Helios Mobile Banking App. Requires rigorous code review and CI verification.', 3, 3, 28, 'PENDING', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000003c', '30000000-0000-4000-8000-000000000003', 'Helios: Tune PostgreSQL query planner and B-tree indexes #20', 'Technical deliverable supporting Helios Mobile Banking App. Requires rigorous code review and CI verification.', 2, 4, 26, 'PENDING', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000003d', '30000000-0000-4000-8000-000000000004', 'Sentinel: Deploy multi-region Terraform infrastructure modules #1', 'Technical deliverable supporting Sentinel Real-Time Fraud Detector. Requires rigorous code review and CI verification.', 3, 5, 29, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000003e', '30000000-0000-4000-8000-000000000004', 'Sentinel: Tune PostgreSQL query planner and B-tree indexes #2', 'Technical deliverable supporting Sentinel Real-Time Fraud Detector. Requires rigorous code review and CI verification.', 2, 5, 18, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000003f', '30000000-0000-4000-8000-000000000004', 'Sentinel: Conduct threat model and API penetration audit #3', 'Technical deliverable supporting Sentinel Real-Time Fraud Detector. Requires rigorous code review and CI verification.', 3, 3, 24, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000040', '30000000-0000-4000-8000-000000000004', 'Sentinel: Optimize bundle size and tree-shaking for web client #4', 'Technical deliverable supporting Sentinel Real-Time Fraud Detector. Requires rigorous code review and CI verification.', 2, 4, 18, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000041', '30000000-0000-4000-8000-000000000004', 'Sentinel: Provision Kafka topic partitions and replication topology #5', 'Technical deliverable supporting Sentinel Real-Time Fraud Detector. Requires rigorous code review and CI verification.', 4, 3, 38, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000042', '30000000-0000-4000-8000-000000000004', 'Sentinel: Dockerize microservice with non-root security context #6', 'Technical deliverable supporting Sentinel Real-Time Fraud Detector. Requires rigorous code review and CI verification.', 5, 4, 41, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000043', '30000000-0000-4000-8000-000000000004', 'Sentinel: Architect high-throughput event ingestion #7', 'Technical deliverable supporting Sentinel Real-Time Fraud Detector. Requires rigorous code review and CI verification.', 3, 4, 32, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000044', '30000000-0000-4000-8000-000000000004', 'Sentinel: Implement zero-downtime database migration script #8', 'Technical deliverable supporting Sentinel Real-Time Fraud Detector. Requires rigorous code review and CI verification.', 3, 2, 29, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000045', '30000000-0000-4000-8000-000000000004', 'Sentinel: Harden OAuth2 / OIDC authentication service #9', 'Technical deliverable supporting Sentinel Real-Time Fraud Detector. Requires rigorous code review and CI verification.', 2, 4, 24, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000046', '30000000-0000-4000-8000-000000000004', 'Sentinel: Implement rate-limiting middleware with Redis #10', 'Technical deliverable supporting Sentinel Real-Time Fraud Detector. Requires rigorous code review and CI verification.', 5, 2, 50, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000047', '30000000-0000-4000-8000-000000000004', 'Sentinel: Refactor React component library for WCAG 2.1 AA accessibility #11', 'Technical deliverable supporting Sentinel Real-Time Fraud Detector. Requires rigorous code review and CI verification.', 5, 4, 49, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000048', '30000000-0000-4000-8000-000000000004', 'Sentinel: Configure Prometheus alerting rules and Grafana dashboards #12', 'Technical deliverable supporting Sentinel Real-Time Fraud Detector. Requires rigorous code review and CI verification.', 3, 4, 30, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000049', '30000000-0000-4000-8000-000000000004', 'Sentinel: Construct automated E2E regression test suite #13', 'Technical deliverable supporting Sentinel Real-Time Fraud Detector. Requires rigorous code review and CI verification.', 3, 2, 30, 'IN_PROGRESS', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000004a', '30000000-0000-4000-8000-000000000004', 'Sentinel: Build streaming feature pipeline in PyTorch #14', 'Technical deliverable supporting Sentinel Real-Time Fraud Detector. Requires rigorous code review and CI verification.', 5, 5, 47, 'PENDING', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000004b', '30000000-0000-4000-8000-000000000004', 'Sentinel: Develop mobile push notification handler #15', 'Technical deliverable supporting Sentinel Real-Time Fraud Detector. Requires rigorous code review and CI verification.', 4, 2, 39, 'PENDING', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000004c', '30000000-0000-4000-8000-000000000004', 'Sentinel: Deploy multi-region Terraform infrastructure modules #16', 'Technical deliverable supporting Sentinel Real-Time Fraud Detector. Requires rigorous code review and CI verification.', 2, 5, 22, 'PENDING', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000004d', '30000000-0000-4000-8000-000000000004', 'Sentinel: Tune PostgreSQL query planner and B-tree indexes #17', 'Technical deliverable supporting Sentinel Real-Time Fraud Detector. Requires rigorous code review and CI verification.', 5, 4, 48, 'IN_PROGRESS', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000004e', '30000000-0000-4000-8000-000000000004', 'Sentinel: Conduct threat model and API penetration audit #18', 'Technical deliverable supporting Sentinel Real-Time Fraud Detector. Requires rigorous code review and CI verification.', 5, 2, 44, 'PENDING', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000004f', '30000000-0000-4000-8000-000000000004', 'Sentinel: Optimize bundle size and tree-shaking for web client #19', 'Technical deliverable supporting Sentinel Real-Time Fraud Detector. Requires rigorous code review and CI verification.', 3, 5, 30, 'PENDING', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000050', '30000000-0000-4000-8000-000000000004', 'Sentinel: Provision Kafka topic partitions and replication topology #20', 'Technical deliverable supporting Sentinel Real-Time Fraud Detector. Requires rigorous code review and CI verification.', 3, 3, 32, 'PENDING', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000051', '30000000-0000-4000-8000-000000000005', 'Pulse: Optimize bundle size and tree-shaking for web client #1', 'Technical deliverable supporting Pulse IoT Telemetry Pipeline. Requires rigorous code review and CI verification.', 3, 4, 27, 'IN_PROGRESS', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000052', '30000000-0000-4000-8000-000000000005', 'Pulse: Provision Kafka topic partitions and replication topology #2', 'Technical deliverable supporting Pulse IoT Telemetry Pipeline. Requires rigorous code review and CI verification.', 4, 2, 33, 'PENDING', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000053', '30000000-0000-4000-8000-000000000005', 'Pulse: Dockerize microservice with non-root security context #3', 'Technical deliverable supporting Pulse IoT Telemetry Pipeline. Requires rigorous code review and CI verification.', 5, 4, 43, 'PENDING', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000054', '30000000-0000-4000-8000-000000000005', 'Pulse: Architect high-throughput event ingestion #4', 'Technical deliverable supporting Pulse IoT Telemetry Pipeline. Requires rigorous code review and CI verification.', 3, 2, 26, 'PENDING', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000055', '30000000-0000-4000-8000-000000000005', 'Pulse: Implement zero-downtime database migration script #5', 'Technical deliverable supporting Pulse IoT Telemetry Pipeline. Requires rigorous code review and CI verification.', 4, 5, 41, 'IN_PROGRESS', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000056', '30000000-0000-4000-8000-000000000005', 'Pulse: Harden OAuth2 / OIDC authentication service #6', 'Technical deliverable supporting Pulse IoT Telemetry Pipeline. Requires rigorous code review and CI verification.', 5, 2, 42, 'PENDING', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000057', '30000000-0000-4000-8000-000000000005', 'Pulse: Implement rate-limiting middleware with Redis #7', 'Technical deliverable supporting Pulse IoT Telemetry Pipeline. Requires rigorous code review and CI verification.', 3, 3, 28, 'PENDING', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000058', '30000000-0000-4000-8000-000000000005', 'Pulse: Refactor React component library for WCAG 2.1 AA accessibility #8', 'Technical deliverable supporting Pulse IoT Telemetry Pipeline. Requires rigorous code review and CI verification.', 3, 4, 32, 'PENDING', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000059', '30000000-0000-4000-8000-000000000006', 'Orion: Architect high-throughput event ingestion #1', 'Technical deliverable supporting Orion Enterprise Design System. Requires rigorous code review and CI verification.', 4, 2, 32, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000005a', '30000000-0000-4000-8000-000000000006', 'Orion: Implement zero-downtime database migration script #2', 'Technical deliverable supporting Orion Enterprise Design System. Requires rigorous code review and CI verification.', 3, 2, 30, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000005b', '30000000-0000-4000-8000-000000000006', 'Orion: Harden OAuth2 / OIDC authentication service #3', 'Technical deliverable supporting Orion Enterprise Design System. Requires rigorous code review and CI verification.', 5, 5, 45, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000005c', '30000000-0000-4000-8000-000000000006', 'Orion: Implement rate-limiting middleware with Redis #4', 'Technical deliverable supporting Orion Enterprise Design System. Requires rigorous code review and CI verification.', 2, 5, 16, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000005d', '30000000-0000-4000-8000-000000000006', 'Orion: Refactor React component library for WCAG 2.1 AA accessibility #5', 'Technical deliverable supporting Orion Enterprise Design System. Requires rigorous code review and CI verification.', 5, 3, 47, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000005e', '30000000-0000-4000-8000-000000000006', 'Orion: Configure Prometheus alerting rules and Grafana dashboards #6', 'Technical deliverable supporting Orion Enterprise Design System. Requires rigorous code review and CI verification.', 5, 4, 46, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000005f', '30000000-0000-4000-8000-000000000006', 'Orion: Construct automated E2E regression test suite #7', 'Technical deliverable supporting Orion Enterprise Design System. Requires rigorous code review and CI verification.', 3, 4, 27, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000060', '30000000-0000-4000-8000-000000000006', 'Orion: Build streaming feature pipeline in PyTorch #8', 'Technical deliverable supporting Orion Enterprise Design System. Requires rigorous code review and CI verification.', 5, 4, 46, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000061', '30000000-0000-4000-8000-000000000006', 'Orion: Develop mobile push notification handler #9', 'Technical deliverable supporting Orion Enterprise Design System. Requires rigorous code review and CI verification.', 4, 4, 42, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000062', '30000000-0000-4000-8000-000000000006', 'Orion: Deploy multi-region Terraform infrastructure modules #10', 'Technical deliverable supporting Orion Enterprise Design System. Requires rigorous code review and CI verification.', 5, 4, 46, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000063', '30000000-0000-4000-8000-000000000006', 'Orion: Tune PostgreSQL query planner and B-tree indexes #11', 'Technical deliverable supporting Orion Enterprise Design System. Requires rigorous code review and CI verification.', 3, 4, 29, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000064', '30000000-0000-4000-8000-000000000006', 'Orion: Conduct threat model and API penetration audit #12', 'Technical deliverable supporting Orion Enterprise Design System. Requires rigorous code review and CI verification.', 3, 4, 34, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000065', '30000000-0000-4000-8000-000000000006', 'Orion: Optimize bundle size and tree-shaking for web client #13', 'Technical deliverable supporting Orion Enterprise Design System. Requires rigorous code review and CI verification.', 5, 5, 44, 'IN_PROGRESS', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000066', '30000000-0000-4000-8000-000000000006', 'Orion: Provision Kafka topic partitions and replication topology #14', 'Technical deliverable supporting Orion Enterprise Design System. Requires rigorous code review and CI verification.', 5, 3, 46, 'PENDING', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000067', '30000000-0000-4000-8000-000000000006', 'Orion: Dockerize microservice with non-root security context #15', 'Technical deliverable supporting Orion Enterprise Design System. Requires rigorous code review and CI verification.', 3, 4, 27, 'PENDING', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000068', '30000000-0000-4000-8000-000000000006', 'Orion: Architect high-throughput event ingestion #16', 'Technical deliverable supporting Orion Enterprise Design System. Requires rigorous code review and CI verification.', 2, 3, 25, 'PENDING', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000069', '30000000-0000-4000-8000-000000000006', 'Orion: Implement zero-downtime database migration script #17', 'Technical deliverable supporting Orion Enterprise Design System. Requires rigorous code review and CI verification.', 2, 3, 23, 'IN_PROGRESS', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000006a', '30000000-0000-4000-8000-000000000006', 'Orion: Harden OAuth2 / OIDC authentication service #18', 'Technical deliverable supporting Orion Enterprise Design System. Requires rigorous code review and CI verification.', 2, 2, 17, 'PENDING', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000006b', '30000000-0000-4000-8000-000000000006', 'Orion: Implement rate-limiting middleware with Redis #19', 'Technical deliverable supporting Orion Enterprise Design System. Requires rigorous code review and CI verification.', 3, 4, 26, 'PENDING', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000006c', '30000000-0000-4000-8000-000000000006', 'Orion: Refactor React component library for WCAG 2.1 AA accessibility #20', 'Technical deliverable supporting Orion Enterprise Design System. Requires rigorous code review and CI verification.', 2, 5, 19, 'PENDING', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000006d', '30000000-0000-4000-8000-000000000007', 'Aegis: Implement rate-limiting middleware with Redis #1', 'Technical deliverable supporting Aegis Zero-Trust Security Gateway. Requires rigorous code review and CI verification.', 4, 4, 40, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000006e', '30000000-0000-4000-8000-000000000007', 'Aegis: Refactor React component library for WCAG 2.1 AA accessibility #2', 'Technical deliverable supporting Aegis Zero-Trust Security Gateway. Requires rigorous code review and CI verification.', 5, 5, 44, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000006f', '30000000-0000-4000-8000-000000000007', 'Aegis: Configure Prometheus alerting rules and Grafana dashboards #3', 'Technical deliverable supporting Aegis Zero-Trust Security Gateway. Requires rigorous code review and CI verification.', 2, 4, 16, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000070', '30000000-0000-4000-8000-000000000007', 'Aegis: Construct automated E2E regression test suite #4', 'Technical deliverable supporting Aegis Zero-Trust Security Gateway. Requires rigorous code review and CI verification.', 5, 5, 42, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000071', '30000000-0000-4000-8000-000000000007', 'Aegis: Build streaming feature pipeline in PyTorch #5', 'Technical deliverable supporting Aegis Zero-Trust Security Gateway. Requires rigorous code review and CI verification.', 3, 2, 28, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000072', '30000000-0000-4000-8000-000000000007', 'Aegis: Develop mobile push notification handler #6', 'Technical deliverable supporting Aegis Zero-Trust Security Gateway. Requires rigorous code review and CI verification.', 2, 4, 23, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000073', '30000000-0000-4000-8000-000000000007', 'Aegis: Deploy multi-region Terraform infrastructure modules #7', 'Technical deliverable supporting Aegis Zero-Trust Security Gateway. Requires rigorous code review and CI verification.', 4, 5, 34, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000074', '30000000-0000-4000-8000-000000000007', 'Aegis: Tune PostgreSQL query planner and B-tree indexes #8', 'Technical deliverable supporting Aegis Zero-Trust Security Gateway. Requires rigorous code review and CI verification.', 2, 5, 17, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000075', '30000000-0000-4000-8000-000000000007', 'Aegis: Conduct threat model and API penetration audit #9', 'Technical deliverable supporting Aegis Zero-Trust Security Gateway. Requires rigorous code review and CI verification.', 4, 4, 40, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000076', '30000000-0000-4000-8000-000000000007', 'Aegis: Optimize bundle size and tree-shaking for web client #10', 'Technical deliverable supporting Aegis Zero-Trust Security Gateway. Requires rigorous code review and CI verification.', 4, 2, 33, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000077', '30000000-0000-4000-8000-000000000007', 'Aegis: Provision Kafka topic partitions and replication topology #11', 'Technical deliverable supporting Aegis Zero-Trust Security Gateway. Requires rigorous code review and CI verification.', 4, 2, 41, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000078', '30000000-0000-4000-8000-000000000007', 'Aegis: Dockerize microservice with non-root security context #12', 'Technical deliverable supporting Aegis Zero-Trust Security Gateway. Requires rigorous code review and CI verification.', 5, 3, 43, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000079', '30000000-0000-4000-8000-000000000007', 'Aegis: Architect high-throughput event ingestion #13', 'Technical deliverable supporting Aegis Zero-Trust Security Gateway. Requires rigorous code review and CI verification.', 3, 5, 33, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000007a', '30000000-0000-4000-8000-000000000007', 'Aegis: Implement zero-downtime database migration script #14', 'Technical deliverable supporting Aegis Zero-Trust Security Gateway. Requires rigorous code review and CI verification.', 5, 2, 40, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000007b', '30000000-0000-4000-8000-000000000007', 'Aegis: Harden OAuth2 / OIDC authentication service #15', 'Technical deliverable supporting Aegis Zero-Trust Security Gateway. Requires rigorous code review and CI verification.', 2, 3, 19, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000007c', '30000000-0000-4000-8000-000000000007', 'Aegis: Implement rate-limiting middleware with Redis #16', 'Technical deliverable supporting Aegis Zero-Trust Security Gateway. Requires rigorous code review and CI verification.', 3, 2, 30, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000007d', '30000000-0000-4000-8000-000000000007', 'Aegis: Refactor React component library for WCAG 2.1 AA accessibility #17', 'Technical deliverable supporting Aegis Zero-Trust Security Gateway. Requires rigorous code review and CI verification.', 4, 2, 41, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000007e', '30000000-0000-4000-8000-000000000007', 'Aegis: Configure Prometheus alerting rules and Grafana dashboards #18', 'Technical deliverable supporting Aegis Zero-Trust Security Gateway. Requires rigorous code review and CI verification.', 2, 4, 21, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000007f', '30000000-0000-4000-8000-000000000007', 'Aegis: Construct automated E2E regression test suite #19', 'Technical deliverable supporting Aegis Zero-Trust Security Gateway. Requires rigorous code review and CI verification.', 3, 3, 25, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000080', '30000000-0000-4000-8000-000000000007', 'Aegis: Build streaming feature pipeline in PyTorch #20', 'Technical deliverable supporting Aegis Zero-Trust Security Gateway. Requires rigorous code review and CI verification.', 3, 2, 32, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000081', '30000000-0000-4000-8000-000000000007', 'Aegis: Develop mobile push notification handler #21', 'Technical deliverable supporting Aegis Zero-Trust Security Gateway. Requires rigorous code review and CI verification.', 4, 3, 35, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000082', '30000000-0000-4000-8000-000000000007', 'Aegis: Deploy multi-region Terraform infrastructure modules #22', 'Technical deliverable supporting Aegis Zero-Trust Security Gateway. Requires rigorous code review and CI verification.', 4, 4, 35, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000083', '30000000-0000-4000-8000-000000000007', 'Aegis: Tune PostgreSQL query planner and B-tree indexes #23', 'Technical deliverable supporting Aegis Zero-Trust Security Gateway. Requires rigorous code review and CI verification.', 4, 5, 33, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000084', '30000000-0000-4000-8000-000000000007', 'Aegis: Conduct threat model and API penetration audit #24', 'Technical deliverable supporting Aegis Zero-Trust Security Gateway. Requires rigorous code review and CI verification.', 4, 2, 33, 'COMPLETED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000085', '30000000-0000-4000-8000-000000000008', 'Vanguard: Construct automated E2E regression test suite #1', 'Technical deliverable supporting Vanguard Multi-Region Migration. Requires rigorous code review and CI verification.', 3, 2, 31, 'BLOCKED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000086', '30000000-0000-4000-8000-000000000008', 'Vanguard: Build streaming feature pipeline in PyTorch #2', 'Technical deliverable supporting Vanguard Multi-Region Migration. Requires rigorous code review and CI verification.', 3, 5, 24, 'BLOCKED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000087', '30000000-0000-4000-8000-000000000008', 'Vanguard: Develop mobile push notification handler #3', 'Technical deliverable supporting Vanguard Multi-Region Migration. Requires rigorous code review and CI verification.', 2, 5, 19, 'BLOCKED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000088', '30000000-0000-4000-8000-000000000008', 'Vanguard: Deploy multi-region Terraform infrastructure modules #4', 'Technical deliverable supporting Vanguard Multi-Region Migration. Requires rigorous code review and CI verification.', 5, 2, 44, 'BLOCKED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-000000000089', '30000000-0000-4000-8000-000000000008', 'Vanguard: Tune PostgreSQL query planner and B-tree indexes #5', 'Technical deliverable supporting Vanguard Multi-Region Migration. Requires rigorous code review and CI verification.', 2, 5, 16, 'BLOCKED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000008a', '30000000-0000-4000-8000-000000000008', 'Vanguard: Conduct threat model and API penetration audit #6', 'Technical deliverable supporting Vanguard Multi-Region Migration. Requires rigorous code review and CI verification.', 5, 2, 44, 'BLOCKED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000008b', '30000000-0000-4000-8000-000000000008', 'Vanguard: Optimize bundle size and tree-shaking for web client #7', 'Technical deliverable supporting Vanguard Multi-Region Migration. Requires rigorous code review and CI verification.', 4, 2, 37, 'BLOCKED', '2026-01-10 10:00:00+00'),
  ('60000000-0000-4000-8000-00000000008c', '30000000-0000-4000-8000-000000000008', 'Vanguard: Provision Kafka topic partitions and replication topology #8', 'Technical deliverable supporting Vanguard Multi-Region Migration. Requires rigorous code review and CI verification.', 2, 4, 16, 'BLOCKED', '2026-01-10 10:00:00+00')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  complexity = EXCLUDED.complexity,
  priority = EXCLUDED.priority,
  estimated_hours = EXCLUDED.estimated_hours,
  status = EXCLUDED.status;

-- ----------------------------------------------------------------------------
-- 11. TASK EXECUTION HISTORY (84 records)
-- ----------------------------------------------------------------------------
INSERT INTO task_history (id, task_id, employee_id, estimated_hours, actual_hours, quality_score, delay_days, completed_on, created_at) VALUES
  ('61000000-0000-4000-8000-000000000001', '60000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000005', 24, 24, 4.9, 1, '2026-03-25', '2026-03-25 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000002', '60000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000007', 41, 48, 4.9, 3, '2026-02-28', '2026-02-28 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000003', '60000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000009', 18, 19, 5, 0, '2026-04-11', '2026-04-11 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000004', '60000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-00000000000c', 26, 25, 4.2, 0, '2026-09-28', '2026-09-28 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000005', '60000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-00000000000e', 35, 33, 4.7, 3, '2026-05-26', '2026-05-26 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000006', '60000000-0000-4000-8000-000000000006', '10000000-0000-4000-8000-000000000010', 19, 18, 4.4, 3, '2026-02-26', '2026-02-26 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000007', '60000000-0000-4000-8000-000000000007', '10000000-0000-4000-8000-000000000012', 41, 43, 4.5, 1, '2026-06-18', '2026-06-18 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000008', '60000000-0000-4000-8000-000000000008', '10000000-0000-4000-8000-000000000014', 37, 43, 4.6, 0, '2026-03-16', '2026-03-16 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000009', '60000000-0000-4000-8000-000000000009', '10000000-0000-4000-8000-000000000016', 24, 27, 4.7, 1, '2026-03-12', '2026-03-12 18:00:00+00'),
  ('61000000-0000-4000-8000-00000000000a', '60000000-0000-4000-8000-00000000000a', '10000000-0000-4000-8000-000000000018', 26, 25, 4.6, 3, '2026-04-14', '2026-04-14 18:00:00+00'),
  ('61000000-0000-4000-8000-00000000000b', '60000000-0000-4000-8000-00000000000b', '10000000-0000-4000-8000-00000000001a', 18, 22, 4.7, 2, '2026-04-19', '2026-04-19 18:00:00+00'),
  ('61000000-0000-4000-8000-00000000000c', '60000000-0000-4000-8000-00000000000c', '10000000-0000-4000-8000-00000000001c', 46, 57, 4.6, 3, '2026-05-24', '2026-05-24 18:00:00+00'),
  ('61000000-0000-4000-8000-00000000000d', '60000000-0000-4000-8000-000000000015', '10000000-0000-4000-8000-00000000001a', 35, 43, 5, 2, '2026-08-18', '2026-08-18 18:00:00+00'),
  ('61000000-0000-4000-8000-00000000000e', '60000000-0000-4000-8000-000000000016', '10000000-0000-4000-8000-00000000001c', 37, 44, 4, 0, '2026-05-18', '2026-05-18 18:00:00+00'),
  ('61000000-0000-4000-8000-00000000000f', '60000000-0000-4000-8000-000000000017', '10000000-0000-4000-8000-00000000001e', 44, 55, 4, 1, '2026-04-12', '2026-04-12 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000010', '60000000-0000-4000-8000-000000000018', '10000000-0000-4000-8000-000000000020', 20, 21, 4.5, 0, '2026-05-11', '2026-05-11 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000011', '60000000-0000-4000-8000-000000000019', '10000000-0000-4000-8000-000000000022', 43, 45, 5, 1, '2026-06-28', '2026-06-28 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000012', '60000000-0000-4000-8000-00000000001a', '10000000-0000-4000-8000-000000000024', 41, 47, 4.7, 3, '2026-09-20', '2026-09-20 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000013', '60000000-0000-4000-8000-00000000001b', '10000000-0000-4000-8000-000000000026', 42, 47, 3.9, 3, '2026-04-11', '2026-04-11 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000014', '60000000-0000-4000-8000-00000000001c', '10000000-0000-4000-8000-000000000028', 21, 23, 4.3, 0, '2026-04-24', '2026-04-24 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000015', '60000000-0000-4000-8000-00000000001d', '10000000-0000-4000-8000-000000000004', 41, 37, 4.1, 0, '2026-09-26', '2026-09-26 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000016', '60000000-0000-4000-8000-00000000001e', '10000000-0000-4000-8000-000000000006', 34, 41, 4.8, 1, '2026-09-27', '2026-09-27 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000017', '60000000-0000-4000-8000-00000000001f', '10000000-0000-4000-8000-000000000008', 34, 35, 4.5, 2, '2026-05-17', '2026-05-17 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000018', '60000000-0000-4000-8000-000000000020', '10000000-0000-4000-8000-00000000000a', 37, 40, 3.9, 0, '2026-08-15', '2026-08-15 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000019', '60000000-0000-4000-8000-000000000029', '10000000-0000-4000-8000-000000000008', 35, 40, 4.5, 0, '2026-04-24', '2026-04-24 18:00:00+00'),
  ('61000000-0000-4000-8000-00000000001a', '60000000-0000-4000-8000-00000000002a', '10000000-0000-4000-8000-00000000000a', 24, 22, 3.8, 3, '2026-03-13', '2026-03-13 18:00:00+00'),
  ('61000000-0000-4000-8000-00000000001b', '60000000-0000-4000-8000-00000000002b', '10000000-0000-4000-8000-00000000000d', 25, 24, 4.6, 0, '2026-02-25', '2026-02-25 18:00:00+00'),
  ('61000000-0000-4000-8000-00000000001c', '60000000-0000-4000-8000-00000000002c', '10000000-0000-4000-8000-00000000000f', 38, 45, 4.2, 1, '2026-09-27', '2026-09-27 18:00:00+00'),
  ('61000000-0000-4000-8000-00000000001d', '60000000-0000-4000-8000-00000000002d', '10000000-0000-4000-8000-000000000011', 43, 50, 4.7, 0, '2026-07-22', '2026-07-22 18:00:00+00'),
  ('61000000-0000-4000-8000-00000000001e', '60000000-0000-4000-8000-00000000002e', '10000000-0000-4000-8000-000000000013', 45, 55, 4.1, 1, '2026-03-12', '2026-03-12 18:00:00+00'),
  ('61000000-0000-4000-8000-00000000001f', '60000000-0000-4000-8000-00000000002f', '10000000-0000-4000-8000-000000000015', 34, 34, 4.1, 3, '2026-02-10', '2026-02-10 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000020', '60000000-0000-4000-8000-000000000030', '10000000-0000-4000-8000-000000000017', 19, 19, 4.5, 0, '2026-07-13', '2026-07-13 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000021', '60000000-0000-4000-8000-000000000031', '10000000-0000-4000-8000-000000000019', 47, 55, 4.6, 1, '2026-04-14', '2026-04-14 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000022', '60000000-0000-4000-8000-000000000032', '10000000-0000-4000-8000-00000000001b', 20, 22, 3.8, 3, '2026-04-16', '2026-04-16 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000023', '60000000-0000-4000-8000-000000000033', '10000000-0000-4000-8000-00000000001d', 27, 28, 4.9, 2, '2026-03-23', '2026-03-23 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000024', '60000000-0000-4000-8000-000000000034', '10000000-0000-4000-8000-00000000001f', 37, 36, 4.8, 3, '2026-09-28', '2026-09-28 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000025', '60000000-0000-4000-8000-00000000003d', '10000000-0000-4000-8000-00000000001d', 29, 34, 4.4, 2, '2026-05-18', '2026-05-18 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000026', '60000000-0000-4000-8000-00000000003e', '10000000-0000-4000-8000-00000000001f', 18, 18, 4, 1, '2026-09-22', '2026-09-22 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000027', '60000000-0000-4000-8000-00000000003f', '10000000-0000-4000-8000-000000000021', 24, 24, 4.2, 3, '2026-05-19', '2026-05-19 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000028', '60000000-0000-4000-8000-000000000040', '10000000-0000-4000-8000-000000000023', 18, 18, 4.9, 1, '2026-05-17', '2026-05-17 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000029', '60000000-0000-4000-8000-000000000041', '10000000-0000-4000-8000-000000000025', 38, 40, 5, 2, '2026-04-28', '2026-04-28 18:00:00+00'),
  ('61000000-0000-4000-8000-00000000002a', '60000000-0000-4000-8000-000000000042', '10000000-0000-4000-8000-000000000027', 41, 46, 4.1, 0, '2026-02-24', '2026-02-24 18:00:00+00'),
  ('61000000-0000-4000-8000-00000000002b', '60000000-0000-4000-8000-000000000043', '10000000-0000-4000-8000-000000000003', 32, 31, 3.9, 3, '2026-06-20', '2026-06-20 18:00:00+00'),
  ('61000000-0000-4000-8000-00000000002c', '60000000-0000-4000-8000-000000000044', '10000000-0000-4000-8000-000000000005', 29, 32, 4.6, 0, '2026-03-21', '2026-03-21 18:00:00+00'),
  ('61000000-0000-4000-8000-00000000002d', '60000000-0000-4000-8000-000000000045', '10000000-0000-4000-8000-000000000007', 24, 23, 4.6, 3, '2026-05-27', '2026-05-27 18:00:00+00'),
  ('61000000-0000-4000-8000-00000000002e', '60000000-0000-4000-8000-000000000046', '10000000-0000-4000-8000-000000000009', 50, 49, 3.8, 0, '2026-06-25', '2026-06-25 18:00:00+00'),
  ('61000000-0000-4000-8000-00000000002f', '60000000-0000-4000-8000-000000000047', '10000000-0000-4000-8000-00000000000c', 49, 60, 3.9, 0, '2026-08-11', '2026-08-11 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000030', '60000000-0000-4000-8000-000000000048', '10000000-0000-4000-8000-00000000000e', 30, 27, 4.2, 1, '2026-05-26', '2026-05-26 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000031', '60000000-0000-4000-8000-000000000059', '10000000-0000-4000-8000-000000000014', 32, 39, 4.9, 1, '2026-04-22', '2026-04-22 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000032', '60000000-0000-4000-8000-00000000005a', '10000000-0000-4000-8000-000000000016', 30, 37, 3.9, 2, '2026-08-19', '2026-08-19 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000033', '60000000-0000-4000-8000-00000000005b', '10000000-0000-4000-8000-000000000018', 45, 54, 4.8, 0, '2026-04-28', '2026-04-28 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000034', '60000000-0000-4000-8000-00000000005c', '10000000-0000-4000-8000-00000000001a', 16, 16, 5, 2, '2026-05-14', '2026-05-14 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000035', '60000000-0000-4000-8000-00000000005d', '10000000-0000-4000-8000-00000000001c', 47, 55, 4.6, 2, '2026-05-17', '2026-05-17 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000036', '60000000-0000-4000-8000-00000000005e', '10000000-0000-4000-8000-00000000001e', 46, 50, 4.1, 1, '2026-06-23', '2026-06-23 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000037', '60000000-0000-4000-8000-00000000005f', '10000000-0000-4000-8000-000000000020', 27, 25, 4.9, 2, '2026-05-26', '2026-05-26 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000038', '60000000-0000-4000-8000-000000000060', '10000000-0000-4000-8000-000000000022', 46, 46, 4.3, 0, '2026-09-18', '2026-09-18 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000039', '60000000-0000-4000-8000-000000000061', '10000000-0000-4000-8000-000000000024', 42, 47, 4.5, 0, '2026-05-12', '2026-05-12 18:00:00+00'),
  ('61000000-0000-4000-8000-00000000003a', '60000000-0000-4000-8000-000000000062', '10000000-0000-4000-8000-000000000026', 46, 51, 4.3, 0, '2026-09-25', '2026-09-25 18:00:00+00'),
  ('61000000-0000-4000-8000-00000000003b', '60000000-0000-4000-8000-000000000063', '10000000-0000-4000-8000-000000000028', 29, 28, 4.2, 3, '2026-05-13', '2026-05-13 18:00:00+00'),
  ('61000000-0000-4000-8000-00000000003c', '60000000-0000-4000-8000-000000000064', '10000000-0000-4000-8000-000000000004', 34, 32, 4.8, 3, '2026-02-21', '2026-02-21 18:00:00+00'),
  ('61000000-0000-4000-8000-00000000003d', '60000000-0000-4000-8000-00000000006d', '10000000-0000-4000-8000-000000000028', 40, 40, 4.9, 1, '2026-03-21', '2026-03-21 18:00:00+00'),
  ('61000000-0000-4000-8000-00000000003e', '60000000-0000-4000-8000-00000000006e', '10000000-0000-4000-8000-000000000004', 44, 51, 3.8, 2, '2026-05-22', '2026-05-22 18:00:00+00'),
  ('61000000-0000-4000-8000-00000000003f', '60000000-0000-4000-8000-00000000006f', '10000000-0000-4000-8000-000000000006', 16, 19, 4.6, 2, '2026-08-21', '2026-08-21 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000040', '60000000-0000-4000-8000-000000000070', '10000000-0000-4000-8000-000000000008', 42, 38, 4.2, 0, '2026-04-21', '2026-04-21 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000041', '60000000-0000-4000-8000-000000000071', '10000000-0000-4000-8000-00000000000a', 28, 28, 4.7, 3, '2026-08-10', '2026-08-10 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000042', '60000000-0000-4000-8000-000000000072', '10000000-0000-4000-8000-00000000000d', 23, 23, 4, 0, '2026-04-26', '2026-04-26 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000043', '60000000-0000-4000-8000-000000000073', '10000000-0000-4000-8000-00000000000f', 34, 40, 4.4, 1, '2026-08-25', '2026-08-25 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000044', '60000000-0000-4000-8000-000000000074', '10000000-0000-4000-8000-000000000011', 17, 17, 4.9, 3, '2026-03-23', '2026-03-23 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000045', '60000000-0000-4000-8000-000000000075', '10000000-0000-4000-8000-000000000013', 40, 38, 4.7, 0, '2026-05-28', '2026-05-28 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000046', '60000000-0000-4000-8000-000000000076', '10000000-0000-4000-8000-000000000015', 33, 32, 4.4, 3, '2026-06-23', '2026-06-23 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000047', '60000000-0000-4000-8000-000000000077', '10000000-0000-4000-8000-000000000017', 41, 48, 4.5, 3, '2026-04-27', '2026-04-27 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000048', '60000000-0000-4000-8000-000000000078', '10000000-0000-4000-8000-000000000019', 43, 46, 4.8, 0, '2026-07-11', '2026-07-11 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000049', '60000000-0000-4000-8000-000000000079', '10000000-0000-4000-8000-00000000001b', 33, 33, 5, 3, '2026-08-10', '2026-08-10 18:00:00+00'),
  ('61000000-0000-4000-8000-00000000004a', '60000000-0000-4000-8000-00000000007a', '10000000-0000-4000-8000-00000000001d', 40, 41, 4.8, 1, '2026-03-10', '2026-03-10 18:00:00+00'),
  ('61000000-0000-4000-8000-00000000004b', '60000000-0000-4000-8000-00000000007b', '10000000-0000-4000-8000-00000000001f', 19, 20, 4.9, 2, '2026-04-21', '2026-04-21 18:00:00+00'),
  ('61000000-0000-4000-8000-00000000004c', '60000000-0000-4000-8000-00000000007c', '10000000-0000-4000-8000-000000000021', 30, 28, 5, 0, '2026-06-28', '2026-06-28 18:00:00+00'),
  ('61000000-0000-4000-8000-00000000004d', '60000000-0000-4000-8000-00000000007d', '10000000-0000-4000-8000-000000000023', 41, 38, 4.9, 0, '2026-07-18', '2026-07-18 18:00:00+00'),
  ('61000000-0000-4000-8000-00000000004e', '60000000-0000-4000-8000-00000000007e', '10000000-0000-4000-8000-000000000025', 21, 20, 4.5, 1, '2026-06-25', '2026-06-25 18:00:00+00'),
  ('61000000-0000-4000-8000-00000000004f', '60000000-0000-4000-8000-00000000007f', '10000000-0000-4000-8000-000000000027', 25, 30, 4.9, 3, '2026-09-11', '2026-09-11 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000050', '60000000-0000-4000-8000-000000000080', '10000000-0000-4000-8000-000000000003', 32, 30, 4, 0, '2026-06-20', '2026-06-20 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000051', '60000000-0000-4000-8000-000000000081', '10000000-0000-4000-8000-000000000005', 35, 40, 4.3, 3, '2026-02-11', '2026-02-11 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000052', '60000000-0000-4000-8000-000000000082', '10000000-0000-4000-8000-000000000007', 35, 33, 4.4, 1, '2026-09-12', '2026-09-12 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000053', '60000000-0000-4000-8000-000000000083', '10000000-0000-4000-8000-000000000009', 33, 33, 4.5, 1, '2026-04-15', '2026-04-15 18:00:00+00'),
  ('61000000-0000-4000-8000-000000000054', '60000000-0000-4000-8000-000000000084', '10000000-0000-4000-8000-00000000000c', 33, 38, 4.1, 1, '2026-08-12', '2026-08-12 18:00:00+00')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 12. ALLOCATION PROPOSALS (3 records)
-- ----------------------------------------------------------------------------
INSERT INTO allocation_proposals (
  id, project_id, requested_by, status, requested_team_size, selected_headcount,
  proposal_summary, staffing_gap_summary, decision_weight_version,
  model_version_summary, explanation, reviewed_at, reviewed_by, review_comment,
  created_at, updated_at
) VALUES
  (
    '90000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'APPROVED', 4, 4,
    '{"overall_match":0.94,"team_risk":"LOW","estimated_weekly_cost_hours":150}'::jsonb, '{"gaps":[]}'::jsonb, 'v2.0-balanced',
    '{"model":"workforce-quantifier-v2.1","checkpoint":"prod-202611"}'::jsonb, 'Optimal multi-role configuration meeting all mandatory technical requirements with zero capacity conflicts.', '2026-01-15 14:30:00+00',
    '10000000-0000-4000-8000-000000000001', 'Approved. Team composition shows strong synergy between distributed systems and SRE.', '2026-01-14 09:00:00+00', '2026-01-15 14:30:00+00'
  ),
  (
    '90000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000002', 'PENDING_APPROVAL', 3, 3,
    '{"overall_match":0.92,"team_risk":"MEDIUM","estimated_weekly_cost_hours":120}'::jsonb, '{"gaps":[]}'::jsonb, 'v2.0-balanced',
    '{"model":"workforce-quantifier-v2.1","checkpoint":"prod-202611"}'::jsonb, 'High competence match in PyTorch and streaming architectures. Pending VP sign-off.', NULL,
    NULL, NULL, '2026-04-02 11:00:00+00', '2026-04-02 11:00:00+00'
  ),
  (
    '90000000-0000-4000-8000-000000000003', '30000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000002', 'DRAFT', 3, 1,
    '{"overall_match":0.65,"team_risk":"HIGH","estimated_weekly_cost_hours":40}'::jsonb, '{"gaps":["Missing 1 Senior Go/IoT Engineer","Missing 1 Stream Analytics Specialist"]}'::jsonb, 'v2.0-balanced',
    '{"model":"workforce-quantifier-v2.1","checkpoint":"prod-202611"}'::jsonb, 'Severe staffing deficit identified. Recommend initiating contractor sourcing or internal upskilling.', NULL,
    NULL, NULL, '2026-10-20 15:00:00+00', '2026-10-20 15:00:00+00'
  )
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  selected_headcount = EXCLUDED.selected_headcount,
  proposal_summary = EXCLUDED.proposal_summary,
  staffing_gap_summary = EXCLUDED.staffing_gap_summary,
  explanation = EXCLUDED.explanation,
  reviewed_at = EXCLUDED.reviewed_at,
  reviewed_by = EXCLUDED.reviewed_by,
  review_comment = EXCLUDED.review_comment;

-- ----------------------------------------------------------------------------
-- 13. ALLOCATION PROPOSAL MEMBERS (6 records)
-- ----------------------------------------------------------------------------
INSERT INTO allocation_proposal_members (
  id, proposal_id, employee_id, staffing_requirement_id, proposed_role,
  allocated_hours_per_week, allocation_percentage, eligibility_status,
  constraint_snapshot, score_breakdown, skill_match_score, predicted_performance,
  predicted_completion_hours, burnout_risk_probability, fairness_adjustment,
  final_score, availability_status, explanation, created_at
) VALUES
  (
    '91000000-0000-4000-8000-000000000001', '90000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000003', '40000000-0000-4000-8000-000000000001',
    'Principal Distributed Systems Lead', 40, 100, 'ELIGIBLE',
    '{"available_hours":40,"active_projects":0}'::jsonb, '{"skill":0.98,"perf":0.96,"fairness":0.9,"risk":0.05}'::jsonb, 0.98, 0.96,
    38, 0.1, 0.02,
    0.95, 'AVAILABLE_NOW', 'Devansh has verified mastery of Go and Kubernetes with proven track record on distributed platforms.', '2026-01-14 09:10:00+00'
  ),
  (
    '91000000-0000-4000-8000-000000000002', '90000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000005', '40000000-0000-4000-8000-000000000002',
    'Senior Backend Engineer', 40, 100, 'ELIGIBLE',
    '{"available_hours":40,"active_projects":0}'::jsonb, '{"skill":0.92,"perf":0.94,"fairness":0.92,"risk":0.12}'::jsonb, 0.92, 0.94,
    40, 0.12, 0.01,
    0.91, 'AVAILABLE_NOW', 'Liam offers robust experience with Node.js and PostgreSQL high-throughput APIs.', '2026-01-14 09:10:00+00'
  ),
  (
    '91000000-0000-4000-8000-000000000003', '90000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-00000000001a', '40000000-0000-4000-8000-000000000003',
    'Staff SRE Engineer', 40, 100, 'ELIGIBLE',
    '{"available_hours":40,"active_projects":0}'::jsonb, '{"skill":0.97,"perf":0.97,"fairness":0.88,"risk":0.08}'::jsonb, 0.97, 0.97,
    39, 0.08, 0,
    0.94, 'AVAILABLE_NOW', 'Fatima is the premier SRE specialist for Kubernetes autoscaling and Prometheus monitoring.', '2026-01-14 09:10:00+00'
  ),
  (
    '91000000-0000-4000-8000-000000000004', '90000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000004', '40000000-0000-4000-8000-000000000004',
    'Staff Frontend Architect', 30, 75, 'ELIGIBLE',
    '{"available_hours":40,"active_projects":0}'::jsonb, '{"skill":0.99,"perf":0.95,"fairness":0.7,"risk":0.45}'::jsonb, 0.99, 0.95,
    32, 0.45, -0.05,
    0.86, 'AVAILABLE_NOW', 'Sarah provides unparalleled frontend architecture expertise; monitored for subsequent multi-project load.', '2026-01-14 09:10:00+00'
  ),
  (
    '91000000-0000-4000-8000-000000000005', '90000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-00000000001f', '40000000-0000-4000-8000-00000000000b',
    'Staff ML Research Scientist', 40, 100, 'ELIGIBLE',
    '{"available_hours":40,"active_projects":0}'::jsonb, '{"skill":0.99,"perf":0.97,"fairness":0.85,"risk":0.1}'::jsonb, 0.99, 0.97,
    38, 0.1, 0,
    0.96, 'AVAILABLE_NOW', 'Aris is an authority on transformer architectures and fraud classification models.', '2026-04-02 11:15:00+00'
  ),
  (
    '91000000-0000-4000-8000-000000000006', '90000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000020', '40000000-0000-4000-8000-00000000000c',
    'Streaming Pipeline Engineer', 40, 100, 'ELIGIBLE',
    '{"available_hours":40,"active_projects":0}'::jsonb, '{"skill":0.95,"perf":0.95,"fairness":0.89,"risk":0.12}'::jsonb, 0.95, 0.95,
    40, 0.12, 0.01,
    0.93, 'AVAILABLE_NOW', 'Leila possesses extensive experience managing Kafka streaming topologies.', '2026-04-02 11:15:00+00'
  )
ON CONFLICT (id) DO UPDATE SET
  eligibility_status = EXCLUDED.eligibility_status,
  final_score = EXCLUDED.final_score,
  availability_status = EXCLUDED.availability_status;

-- ----------------------------------------------------------------------------
-- 14. ACTIVE & COMPLETED ALLOCATIONS (24 records)
-- ----------------------------------------------------------------------------
INSERT INTO allocations (
  id, employee_id, project_id, week_start_date, allocated_hours, status,
  proposal_id, proposal_member_id, staffing_requirement_id, assigned_role,
  allocated_hours_per_week, allocation_percentage, start_date, planned_end_date,
  actual_end_date, released_at, created_at
) VALUES
  (
    '50000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000003', '30000000-0000-4000-8000-000000000001', '2026-01-19', 40, 'ACTIVE',
    '90000000-0000-4000-8000-000000000001', '91000000-0000-4000-8000-000000000001',
    '40000000-0000-4000-8000-000000000001', 'Principal Distributed Systems Lead',
    40, 100, '2026-01-19',
    '2026-12-31', NULL,
    NULL, '2026-01-15 15:00:00+00'
  ),
  (
    '50000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000005', '30000000-0000-4000-8000-000000000001', '2026-01-19', 40, 'ACTIVE',
    '90000000-0000-4000-8000-000000000001', '91000000-0000-4000-8000-000000000002',
    '40000000-0000-4000-8000-000000000002', 'Senior Backend Engineer',
    40, 100, '2026-01-19',
    '2026-12-31', NULL,
    NULL, '2026-01-15 15:00:00+00'
  ),
  (
    '50000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-00000000001a', '30000000-0000-4000-8000-000000000001', '2026-01-19', 40, 'ACTIVE',
    '90000000-0000-4000-8000-000000000001', '91000000-0000-4000-8000-000000000003',
    '40000000-0000-4000-8000-000000000003', 'Staff SRE Engineer',
    40, 100, '2026-01-19',
    '2026-12-31', NULL,
    NULL, '2026-01-15 15:00:00+00'
  ),
  (
    '50000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000004', '30000000-0000-4000-8000-000000000001', '2026-01-19', 30, 'ACTIVE',
    '90000000-0000-4000-8000-000000000001', '91000000-0000-4000-8000-000000000004',
    '40000000-0000-4000-8000-000000000004', 'Staff Frontend Architect',
    30, 75, '2026-01-19',
    '2026-12-31', NULL,
    NULL, '2026-01-15 15:00:00+00'
  ),
  (
    '50000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000004', '30000000-0000-4000-8000-000000000006', '2026-02-01', 20, 'ACTIVE',
    NULL, NULL,
    '40000000-0000-4000-8000-000000000011', 'Senior Component Lead',
    20, 50, '2026-02-01',
    '2026-09-30', NULL,
    NULL, '2026-01-28 10:00:00+00'
  ),
  (
    '50000000-0000-4000-8000-000000000006', '10000000-0000-4000-8000-000000000019', '30000000-0000-4000-8000-000000000001', '2026-01-19', 30, 'ACTIVE',
    NULL, NULL,
    NULL, 'Principal Cloud Architect',
    30, 75, '2026-01-19',
    '2026-12-31', NULL,
    NULL, '2026-01-15 15:00:00+00'
  ),
  (
    '50000000-0000-4000-8000-000000000007', '10000000-0000-4000-8000-000000000019', '30000000-0000-4000-8000-000000000002', '2026-02-15', 20, 'ACTIVE',
    NULL, NULL,
    NULL, 'Infrastructure Architect',
    20, 50, '2026-02-15',
    '2026-10-31', NULL,
    NULL, '2026-02-10 11:00:00+00'
  ),
  (
    '50000000-0000-4000-8000-000000000008', '10000000-0000-4000-8000-000000000006', '30000000-0000-4000-8000-000000000002', '2026-03-01', 40, 'ACTIVE',
    NULL, NULL,
    NULL, 'Senior Backend Engineer',
    40, 100, '2026-03-01',
    '2026-10-31', NULL,
    NULL, '2026-02-25 10:00:00+00'
  ),
  (
    '50000000-0000-4000-8000-000000000009', '10000000-0000-4000-8000-000000000008', '30000000-0000-4000-8000-000000000002', '2026-03-01', 40, 'ACTIVE',
    NULL, NULL,
    NULL, 'Mid Backend Engineer',
    40, 100, '2026-03-01',
    '2026-10-31', NULL,
    NULL, '2026-02-25 10:00:00+00'
  ),
  (
    '50000000-0000-4000-8000-00000000000a', '10000000-0000-4000-8000-000000000014', '30000000-0000-4000-8000-000000000002', '2026-03-01', 40, 'ACTIVE',
    NULL, NULL,
    NULL, 'Senior Technical PM',
    40, 100, '2026-03-01',
    '2026-10-31', NULL,
    NULL, '2026-02-25 10:00:00+00'
  ),
  (
    '50000000-0000-4000-8000-00000000000b', '10000000-0000-4000-8000-000000000007', '30000000-0000-4000-8000-000000000003', '2026-03-01', 40, 'ACTIVE',
    NULL, NULL,
    NULL, 'Senior Mobile Engineer',
    40, 100, '2026-03-01',
    '2026-11-30', NULL,
    NULL, '2026-02-25 10:00:00+00'
  ),
  (
    '50000000-0000-4000-8000-00000000000c', '10000000-0000-4000-8000-00000000000f', '30000000-0000-4000-8000-000000000003', '2026-03-01', 40, 'ACTIVE',
    NULL, NULL,
    NULL, 'Senior Mobile Engineer',
    40, 100, '2026-03-01',
    '2026-11-30', NULL,
    NULL, '2026-02-25 10:00:00+00'
  ),
  (
    '50000000-0000-4000-8000-00000000000d', '10000000-0000-4000-8000-000000000026', '30000000-0000-4000-8000-000000000003', '2026-03-01', 40, 'ACTIVE',
    NULL, NULL,
    NULL, 'QA Automation Engineer',
    40, 100, '2026-03-01',
    '2026-11-30', NULL,
    NULL, '2026-02-25 10:00:00+00'
  ),
  (
    '50000000-0000-4000-8000-00000000000e', '10000000-0000-4000-8000-00000000001f', '30000000-0000-4000-8000-000000000004', '2026-03-01', 40, 'ACTIVE',
    NULL, NULL,
    NULL, 'Staff ML Research Scientist',
    40, 100, '2026-03-01',
    '2027-02-28', NULL,
    NULL, '2026-02-25 10:00:00+00'
  ),
  (
    '50000000-0000-4000-8000-00000000000f', '10000000-0000-4000-8000-000000000020', '30000000-0000-4000-8000-000000000004', '2026-03-01', 40, 'ACTIVE',
    NULL, NULL,
    NULL, 'Senior Data Platform Engineer',
    40, 100, '2026-03-01',
    '2027-02-28', NULL,
    NULL, '2026-02-25 10:00:00+00'
  ),
  (
    '50000000-0000-4000-8000-000000000010', '10000000-0000-4000-8000-000000000021', '30000000-0000-4000-8000-000000000004', '2026-03-01', 40, 'ACTIVE',
    NULL, NULL,
    NULL, 'Senior MLOps Engineer',
    40, 100, '2026-03-01',
    '2027-02-28', NULL,
    NULL, '2026-02-25 10:00:00+00'
  ),
  (
    '50000000-0000-4000-8000-000000000011', '10000000-0000-4000-8000-000000000015', '30000000-0000-4000-8000-000000000006', '2026-03-01', 40, 'ACTIVE',
    NULL, NULL,
    NULL, 'Principal Design System Architect',
    40, 100, '2026-03-01',
    '2026-09-30', NULL,
    NULL, '2026-02-25 10:00:00+00'
  ),
  (
    '50000000-0000-4000-8000-000000000012', '10000000-0000-4000-8000-000000000016', '30000000-0000-4000-8000-000000000006', '2026-03-01', 40, 'ACTIVE',
    NULL, NULL,
    NULL, 'Senior UX Designer',
    40, 100, '2026-03-01',
    '2026-09-30', NULL,
    NULL, '2026-02-25 10:00:00+00'
  ),
  (
    '50000000-0000-4000-8000-000000000013', '10000000-0000-4000-8000-000000000009', '30000000-0000-4000-8000-000000000006', '2026-03-01', 40, 'ACTIVE',
    NULL, NULL,
    NULL, 'Mid Frontend Engineer',
    40, 100, '2026-03-01',
    '2026-09-30', NULL,
    NULL, '2026-02-25 10:00:00+00'
  ),
  (
    '50000000-0000-4000-8000-000000000014', '10000000-0000-4000-8000-00000000001b', '30000000-0000-4000-8000-000000000002', '2026-03-01', 40, 'ACTIVE',
    NULL, NULL,
    NULL, 'Senior Cloud Security Engineer',
    40, 100, '2026-03-01',
    '2026-10-31', NULL,
    NULL, '2026-02-25 10:00:00+00'
  ),
  (
    '50000000-0000-4000-8000-000000000015', '10000000-0000-4000-8000-000000000025', '30000000-0000-4000-8000-000000000001', '2026-03-01', 40, 'ACTIVE',
    NULL, NULL,
    NULL, 'Staff SDET',
    40, 100, '2026-03-01',
    '2026-12-31', NULL,
    NULL, '2026-02-25 10:00:00+00'
  ),
  (
    '50000000-0000-4000-8000-000000000016', '10000000-0000-4000-8000-00000000001b', '30000000-0000-4000-8000-000000000007', '2025-06-01', 40, 'WORK_COMPLETED',
    NULL, NULL,
    NULL, 'Zero-Trust Architect',
    40, 100, '2025-06-01',
    '2026-03-31', '2026-03-31',
    '2026-03-31 17:00:00+00', '2025-05-28 14:00:00+00'
  ),
  (
    '50000000-0000-4000-8000-000000000017', '10000000-0000-4000-8000-00000000001c', '30000000-0000-4000-8000-000000000007', '2025-06-01', 40, 'WORK_COMPLETED',
    NULL, NULL,
    NULL, 'Senior Platform Engineer',
    40, 100, '2025-06-01',
    '2026-03-31', '2026-03-31',
    '2026-03-31 17:00:00+00', '2025-05-28 14:00:00+00'
  ),
  (
    '50000000-0000-4000-8000-000000000018', '10000000-0000-4000-8000-000000000005', '30000000-0000-4000-8000-000000000007', '2025-06-01', 40, 'WORK_COMPLETED',
    NULL, NULL,
    NULL, 'Senior Backend Engineer',
    40, 100, '2025-06-01',
    '2026-03-31', '2026-03-31',
    '2026-03-31 17:00:00+00', '2025-05-28 14:00:00+00'
  )
ON CONFLICT (id) DO UPDATE SET
  allocated_hours = EXCLUDED.allocated_hours,
  allocated_hours_per_week = EXCLUDED.allocated_hours_per_week,
  status = EXCLUDED.status,
  actual_end_date = EXCLUDED.actual_end_date,
  released_at = EXCLUDED.released_at;

-- ----------------------------------------------------------------------------
-- 15. EMPLOYEE WEEKLY PERFORMANCE (154 records)
-- ----------------------------------------------------------------------------
INSERT INTO employee_performance (id, employee_id, project_id, week_start_date, delivery_score, quality_score, completion_status, created_at) VALUES
  ('72000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', '2026-09-20', 0.95, 0.98, 'COMPLETED', '2026-09-20 18:00:00'),
  ('72000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000002', '2026-09-24', 0.89, 0.99, 'COMPLETED', '2026-09-24 18:00:00'),
  ('72000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000003', '2026-08-24', 0.83, 0.91, 'DELAYED', '2026-08-24 18:00:00'),
  ('72000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000001', '2026-09-24', 0.89, 0.88, 'COMPLETED', '2026-09-24 18:00:00'),
  ('72000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000002', '2026-09-16', 0.92, 0.87, 'COMPLETED', '2026-09-16 18:00:00'),
  ('72000000-0000-4000-8000-000000000006', '10000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000003', '2026-08-17', 0.89, 0.88, 'COMPLETED', '2026-08-17 18:00:00'),
  ('72000000-0000-4000-8000-000000000007', '10000000-0000-4000-8000-000000000003', '30000000-0000-4000-8000-000000000001', '2026-09-19', 0.92, 0.96, 'COMPLETED', '2026-09-19 18:00:00'),
  ('72000000-0000-4000-8000-000000000008', '10000000-0000-4000-8000-000000000003', '30000000-0000-4000-8000-000000000002', '2026-09-19', 0.95, 0.94, 'COMPLETED', '2026-09-19 18:00:00'),
  ('72000000-0000-4000-8000-000000000009', '10000000-0000-4000-8000-000000000003', '30000000-0000-4000-8000-000000000003', '2026-08-13', 0.9, 0.86, 'COMPLETED', '2026-08-13 18:00:00'),
  ('72000000-0000-4000-8000-00000000000a', '10000000-0000-4000-8000-000000000004', '30000000-0000-4000-8000-000000000001', '2026-09-20', 0.83, 0.97, 'DELAYED', '2026-09-20 18:00:00'),
  ('72000000-0000-4000-8000-00000000000b', '10000000-0000-4000-8000-000000000004', '30000000-0000-4000-8000-000000000002', '2026-09-12', 0.86, 0.93, 'COMPLETED', '2026-09-12 18:00:00'),
  ('72000000-0000-4000-8000-00000000000c', '10000000-0000-4000-8000-000000000004', '30000000-0000-4000-8000-000000000003', '2026-08-10', 0.98, 0.87, 'COMPLETED', '2026-08-10 18:00:00'),
  ('72000000-0000-4000-8000-00000000000d', '10000000-0000-4000-8000-000000000004', '30000000-0000-4000-8000-000000000004', '2026-07-21', 0.87, 0.98, 'COMPLETED', '2026-07-21 18:00:00'),
  ('72000000-0000-4000-8000-00000000000e', '10000000-0000-4000-8000-000000000004', '30000000-0000-4000-8000-000000000001', '2026-06-10', 0.85, 0.92, 'COMPLETED', '2026-06-10 18:00:00'),
  ('72000000-0000-4000-8000-00000000000f', '10000000-0000-4000-8000-000000000005', '30000000-0000-4000-8000-000000000001', '2026-09-10', 0.81, 0.87, 'DELAYED', '2026-09-10 18:00:00'),
  ('72000000-0000-4000-8000-000000000010', '10000000-0000-4000-8000-000000000005', '30000000-0000-4000-8000-000000000002', '2026-09-24', 0.95, 0.96, 'COMPLETED', '2026-09-24 18:00:00'),
  ('72000000-0000-4000-8000-000000000011', '10000000-0000-4000-8000-000000000005', '30000000-0000-4000-8000-000000000003', '2026-08-14', 0.95, 0.94, 'COMPLETED', '2026-08-14 18:00:00'),
  ('72000000-0000-4000-8000-000000000012', '10000000-0000-4000-8000-000000000005', '30000000-0000-4000-8000-000000000004', '2026-07-25', 0.85, 0.95, 'COMPLETED', '2026-07-25 18:00:00'),
  ('72000000-0000-4000-8000-000000000013', '10000000-0000-4000-8000-000000000006', '30000000-0000-4000-8000-000000000001', '2026-09-19', 0.94, 0.89, 'COMPLETED', '2026-09-19 18:00:00'),
  ('72000000-0000-4000-8000-000000000014', '10000000-0000-4000-8000-000000000006', '30000000-0000-4000-8000-000000000002', '2026-09-11', 0.88, 0.9, 'COMPLETED', '2026-09-11 18:00:00'),
  ('72000000-0000-4000-8000-000000000015', '10000000-0000-4000-8000-000000000006', '30000000-0000-4000-8000-000000000003', '2026-08-22', 0.8, 0.86, 'DELAYED', '2026-08-22 18:00:00'),
  ('72000000-0000-4000-8000-000000000016', '10000000-0000-4000-8000-000000000006', '30000000-0000-4000-8000-000000000004', '2026-07-16', 0.98, 0.98, 'COMPLETED', '2026-07-16 18:00:00'),
  ('72000000-0000-4000-8000-000000000017', '10000000-0000-4000-8000-000000000006', '30000000-0000-4000-8000-000000000001', '2026-06-25', 0.82, 0.85, 'DELAYED', '2026-06-25 18:00:00'),
  ('72000000-0000-4000-8000-000000000018', '10000000-0000-4000-8000-000000000007', '30000000-0000-4000-8000-000000000001', '2026-09-23', 0.87, 0.96, 'COMPLETED', '2026-09-23 18:00:00'),
  ('72000000-0000-4000-8000-000000000019', '10000000-0000-4000-8000-000000000007', '30000000-0000-4000-8000-000000000002', '2026-09-25', 0.85, 0.97, 'COMPLETED', '2026-09-25 18:00:00'),
  ('72000000-0000-4000-8000-00000000001a', '10000000-0000-4000-8000-000000000007', '30000000-0000-4000-8000-000000000003', '2026-08-23', 0.89, 0.97, 'COMPLETED', '2026-08-23 18:00:00'),
  ('72000000-0000-4000-8000-00000000001b', '10000000-0000-4000-8000-000000000007', '30000000-0000-4000-8000-000000000004', '2026-07-14', 0.97, 0.98, 'COMPLETED', '2026-07-14 18:00:00'),
  ('72000000-0000-4000-8000-00000000001c', '10000000-0000-4000-8000-000000000007', '30000000-0000-4000-8000-000000000001', '2026-06-23', 0.81, 0.85, 'DELAYED', '2026-06-23 18:00:00'),
  ('72000000-0000-4000-8000-00000000001d', '10000000-0000-4000-8000-000000000008', '30000000-0000-4000-8000-000000000001', '2026-09-18', 0.82, 0.98, 'DELAYED', '2026-09-18 18:00:00'),
  ('72000000-0000-4000-8000-00000000001e', '10000000-0000-4000-8000-000000000008', '30000000-0000-4000-8000-000000000002', '2026-09-14', 0.91, 0.96, 'COMPLETED', '2026-09-14 18:00:00'),
  ('72000000-0000-4000-8000-00000000001f', '10000000-0000-4000-8000-000000000008', '30000000-0000-4000-8000-000000000003', '2026-08-15', 0.98, 0.91, 'COMPLETED', '2026-08-15 18:00:00'),
  ('72000000-0000-4000-8000-000000000020', '10000000-0000-4000-8000-000000000008', '30000000-0000-4000-8000-000000000004', '2026-07-22', 0.91, 0.94, 'COMPLETED', '2026-07-22 18:00:00'),
  ('72000000-0000-4000-8000-000000000021', '10000000-0000-4000-8000-000000000008', '30000000-0000-4000-8000-000000000001', '2026-06-10', 0.94, 0.94, 'COMPLETED', '2026-06-10 18:00:00'),
  ('72000000-0000-4000-8000-000000000022', '10000000-0000-4000-8000-000000000009', '30000000-0000-4000-8000-000000000001', '2026-09-21', 0.86, 0.91, 'COMPLETED', '2026-09-21 18:00:00'),
  ('72000000-0000-4000-8000-000000000023', '10000000-0000-4000-8000-000000000009', '30000000-0000-4000-8000-000000000002', '2026-09-21', 0.88, 0.95, 'COMPLETED', '2026-09-21 18:00:00'),
  ('72000000-0000-4000-8000-000000000024', '10000000-0000-4000-8000-000000000009', '30000000-0000-4000-8000-000000000003', '2026-08-13', 0.9, 0.86, 'COMPLETED', '2026-08-13 18:00:00'),
  ('72000000-0000-4000-8000-000000000025', '10000000-0000-4000-8000-000000000009', '30000000-0000-4000-8000-000000000004', '2026-07-11', 0.85, 0.91, 'COMPLETED', '2026-07-11 18:00:00'),
  ('72000000-0000-4000-8000-000000000026', '10000000-0000-4000-8000-000000000009', '30000000-0000-4000-8000-000000000001', '2026-06-22', 0.9, 0.9, 'COMPLETED', '2026-06-22 18:00:00'),
  ('72000000-0000-4000-8000-000000000027', '10000000-0000-4000-8000-00000000000a', '30000000-0000-4000-8000-000000000001', '2026-09-23', 0.96, 0.89, 'COMPLETED', '2026-09-23 18:00:00'),
  ('72000000-0000-4000-8000-000000000028', '10000000-0000-4000-8000-00000000000a', '30000000-0000-4000-8000-000000000002', '2026-09-12', 0.88, 0.97, 'COMPLETED', '2026-09-12 18:00:00'),
  ('72000000-0000-4000-8000-000000000029', '10000000-0000-4000-8000-00000000000a', '30000000-0000-4000-8000-000000000003', '2026-08-22', 0.87, 0.95, 'COMPLETED', '2026-08-22 18:00:00'),
  ('72000000-0000-4000-8000-00000000002a', '10000000-0000-4000-8000-00000000000a', '30000000-0000-4000-8000-000000000004', '2026-07-25', 0.86, 0.99, 'COMPLETED', '2026-07-25 18:00:00'),
  ('72000000-0000-4000-8000-00000000002b', '10000000-0000-4000-8000-00000000000c', '30000000-0000-4000-8000-000000000001', '2026-09-12', 0.86, 0.94, 'COMPLETED', '2026-09-12 18:00:00'),
  ('72000000-0000-4000-8000-00000000002c', '10000000-0000-4000-8000-00000000000c', '30000000-0000-4000-8000-000000000002', '2026-09-14', 0.85, 0.92, 'COMPLETED', '2026-09-14 18:00:00'),
  ('72000000-0000-4000-8000-00000000002d', '10000000-0000-4000-8000-00000000000c', '30000000-0000-4000-8000-000000000003', '2026-08-14', 0.96, 0.9, 'COMPLETED', '2026-08-14 18:00:00'),
  ('72000000-0000-4000-8000-00000000002e', '10000000-0000-4000-8000-00000000000c', '30000000-0000-4000-8000-000000000004', '2026-07-11', 0.86, 0.96, 'COMPLETED', '2026-07-11 18:00:00'),
  ('72000000-0000-4000-8000-00000000002f', '10000000-0000-4000-8000-00000000000d', '30000000-0000-4000-8000-000000000001', '2026-09-11', 0.88, 0.87, 'COMPLETED', '2026-09-11 18:00:00'),
  ('72000000-0000-4000-8000-000000000030', '10000000-0000-4000-8000-00000000000d', '30000000-0000-4000-8000-000000000002', '2026-09-17', 0.94, 0.86, 'COMPLETED', '2026-09-17 18:00:00'),
  ('72000000-0000-4000-8000-000000000031', '10000000-0000-4000-8000-00000000000d', '30000000-0000-4000-8000-000000000003', '2026-08-22', 0.89, 0.99, 'COMPLETED', '2026-08-22 18:00:00'),
  ('72000000-0000-4000-8000-000000000032', '10000000-0000-4000-8000-00000000000e', '30000000-0000-4000-8000-000000000001', '2026-09-16', 0.95, 0.9, 'COMPLETED', '2026-09-16 18:00:00'),
  ('72000000-0000-4000-8000-000000000033', '10000000-0000-4000-8000-00000000000e', '30000000-0000-4000-8000-000000000002', '2026-09-22', 0.97, 0.95, 'COMPLETED', '2026-09-22 18:00:00'),
  ('72000000-0000-4000-8000-000000000034', '10000000-0000-4000-8000-00000000000e', '30000000-0000-4000-8000-000000000003', '2026-08-12', 0.84, 0.95, 'DELAYED', '2026-08-12 18:00:00'),
  ('72000000-0000-4000-8000-000000000035', '10000000-0000-4000-8000-00000000000f', '30000000-0000-4000-8000-000000000001', '2026-09-15', 0.82, 0.85, 'DELAYED', '2026-09-15 18:00:00'),
  ('72000000-0000-4000-8000-000000000036', '10000000-0000-4000-8000-00000000000f', '30000000-0000-4000-8000-000000000002', '2026-09-16', 0.83, 0.85, 'DELAYED', '2026-09-16 18:00:00'),
  ('72000000-0000-4000-8000-000000000037', '10000000-0000-4000-8000-00000000000f', '30000000-0000-4000-8000-000000000003', '2026-08-17', 0.97, 0.89, 'COMPLETED', '2026-08-17 18:00:00'),
  ('72000000-0000-4000-8000-000000000038', '10000000-0000-4000-8000-000000000010', '30000000-0000-4000-8000-000000000001', '2026-09-18', 0.83, 0.96, 'DELAYED', '2026-09-18 18:00:00'),
  ('72000000-0000-4000-8000-000000000039', '10000000-0000-4000-8000-000000000010', '30000000-0000-4000-8000-000000000002', '2026-09-16', 0.82, 0.86, 'DELAYED', '2026-09-16 18:00:00'),
  ('72000000-0000-4000-8000-00000000003a', '10000000-0000-4000-8000-000000000010', '30000000-0000-4000-8000-000000000003', '2026-08-16', 0.93, 0.89, 'COMPLETED', '2026-08-16 18:00:00'),
  ('72000000-0000-4000-8000-00000000003b', '10000000-0000-4000-8000-000000000011', '30000000-0000-4000-8000-000000000001', '2026-09-14', 0.85, 0.99, 'COMPLETED', '2026-09-14 18:00:00'),
  ('72000000-0000-4000-8000-00000000003c', '10000000-0000-4000-8000-000000000011', '30000000-0000-4000-8000-000000000002', '2026-09-10', 0.83, 0.92, 'DELAYED', '2026-09-10 18:00:00'),
  ('72000000-0000-4000-8000-00000000003d', '10000000-0000-4000-8000-000000000011', '30000000-0000-4000-8000-000000000003', '2026-08-24', 0.89, 0.9, 'COMPLETED', '2026-08-24 18:00:00'),
  ('72000000-0000-4000-8000-00000000003e', '10000000-0000-4000-8000-000000000012', '30000000-0000-4000-8000-000000000001', '2026-09-17', 0.84, 0.96, 'DELAYED', '2026-09-17 18:00:00'),
  ('72000000-0000-4000-8000-00000000003f', '10000000-0000-4000-8000-000000000012', '30000000-0000-4000-8000-000000000002', '2026-09-23', 0.81, 0.99, 'DELAYED', '2026-09-23 18:00:00'),
  ('72000000-0000-4000-8000-000000000040', '10000000-0000-4000-8000-000000000012', '30000000-0000-4000-8000-000000000003', '2026-08-14', 0.8, 0.93, 'DELAYED', '2026-08-14 18:00:00'),
  ('72000000-0000-4000-8000-000000000041', '10000000-0000-4000-8000-000000000012', '30000000-0000-4000-8000-000000000004', '2026-07-11', 0.83, 0.94, 'DELAYED', '2026-07-11 18:00:00'),
  ('72000000-0000-4000-8000-000000000042', '10000000-0000-4000-8000-000000000012', '30000000-0000-4000-8000-000000000001', '2026-06-21', 0.81, 0.92, 'DELAYED', '2026-06-21 18:00:00'),
  ('72000000-0000-4000-8000-000000000043', '10000000-0000-4000-8000-000000000013', '30000000-0000-4000-8000-000000000001', '2026-09-13', 0.97, 0.94, 'COMPLETED', '2026-09-13 18:00:00'),
  ('72000000-0000-4000-8000-000000000044', '10000000-0000-4000-8000-000000000013', '30000000-0000-4000-8000-000000000002', '2026-09-24', 0.95, 0.91, 'COMPLETED', '2026-09-24 18:00:00'),
  ('72000000-0000-4000-8000-000000000045', '10000000-0000-4000-8000-000000000013', '30000000-0000-4000-8000-000000000003', '2026-08-18', 0.85, 0.86, 'COMPLETED', '2026-08-18 18:00:00'),
  ('72000000-0000-4000-8000-000000000046', '10000000-0000-4000-8000-000000000013', '30000000-0000-4000-8000-000000000004', '2026-07-17', 0.9, 0.88, 'COMPLETED', '2026-07-17 18:00:00'),
  ('72000000-0000-4000-8000-000000000047', '10000000-0000-4000-8000-000000000014', '30000000-0000-4000-8000-000000000001', '2026-09-15', 0.88, 0.97, 'COMPLETED', '2026-09-15 18:00:00'),
  ('72000000-0000-4000-8000-000000000048', '10000000-0000-4000-8000-000000000014', '30000000-0000-4000-8000-000000000002', '2026-09-16', 0.92, 0.96, 'COMPLETED', '2026-09-16 18:00:00'),
  ('72000000-0000-4000-8000-000000000049', '10000000-0000-4000-8000-000000000014', '30000000-0000-4000-8000-000000000003', '2026-08-18', 0.82, 0.97, 'DELAYED', '2026-08-18 18:00:00'),
  ('72000000-0000-4000-8000-00000000004a', '10000000-0000-4000-8000-000000000014', '30000000-0000-4000-8000-000000000004', '2026-07-19', 0.87, 0.88, 'COMPLETED', '2026-07-19 18:00:00'),
  ('72000000-0000-4000-8000-00000000004b', '10000000-0000-4000-8000-000000000015', '30000000-0000-4000-8000-000000000001', '2026-09-25', 0.93, 0.92, 'COMPLETED', '2026-09-25 18:00:00'),
  ('72000000-0000-4000-8000-00000000004c', '10000000-0000-4000-8000-000000000015', '30000000-0000-4000-8000-000000000002', '2026-09-13', 0.85, 0.89, 'COMPLETED', '2026-09-13 18:00:00'),
  ('72000000-0000-4000-8000-00000000004d', '10000000-0000-4000-8000-000000000015', '30000000-0000-4000-8000-000000000003', '2026-08-22', 0.81, 0.86, 'DELAYED', '2026-08-22 18:00:00'),
  ('72000000-0000-4000-8000-00000000004e', '10000000-0000-4000-8000-000000000016', '30000000-0000-4000-8000-000000000001', '2026-09-18', 0.91, 0.94, 'COMPLETED', '2026-09-18 18:00:00'),
  ('72000000-0000-4000-8000-00000000004f', '10000000-0000-4000-8000-000000000016', '30000000-0000-4000-8000-000000000002', '2026-09-14', 0.91, 0.88, 'COMPLETED', '2026-09-14 18:00:00'),
  ('72000000-0000-4000-8000-000000000050', '10000000-0000-4000-8000-000000000016', '30000000-0000-4000-8000-000000000003', '2026-08-15', 0.83, 0.95, 'DELAYED', '2026-08-15 18:00:00'),
  ('72000000-0000-4000-8000-000000000051', '10000000-0000-4000-8000-000000000016', '30000000-0000-4000-8000-000000000004', '2026-07-13', 0.9, 0.92, 'COMPLETED', '2026-07-13 18:00:00'),
  ('72000000-0000-4000-8000-000000000052', '10000000-0000-4000-8000-000000000017', '30000000-0000-4000-8000-000000000001', '2026-09-17', 0.89, 0.86, 'COMPLETED', '2026-09-17 18:00:00'),
  ('72000000-0000-4000-8000-000000000053', '10000000-0000-4000-8000-000000000017', '30000000-0000-4000-8000-000000000002', '2026-09-13', 0.96, 0.95, 'COMPLETED', '2026-09-13 18:00:00'),
  ('72000000-0000-4000-8000-000000000054', '10000000-0000-4000-8000-000000000017', '30000000-0000-4000-8000-000000000003', '2026-08-22', 0.82, 0.92, 'DELAYED', '2026-08-22 18:00:00'),
  ('72000000-0000-4000-8000-000000000055', '10000000-0000-4000-8000-000000000017', '30000000-0000-4000-8000-000000000004', '2026-07-10', 0.93, 0.97, 'COMPLETED', '2026-07-10 18:00:00'),
  ('72000000-0000-4000-8000-000000000056', '10000000-0000-4000-8000-000000000017', '30000000-0000-4000-8000-000000000001', '2026-06-24', 0.85, 0.87, 'COMPLETED', '2026-06-24 18:00:00'),
  ('72000000-0000-4000-8000-000000000057', '10000000-0000-4000-8000-000000000018', '30000000-0000-4000-8000-000000000001', '2026-09-10', 0.9, 0.88, 'COMPLETED', '2026-09-10 18:00:00'),
  ('72000000-0000-4000-8000-000000000058', '10000000-0000-4000-8000-000000000018', '30000000-0000-4000-8000-000000000002', '2026-09-23', 0.85, 0.93, 'COMPLETED', '2026-09-23 18:00:00'),
  ('72000000-0000-4000-8000-000000000059', '10000000-0000-4000-8000-000000000018', '30000000-0000-4000-8000-000000000003', '2026-08-20', 0.84, 0.95, 'DELAYED', '2026-08-20 18:00:00'),
  ('72000000-0000-4000-8000-00000000005a', '10000000-0000-4000-8000-000000000018', '30000000-0000-4000-8000-000000000004', '2026-07-10', 0.84, 0.88, 'DELAYED', '2026-07-10 18:00:00'),
  ('72000000-0000-4000-8000-00000000005b', '10000000-0000-4000-8000-000000000018', '30000000-0000-4000-8000-000000000001', '2026-06-19', 0.96, 0.93, 'COMPLETED', '2026-06-19 18:00:00'),
  ('72000000-0000-4000-8000-00000000005c', '10000000-0000-4000-8000-000000000019', '30000000-0000-4000-8000-000000000001', '2026-09-20', 0.9, 0.91, 'COMPLETED', '2026-09-20 18:00:00'),
  ('72000000-0000-4000-8000-00000000005d', '10000000-0000-4000-8000-000000000019', '30000000-0000-4000-8000-000000000002', '2026-09-14', 0.86, 0.87, 'COMPLETED', '2026-09-14 18:00:00'),
  ('72000000-0000-4000-8000-00000000005e', '10000000-0000-4000-8000-000000000019', '30000000-0000-4000-8000-000000000003', '2026-08-23', 0.87, 0.9, 'COMPLETED', '2026-08-23 18:00:00'),
  ('72000000-0000-4000-8000-00000000005f', '10000000-0000-4000-8000-000000000019', '30000000-0000-4000-8000-000000000004', '2026-07-11', 0.94, 0.96, 'COMPLETED', '2026-07-11 18:00:00'),
  ('72000000-0000-4000-8000-000000000060', '10000000-0000-4000-8000-000000000019', '30000000-0000-4000-8000-000000000001', '2026-06-18', 0.91, 0.91, 'COMPLETED', '2026-06-18 18:00:00'),
  ('72000000-0000-4000-8000-000000000061', '10000000-0000-4000-8000-00000000001a', '30000000-0000-4000-8000-000000000001', '2026-09-13', 0.81, 0.86, 'DELAYED', '2026-09-13 18:00:00'),
  ('72000000-0000-4000-8000-000000000062', '10000000-0000-4000-8000-00000000001a', '30000000-0000-4000-8000-000000000002', '2026-09-20', 0.8, 0.92, 'DELAYED', '2026-09-20 18:00:00'),
  ('72000000-0000-4000-8000-000000000063', '10000000-0000-4000-8000-00000000001a', '30000000-0000-4000-8000-000000000003', '2026-08-25', 0.83, 0.94, 'DELAYED', '2026-08-25 18:00:00'),
  ('72000000-0000-4000-8000-000000000064', '10000000-0000-4000-8000-00000000001a', '30000000-0000-4000-8000-000000000004', '2026-07-24', 0.85, 0.98, 'COMPLETED', '2026-07-24 18:00:00'),
  ('72000000-0000-4000-8000-000000000065', '10000000-0000-4000-8000-00000000001a', '30000000-0000-4000-8000-000000000001', '2026-06-19', 0.94, 0.87, 'COMPLETED', '2026-06-19 18:00:00'),
  ('72000000-0000-4000-8000-000000000066', '10000000-0000-4000-8000-00000000001b', '30000000-0000-4000-8000-000000000001', '2026-09-19', 0.95, 0.85, 'COMPLETED', '2026-09-19 18:00:00'),
  ('72000000-0000-4000-8000-000000000067', '10000000-0000-4000-8000-00000000001b', '30000000-0000-4000-8000-000000000002', '2026-09-17', 0.91, 0.9, 'COMPLETED', '2026-09-17 18:00:00'),
  ('72000000-0000-4000-8000-000000000068', '10000000-0000-4000-8000-00000000001b', '30000000-0000-4000-8000-000000000003', '2026-08-16', 0.94, 0.98, 'COMPLETED', '2026-08-16 18:00:00'),
  ('72000000-0000-4000-8000-000000000069', '10000000-0000-4000-8000-00000000001b', '30000000-0000-4000-8000-000000000004', '2026-07-22', 0.82, 0.91, 'DELAYED', '2026-07-22 18:00:00'),
  ('72000000-0000-4000-8000-00000000006a', '10000000-0000-4000-8000-00000000001c', '30000000-0000-4000-8000-000000000001', '2026-09-17', 0.92, 0.86, 'COMPLETED', '2026-09-17 18:00:00'),
  ('72000000-0000-4000-8000-00000000006b', '10000000-0000-4000-8000-00000000001c', '30000000-0000-4000-8000-000000000002', '2026-09-18', 0.93, 0.92, 'COMPLETED', '2026-09-18 18:00:00'),
  ('72000000-0000-4000-8000-00000000006c', '10000000-0000-4000-8000-00000000001c', '30000000-0000-4000-8000-000000000003', '2026-08-17', 0.92, 0.97, 'COMPLETED', '2026-08-17 18:00:00'),
  ('72000000-0000-4000-8000-00000000006d', '10000000-0000-4000-8000-00000000001d', '30000000-0000-4000-8000-000000000001', '2026-09-17', 0.86, 0.98, 'COMPLETED', '2026-09-17 18:00:00'),
  ('72000000-0000-4000-8000-00000000006e', '10000000-0000-4000-8000-00000000001d', '30000000-0000-4000-8000-000000000002', '2026-09-17', 0.95, 0.87, 'COMPLETED', '2026-09-17 18:00:00'),
  ('72000000-0000-4000-8000-00000000006f', '10000000-0000-4000-8000-00000000001d', '30000000-0000-4000-8000-000000000003', '2026-08-21', 0.94, 0.92, 'COMPLETED', '2026-08-21 18:00:00'),
  ('72000000-0000-4000-8000-000000000070', '10000000-0000-4000-8000-00000000001e', '30000000-0000-4000-8000-000000000001', '2026-09-17', 0.81, 0.91, 'DELAYED', '2026-09-17 18:00:00'),
  ('72000000-0000-4000-8000-000000000071', '10000000-0000-4000-8000-00000000001e', '30000000-0000-4000-8000-000000000002', '2026-09-19', 0.97, 0.89, 'COMPLETED', '2026-09-19 18:00:00'),
  ('72000000-0000-4000-8000-000000000072', '10000000-0000-4000-8000-00000000001e', '30000000-0000-4000-8000-000000000003', '2026-08-13', 0.89, 0.91, 'COMPLETED', '2026-08-13 18:00:00'),
  ('72000000-0000-4000-8000-000000000073', '10000000-0000-4000-8000-00000000001e', '30000000-0000-4000-8000-000000000004', '2026-07-12', 0.96, 0.9, 'COMPLETED', '2026-07-12 18:00:00'),
  ('72000000-0000-4000-8000-000000000074', '10000000-0000-4000-8000-00000000001f', '30000000-0000-4000-8000-000000000001', '2026-09-11', 0.89, 0.87, 'COMPLETED', '2026-09-11 18:00:00'),
  ('72000000-0000-4000-8000-000000000075', '10000000-0000-4000-8000-00000000001f', '30000000-0000-4000-8000-000000000002', '2026-09-16', 0.82, 0.91, 'DELAYED', '2026-09-16 18:00:00'),
  ('72000000-0000-4000-8000-000000000076', '10000000-0000-4000-8000-00000000001f', '30000000-0000-4000-8000-000000000003', '2026-08-20', 0.87, 0.95, 'COMPLETED', '2026-08-20 18:00:00'),
  ('72000000-0000-4000-8000-000000000077', '10000000-0000-4000-8000-00000000001f', '30000000-0000-4000-8000-000000000004', '2026-07-11', 0.92, 0.86, 'COMPLETED', '2026-07-11 18:00:00'),
  ('72000000-0000-4000-8000-000000000078', '10000000-0000-4000-8000-00000000001f', '30000000-0000-4000-8000-000000000001', '2026-06-12', 0.94, 0.97, 'COMPLETED', '2026-06-12 18:00:00'),
  ('72000000-0000-4000-8000-000000000079', '10000000-0000-4000-8000-000000000020', '30000000-0000-4000-8000-000000000001', '2026-09-18', 0.91, 0.89, 'COMPLETED', '2026-09-18 18:00:00'),
  ('72000000-0000-4000-8000-00000000007a', '10000000-0000-4000-8000-000000000020', '30000000-0000-4000-8000-000000000002', '2026-09-24', 0.87, 0.96, 'COMPLETED', '2026-09-24 18:00:00'),
  ('72000000-0000-4000-8000-00000000007b', '10000000-0000-4000-8000-000000000020', '30000000-0000-4000-8000-000000000003', '2026-08-23', 0.84, 0.92, 'DELAYED', '2026-08-23 18:00:00'),
  ('72000000-0000-4000-8000-00000000007c', '10000000-0000-4000-8000-000000000021', '30000000-0000-4000-8000-000000000001', '2026-09-13', 0.9, 0.93, 'COMPLETED', '2026-09-13 18:00:00'),
  ('72000000-0000-4000-8000-00000000007d', '10000000-0000-4000-8000-000000000021', '30000000-0000-4000-8000-000000000002', '2026-09-13', 0.81, 0.89, 'DELAYED', '2026-09-13 18:00:00'),
  ('72000000-0000-4000-8000-00000000007e', '10000000-0000-4000-8000-000000000021', '30000000-0000-4000-8000-000000000003', '2026-08-20', 0.8, 0.91, 'DELAYED', '2026-08-20 18:00:00'),
  ('72000000-0000-4000-8000-00000000007f', '10000000-0000-4000-8000-000000000021', '30000000-0000-4000-8000-000000000004', '2026-07-19', 0.89, 0.85, 'COMPLETED', '2026-07-19 18:00:00'),
  ('72000000-0000-4000-8000-000000000080', '10000000-0000-4000-8000-000000000021', '30000000-0000-4000-8000-000000000001', '2026-06-19', 0.85, 0.94, 'COMPLETED', '2026-06-19 18:00:00'),
  ('72000000-0000-4000-8000-000000000081', '10000000-0000-4000-8000-000000000022', '30000000-0000-4000-8000-000000000001', '2026-09-14', 0.91, 0.91, 'COMPLETED', '2026-09-14 18:00:00'),
  ('72000000-0000-4000-8000-000000000082', '10000000-0000-4000-8000-000000000022', '30000000-0000-4000-8000-000000000002', '2026-09-25', 0.93, 0.99, 'COMPLETED', '2026-09-25 18:00:00'),
  ('72000000-0000-4000-8000-000000000083', '10000000-0000-4000-8000-000000000022', '30000000-0000-4000-8000-000000000003', '2026-08-19', 0.86, 0.93, 'COMPLETED', '2026-08-19 18:00:00'),
  ('72000000-0000-4000-8000-000000000084', '10000000-0000-4000-8000-000000000022', '30000000-0000-4000-8000-000000000004', '2026-07-13', 0.89, 0.92, 'COMPLETED', '2026-07-13 18:00:00'),
  ('72000000-0000-4000-8000-000000000085', '10000000-0000-4000-8000-000000000022', '30000000-0000-4000-8000-000000000001', '2026-06-24', 0.97, 0.9, 'COMPLETED', '2026-06-24 18:00:00'),
  ('72000000-0000-4000-8000-000000000086', '10000000-0000-4000-8000-000000000023', '30000000-0000-4000-8000-000000000001', '2026-09-12', 0.82, 0.98, 'DELAYED', '2026-09-12 18:00:00'),
  ('72000000-0000-4000-8000-000000000087', '10000000-0000-4000-8000-000000000023', '30000000-0000-4000-8000-000000000002', '2026-09-19', 0.94, 0.9, 'COMPLETED', '2026-09-19 18:00:00'),
  ('72000000-0000-4000-8000-000000000088', '10000000-0000-4000-8000-000000000023', '30000000-0000-4000-8000-000000000003', '2026-08-14', 0.94, 0.96, 'COMPLETED', '2026-08-14 18:00:00'),
  ('72000000-0000-4000-8000-000000000089', '10000000-0000-4000-8000-000000000024', '30000000-0000-4000-8000-000000000001', '2026-09-12', 0.89, 0.98, 'COMPLETED', '2026-09-12 18:00:00'),
  ('72000000-0000-4000-8000-00000000008a', '10000000-0000-4000-8000-000000000024', '30000000-0000-4000-8000-000000000002', '2026-09-21', 0.85, 0.91, 'COMPLETED', '2026-09-21 18:00:00'),
  ('72000000-0000-4000-8000-00000000008b', '10000000-0000-4000-8000-000000000024', '30000000-0000-4000-8000-000000000003', '2026-08-23', 0.89, 0.99, 'COMPLETED', '2026-08-23 18:00:00'),
  ('72000000-0000-4000-8000-00000000008c', '10000000-0000-4000-8000-000000000024', '30000000-0000-4000-8000-000000000004', '2026-07-19', 0.86, 0.99, 'COMPLETED', '2026-07-19 18:00:00'),
  ('72000000-0000-4000-8000-00000000008d', '10000000-0000-4000-8000-000000000025', '30000000-0000-4000-8000-000000000001', '2026-09-17', 0.95, 0.9, 'COMPLETED', '2026-09-17 18:00:00'),
  ('72000000-0000-4000-8000-00000000008e', '10000000-0000-4000-8000-000000000025', '30000000-0000-4000-8000-000000000002', '2026-09-12', 0.93, 0.97, 'COMPLETED', '2026-09-12 18:00:00'),
  ('72000000-0000-4000-8000-00000000008f', '10000000-0000-4000-8000-000000000025', '30000000-0000-4000-8000-000000000003', '2026-08-20', 0.85, 0.97, 'COMPLETED', '2026-08-20 18:00:00'),
  ('72000000-0000-4000-8000-000000000090', '10000000-0000-4000-8000-000000000026', '30000000-0000-4000-8000-000000000001', '2026-09-11', 0.83, 0.88, 'DELAYED', '2026-09-11 18:00:00'),
  ('72000000-0000-4000-8000-000000000091', '10000000-0000-4000-8000-000000000026', '30000000-0000-4000-8000-000000000002', '2026-09-10', 0.87, 0.87, 'COMPLETED', '2026-09-10 18:00:00'),
  ('72000000-0000-4000-8000-000000000092', '10000000-0000-4000-8000-000000000026', '30000000-0000-4000-8000-000000000003', '2026-08-11', 0.93, 0.85, 'COMPLETED', '2026-08-11 18:00:00'),
  ('72000000-0000-4000-8000-000000000093', '10000000-0000-4000-8000-000000000027', '30000000-0000-4000-8000-000000000001', '2026-09-22', 0.83, 0.88, 'DELAYED', '2026-09-22 18:00:00'),
  ('72000000-0000-4000-8000-000000000094', '10000000-0000-4000-8000-000000000027', '30000000-0000-4000-8000-000000000002', '2026-09-15', 0.86, 0.94, 'COMPLETED', '2026-09-15 18:00:00'),
  ('72000000-0000-4000-8000-000000000095', '10000000-0000-4000-8000-000000000027', '30000000-0000-4000-8000-000000000003', '2026-08-25', 0.89, 0.94, 'COMPLETED', '2026-08-25 18:00:00'),
  ('72000000-0000-4000-8000-000000000096', '10000000-0000-4000-8000-000000000027', '30000000-0000-4000-8000-000000000004', '2026-07-23', 0.85, 0.87, 'COMPLETED', '2026-07-23 18:00:00'),
  ('72000000-0000-4000-8000-000000000097', '10000000-0000-4000-8000-000000000028', '30000000-0000-4000-8000-000000000001', '2026-09-10', 0.93, 0.86, 'COMPLETED', '2026-09-10 18:00:00'),
  ('72000000-0000-4000-8000-000000000098', '10000000-0000-4000-8000-000000000028', '30000000-0000-4000-8000-000000000002', '2026-09-18', 0.94, 0.92, 'COMPLETED', '2026-09-18 18:00:00'),
  ('72000000-0000-4000-8000-000000000099', '10000000-0000-4000-8000-000000000028', '30000000-0000-4000-8000-000000000003', '2026-08-14', 0.89, 0.9, 'COMPLETED', '2026-08-14 18:00:00'),
  ('72000000-0000-4000-8000-00000000009a', '10000000-0000-4000-8000-000000000028', '30000000-0000-4000-8000-000000000004', '2026-07-18', 0.83, 0.98, 'DELAYED', '2026-07-18 18:00:00')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 16. MANAGER FEEDBACK REVIEWS (37 records)
-- ----------------------------------------------------------------------------
INSERT INTO manager_feedback (id, employee_id, project_id, manager_name, rating, strengths, weaknesses, comments, created_at) VALUES
  ('c0000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000003', '30000000-0000-4000-8000-000000000003', 'Elena Rostova', 4, 'Devansh Sharma demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.', 'Needs occasional encouragement to document design decisions early in sprint.', 'Excellent contributions to project milestones. Highly recommended for future core initiatives.', '2026-09-30 16:00:00+00'),
  ('c0000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000004', '30000000-0000-4000-8000-000000000004', 'Marcus Vance', 4.9, 'Sarah Jenkins demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.', 'High risk of fatigue due to concurrent critical-path commitments; requires pacing.', 'Excellent contributions to project milestones. Highly recommended for future core initiatives.', '2026-09-30 16:00:00+00'),
  ('c0000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000005', '30000000-0000-4000-8000-000000000001', 'Elena Rostova', 4.2, 'Liam O''Connor demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.', 'Needs occasional encouragement to document design decisions early in sprint.', 'Excellent contributions to project milestones. Highly recommended for future core initiatives.', '2026-09-30 16:00:00+00'),
  ('c0000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000006', '30000000-0000-4000-8000-000000000002', 'Marcus Vance', 4.1, 'Priya Patel demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.', 'Needs occasional encouragement to document design decisions early in sprint.', 'Excellent contributions to project milestones. Highly recommended for future core initiatives.', '2026-09-30 16:00:00+00'),
  ('c0000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000007', '30000000-0000-4000-8000-000000000003', 'Elena Rostova', 4.7, 'Alex Chen demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.', 'Needs occasional encouragement to document design decisions early in sprint.', 'Excellent contributions to project milestones. Highly recommended for future core initiatives.', '2026-09-30 16:00:00+00'),
  ('c0000000-0000-4000-8000-000000000006', '10000000-0000-4000-8000-000000000008', '30000000-0000-4000-8000-000000000004', 'Marcus Vance', 3.9, 'Maya Lin demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.', 'Needs occasional encouragement to document design decisions early in sprint.', 'Excellent contributions to project milestones. Highly recommended for future core initiatives.', '2026-09-30 16:00:00+00'),
  ('c0000000-0000-4000-8000-000000000007', '10000000-0000-4000-8000-000000000009', '30000000-0000-4000-8000-000000000001', 'Elena Rostova', 4.2, 'Tariq Al-Mansoor demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.', 'Needs occasional encouragement to document design decisions early in sprint.', 'Excellent contributions to project milestones. Highly recommended for future core initiatives.', '2026-09-30 16:00:00+00'),
  ('c0000000-0000-4000-8000-000000000008', '10000000-0000-4000-8000-00000000000a', '30000000-0000-4000-8000-000000000002', 'Marcus Vance', 4.8, 'Chloe Dubois demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.', 'Needs occasional encouragement to document design decisions early in sprint.', 'Excellent contributions to project milestones. Highly recommended for future core initiatives.', '2026-09-30 16:00:00+00'),
  ('c0000000-0000-4000-8000-000000000009', '10000000-0000-4000-8000-00000000000c', '30000000-0000-4000-8000-000000000004', 'Marcus Vance', 4.5, 'Emily Watson demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.', 'Needs occasional encouragement to document design decisions early in sprint.', 'Excellent contributions to project milestones. Highly recommended for future core initiatives.', '2026-09-30 16:00:00+00'),
  ('c0000000-0000-4000-8000-00000000000a', '10000000-0000-4000-8000-00000000000d', '30000000-0000-4000-8000-000000000001', 'Elena Rostova', 4.8, 'Mateo Rossi demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.', 'Needs occasional encouragement to document design decisions early in sprint.', 'Excellent contributions to project milestones. Highly recommended for future core initiatives.', '2026-09-30 16:00:00+00'),
  ('c0000000-0000-4000-8000-00000000000b', '10000000-0000-4000-8000-00000000000e', '30000000-0000-4000-8000-000000000002', 'Marcus Vance', 4.8, 'Aisha Bello demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.', 'Needs occasional encouragement to document design decisions early in sprint.', 'Excellent contributions to project milestones. Highly recommended for future core initiatives.', '2026-09-30 16:00:00+00'),
  ('c0000000-0000-4000-8000-00000000000c', '10000000-0000-4000-8000-00000000000f', '30000000-0000-4000-8000-000000000003', 'Elena Rostova', 4.8, 'Kenji Sato demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.', 'Needs occasional encouragement to document design decisions early in sprint.', 'Excellent contributions to project milestones. Highly recommended for future core initiatives.', '2026-09-30 16:00:00+00'),
  ('c0000000-0000-4000-8000-00000000000d', '10000000-0000-4000-8000-000000000010', '30000000-0000-4000-8000-000000000004', 'Marcus Vance', 4.4, 'Sofia Gomez demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.', 'Needs occasional encouragement to document design decisions early in sprint.', 'Excellent contributions to project milestones. Highly recommended for future core initiatives.', '2026-09-30 16:00:00+00'),
  ('c0000000-0000-4000-8000-00000000000e', '10000000-0000-4000-8000-000000000011', '30000000-0000-4000-8000-000000000001', 'Elena Rostova', 4.4, 'David Kim demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.', 'Needs occasional encouragement to document design decisions early in sprint.', 'Excellent contributions to project milestones. Highly recommended for future core initiatives.', '2026-09-30 16:00:00+00'),
  ('c0000000-0000-4000-8000-00000000000f', '10000000-0000-4000-8000-000000000012', '30000000-0000-4000-8000-000000000002', 'Marcus Vance', 4.6, 'Rachel Green demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.', 'Needs occasional encouragement to document design decisions early in sprint.', 'Excellent contributions to project milestones. Highly recommended for future core initiatives.', '2026-09-30 16:00:00+00'),
  ('c0000000-0000-4000-8000-000000000010', '10000000-0000-4000-8000-000000000013', '30000000-0000-4000-8000-000000000003', 'Elena Rostova', 4.6, 'Jordan Taylor demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.', 'Needs occasional encouragement to document design decisions early in sprint.', 'Excellent contributions to project milestones. Highly recommended for future core initiatives.', '2026-09-30 16:00:00+00'),
  ('c0000000-0000-4000-8000-000000000011', '10000000-0000-4000-8000-000000000014', '30000000-0000-4000-8000-000000000004', 'Marcus Vance', 4.5, 'Hannah Abbott demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.', 'Needs occasional encouragement to document design decisions early in sprint.', 'Excellent contributions to project milestones. Highly recommended for future core initiatives.', '2026-09-30 16:00:00+00'),
  ('c0000000-0000-4000-8000-000000000012', '10000000-0000-4000-8000-000000000015', '30000000-0000-4000-8000-000000000001', 'Elena Rostova', 4.7, 'Gabriel Santos demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.', 'Needs occasional encouragement to document design decisions early in sprint.', 'Excellent contributions to project milestones. Highly recommended for future core initiatives.', '2026-09-30 16:00:00+00'),
  ('c0000000-0000-4000-8000-000000000013', '10000000-0000-4000-8000-000000000016', '30000000-0000-4000-8000-000000000002', 'Marcus Vance', 3.9, 'Zoe Kravitz demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.', 'Needs occasional encouragement to document design decisions early in sprint.', 'Excellent contributions to project milestones. Highly recommended for future core initiatives.', '2026-09-30 16:00:00+00'),
  ('c0000000-0000-4000-8000-000000000014', '10000000-0000-4000-8000-000000000017', '30000000-0000-4000-8000-000000000003', 'Elena Rostova', 4.6, 'Oliver Wright demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.', 'Needs occasional encouragement to document design decisions early in sprint.', 'Excellent contributions to project milestones. Highly recommended for future core initiatives.', '2026-09-30 16:00:00+00'),
  ('c0000000-0000-4000-8000-000000000015', '10000000-0000-4000-8000-000000000018', '30000000-0000-4000-8000-000000000004', 'Marcus Vance', 4.3, 'Nora Helmer demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.', 'Needs occasional encouragement to document design decisions early in sprint.', 'Excellent contributions to project milestones. Highly recommended for future core initiatives.', '2026-09-30 16:00:00+00'),
  ('c0000000-0000-4000-8000-000000000016', '10000000-0000-4000-8000-000000000019', '30000000-0000-4000-8000-000000000001', 'Elena Rostova', 4.9, 'Viktor Meyer demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.', 'Needs occasional encouragement to document design decisions early in sprint.', 'Excellent contributions to project milestones. Highly recommended for future core initiatives.', '2026-09-30 16:00:00+00'),
  ('c0000000-0000-4000-8000-000000000017', '10000000-0000-4000-8000-00000000001a', '30000000-0000-4000-8000-000000000002', 'Marcus Vance', 4.5, 'Fatima Zahra demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.', 'Needs occasional encouragement to document design decisions early in sprint.', 'Excellent contributions to project milestones. Highly recommended for future core initiatives.', '2026-09-30 16:00:00+00'),
  ('c0000000-0000-4000-8000-000000000018', '10000000-0000-4000-8000-00000000001b', '30000000-0000-4000-8000-000000000003', 'Elena Rostova', 4.5, 'Christian Bale demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.', 'Needs occasional encouragement to document design decisions early in sprint.', 'Excellent contributions to project milestones. Highly recommended for future core initiatives.', '2026-09-30 16:00:00+00'),
  ('c0000000-0000-4000-8000-000000000019', '10000000-0000-4000-8000-00000000001c', '30000000-0000-4000-8000-000000000004', 'Marcus Vance', 4.2, 'Ananya Roy demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.', 'Needs occasional encouragement to document design decisions early in sprint.', 'Excellent contributions to project milestones. Highly recommended for future core initiatives.', '2026-09-30 16:00:00+00'),
  ('c0000000-0000-4000-8000-00000000001a', '10000000-0000-4000-8000-00000000001d', '30000000-0000-4000-8000-000000000001', 'Elena Rostova', 4.8, 'Sean Murphy demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.', 'Needs occasional encouragement to document design decisions early in sprint.', 'Excellent contributions to project milestones. Highly recommended for future core initiatives.', '2026-09-30 16:00:00+00'),
  ('c0000000-0000-4000-8000-00000000001b', '10000000-0000-4000-8000-00000000001e', '30000000-0000-4000-8000-000000000002', 'Marcus Vance', 3.9, 'Carlos Vega demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.', 'Needs occasional encouragement to document design decisions early in sprint.', 'Excellent contributions to project milestones. Highly recommended for future core initiatives.', '2026-09-30 16:00:00+00'),
  ('c0000000-0000-4000-8000-00000000001c', '10000000-0000-4000-8000-00000000001f', '30000000-0000-4000-8000-000000000003', 'Elena Rostova', 4, 'Dr. Aris Thorne demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.', 'Needs occasional encouragement to document design decisions early in sprint.', 'Excellent contributions to project milestones. Highly recommended for future core initiatives.', '2026-09-30 16:00:00+00'),
  ('c0000000-0000-4000-8000-00000000001d', '10000000-0000-4000-8000-000000000020', '30000000-0000-4000-8000-000000000004', 'Marcus Vance', 4.7, 'Leila Mahmoud demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.', 'Needs occasional encouragement to document design decisions early in sprint.', 'Excellent contributions to project milestones. Highly recommended for future core initiatives.', '2026-09-30 16:00:00+00'),
  ('c0000000-0000-4000-8000-00000000001e', '10000000-0000-4000-8000-000000000021', '30000000-0000-4000-8000-000000000001', 'Elena Rostova', 4.1, 'Ethan Hunt demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.', 'Needs occasional encouragement to document design decisions early in sprint.', 'Excellent contributions to project milestones. Highly recommended for future core initiatives.', '2026-09-30 16:00:00+00'),
  ('c0000000-0000-4000-8000-00000000001f', '10000000-0000-4000-8000-000000000022', '30000000-0000-4000-8000-000000000002', 'Marcus Vance', 4, 'Nina Simone demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.', 'Needs occasional encouragement to document design decisions early in sprint.', 'Excellent contributions to project milestones. Highly recommended for future core initiatives.', '2026-09-30 16:00:00+00'),
  ('c0000000-0000-4000-8000-000000000020', '10000000-0000-4000-8000-000000000023', '30000000-0000-4000-8000-000000000003', 'Elena Rostova', 4, 'Kevin Bacon demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.', 'Needs occasional encouragement to document design decisions early in sprint.', 'Excellent contributions to project milestones. Highly recommended for future core initiatives.', '2026-09-30 16:00:00+00'),
  ('c0000000-0000-4000-8000-000000000021', '10000000-0000-4000-8000-000000000024', '30000000-0000-4000-8000-000000000004', 'Marcus Vance', 4.3, 'Mira Nair demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.', 'Needs occasional encouragement to document design decisions early in sprint.', 'Excellent contributions to project milestones. Highly recommended for future core initiatives.', '2026-09-30 16:00:00+00'),
  ('c0000000-0000-4000-8000-000000000022', '10000000-0000-4000-8000-000000000025', '30000000-0000-4000-8000-000000000001', 'Elena Rostova', 4.1, 'Travis Scott demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.', 'Needs occasional encouragement to document design decisions early in sprint.', 'Excellent contributions to project milestones. Highly recommended for future core initiatives.', '2026-09-30 16:00:00+00'),
  ('c0000000-0000-4000-8000-000000000023', '10000000-0000-4000-8000-000000000026', '30000000-0000-4000-8000-000000000002', 'Marcus Vance', 4, 'Megan Fox demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.', 'Needs occasional encouragement to document design decisions early in sprint.', 'Excellent contributions to project milestones. Highly recommended for future core initiatives.', '2026-09-30 16:00:00+00'),
  ('c0000000-0000-4000-8000-000000000024', '10000000-0000-4000-8000-000000000027', '30000000-0000-4000-8000-000000000003', 'Elena Rostova', 4.8, 'Samuel Jackson demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.', 'Needs occasional encouragement to document design decisions early in sprint.', 'Excellent contributions to project milestones. Highly recommended for future core initiatives.', '2026-09-30 16:00:00+00'),
  ('c0000000-0000-4000-8000-000000000025', '10000000-0000-4000-8000-000000000028', '30000000-0000-4000-8000-000000000004', 'Marcus Vance', 4.5, 'Jessica Alba demonstrated outstanding ownership, high code craftsmanship, and proactive cross-team communication.', 'Needs occasional encouragement to document design decisions early in sprint.', 'Excellent contributions to project milestones. Highly recommended for future core initiatives.', '2026-09-30 16:00:00+00')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 17. DECISION POLICY WEIGHTS (1 records)
-- ----------------------------------------------------------------------------
INSERT INTO decision_weights (id, fairness_weight, performance_weight, skill_weight, knowledge_weight, risk_weight, updated_at) VALUES
  ('29a9f570-7dd9-4dca-ad01-9ec7a3fc048f', 0.25, 0.3, 0.35, 0.15, 0.1, '2026-11-01 08:00:00')
ON CONFLICT (id) DO UPDATE SET
  fairness_weight = EXCLUDED.fairness_weight,
  performance_weight = EXCLUDED.performance_weight,
  skill_weight = EXCLUDED.skill_weight,
  knowledge_weight = EXCLUDED.knowledge_weight,
  risk_weight = EXCLUDED.risk_weight,
  updated_at = EXCLUDED.updated_at;

-- ----------------------------------------------------------------------------
-- 18. ALLOCATION DECISIONS (30 records)
-- ----------------------------------------------------------------------------
INSERT INTO allocation_decisions (id, project_id, employee_id, week_start_date, fairness_score, performance_score, final_score, created_at) VALUES
  ('d1000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '2026-03-02', 0.92, 0.95, 0.82, '2026-02-28 12:00:00'),
  ('d1000000-0000-4000-8000-000000000002', '30000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000004', '2026-03-02', 0.79, 0.96, 0.8, '2026-02-28 12:00:00'),
  ('d1000000-0000-4000-8000-000000000003', '30000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000007', '2026-03-02', 0.92, 0.92, 0.83, '2026-02-28 12:00:00'),
  ('d1000000-0000-4000-8000-000000000004', '30000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-00000000000a', '2026-03-02', 0.77, 0.93, 0.77, '2026-02-28 12:00:00'),
  ('d1000000-0000-4000-8000-000000000005', '30000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-00000000000d', '2026-03-02', 0.82, 0.92, 0.78, '2026-02-28 12:00:00'),
  ('d1000000-0000-4000-8000-000000000006', '30000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000010', '2026-03-02', 0.91, 0.89, 0.81, '2026-02-28 12:00:00'),
  ('d1000000-0000-4000-8000-000000000007', '30000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000013', '2026-03-02', 0.83, 0.94, 0.82, '2026-02-28 12:00:00'),
  ('d1000000-0000-4000-8000-000000000008', '30000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000016', '2026-03-02', 0.81, 0.84, 0.79, '2026-02-28 12:00:00'),
  ('d1000000-0000-4000-8000-000000000009', '30000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000019', '2026-03-02', 0.88, 0.92, 0.79, '2026-02-28 12:00:00'),
  ('d1000000-0000-4000-8000-00000000000a', '30000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-00000000001c', '2026-03-02', 0.95, 0.82, 0.78, '2026-02-28 12:00:00'),
  ('d1000000-0000-4000-8000-00000000000b', '30000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-00000000001f', '2026-03-02', 0.85, 0.97, 0.85, '2026-02-28 12:00:00'),
  ('d1000000-0000-4000-8000-00000000000c', '30000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000022', '2026-03-02', 0.96, 0.91, 0.85, '2026-02-28 12:00:00'),
  ('d1000000-0000-4000-8000-00000000000d', '30000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000025', '2026-03-02', 0.82, 0.84, 0.79, '2026-02-28 12:00:00'),
  ('d1000000-0000-4000-8000-00000000000e', '30000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000028', '2026-03-02', 0.79, 0.98, 0.82, '2026-02-28 12:00:00'),
  ('d1000000-0000-4000-8000-00000000000f', '30000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000003', '2026-03-02', 0.82, 0.95, 0.8, '2026-02-28 12:00:00'),
  ('d1000000-0000-4000-8000-000000000010', '30000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000006', '2026-03-02', 0.87, 0.98, 0.83, '2026-02-28 12:00:00'),
  ('d1000000-0000-4000-8000-000000000011', '30000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000009', '2026-03-02', 0.9, 0.93, 0.84, '2026-02-28 12:00:00'),
  ('d1000000-0000-4000-8000-000000000012', '30000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-00000000000c', '2026-03-02', 0.93, 0.93, 0.8, '2026-02-28 12:00:00'),
  ('d1000000-0000-4000-8000-000000000013', '30000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-00000000000f', '2026-03-02', 0.88, 0.96, 0.81, '2026-02-28 12:00:00'),
  ('d1000000-0000-4000-8000-000000000014', '30000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000012', '2026-03-02', 0.93, 0.98, 0.82, '2026-02-28 12:00:00'),
  ('d1000000-0000-4000-8000-000000000015', '30000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000015', '2026-03-02', 0.75, 0.99, 0.8, '2026-02-28 12:00:00'),
  ('d1000000-0000-4000-8000-000000000016', '30000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000018', '2026-03-02', 0.88, 0.98, 0.81, '2026-02-28 12:00:00'),
  ('d1000000-0000-4000-8000-000000000017', '30000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-00000000001b', '2026-03-02', 0.85, 0.91, 0.78, '2026-02-28 12:00:00'),
  ('d1000000-0000-4000-8000-000000000018', '30000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-00000000001e', '2026-03-02', 0.79, 0.93, 0.82, '2026-02-28 12:00:00'),
  ('d1000000-0000-4000-8000-000000000019', '30000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000021', '2026-03-02', 0.94, 0.96, 0.87, '2026-02-28 12:00:00'),
  ('d1000000-0000-4000-8000-00000000001a', '30000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000024', '2026-03-02', 0.95, 0.88, 0.81, '2026-02-28 12:00:00'),
  ('d1000000-0000-4000-8000-00000000001b', '30000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000027', '2026-03-02', 0.92, 0.81, 0.78, '2026-02-28 12:00:00'),
  ('d1000000-0000-4000-8000-00000000001c', '30000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000002', '2026-03-02', 0.96, 0.85, 0.8, '2026-02-28 12:00:00'),
  ('d1000000-0000-4000-8000-00000000001d', '30000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000005', '2026-03-02', 0.91, 0.81, 0.75, '2026-02-28 12:00:00'),
  ('d1000000-0000-4000-8000-00000000001e', '30000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000008', '2026-03-02', 0.92, 0.8, 0.76, '2026-02-28 12:00:00')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 19. DECISION EXPLAINABILITY LOGS (20 records)
-- ----------------------------------------------------------------------------
INSERT INTO decision_logs (id, employee_id, project_id, fairness, performance, skillscore, risk_score, confidence, final_score, explanation, created_at) VALUES
  ('a0000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', '30000000-0000-4000-8000-000000000001', 0.92, 0.95, 0.96, 0.05, 'MEDIUM', 0.82, 'Selected Elena Rostova for Apollo NextGen Core Platform. Skill proficiency matched 95% of demands with a balanced fairness coefficient of 0.92. Workload distribution verified.', '2026-02-28 12:05:00'),
  ('a0000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000004', '30000000-0000-4000-8000-000000000002', 0.79, 0.96, 0.9, 0.06, 'MEDIUM', 0.8, 'Selected Sarah Jenkins for Nova Financial Ledger Engine. Skill proficiency matched 95% of demands with a balanced fairness coefficient of 0.79. Workload distribution verified.', '2026-02-28 12:05:00'),
  ('a0000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000007', '30000000-0000-4000-8000-000000000003', 0.92, 0.92, 0.86, 0.11, 'MEDIUM', 0.83, 'Selected Alex Chen for Helios Mobile Banking App. Skill proficiency matched 95% of demands with a balanced fairness coefficient of 0.92. Workload distribution verified.', '2026-02-28 12:05:00'),
  ('a0000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-00000000000a', '30000000-0000-4000-8000-000000000004', 0.77, 0.93, 0.91, 0.2, 'MEDIUM', 0.77, 'Selected Chloe Dubois for Sentinel Real-Time Fraud Detector. Skill proficiency matched 95% of demands with a balanced fairness coefficient of 0.77. Workload distribution verified.', '2026-02-28 12:05:00'),
  ('a0000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-00000000000d', '30000000-0000-4000-8000-000000000001', 0.82, 0.92, 0.96, 0.24, 'MEDIUM', 0.78, 'Selected Mateo Rossi for Apollo NextGen Core Platform. Skill proficiency matched 95% of demands with a balanced fairness coefficient of 0.82. Workload distribution verified.', '2026-02-28 12:05:00'),
  ('a0000000-0000-4000-8000-000000000006', '10000000-0000-4000-8000-000000000010', '30000000-0000-4000-8000-000000000002', 0.91, 0.89, 0.93, 0.18, 'MEDIUM', 0.81, 'Selected Sofia Gomez for Nova Financial Ledger Engine. Skill proficiency matched 95% of demands with a balanced fairness coefficient of 0.91. Workload distribution verified.', '2026-02-28 12:05:00'),
  ('a0000000-0000-4000-8000-000000000007', '10000000-0000-4000-8000-000000000013', '30000000-0000-4000-8000-000000000003', 0.83, 0.94, 0.97, 0.25, 'MEDIUM', 0.82, 'Selected Jordan Taylor for Helios Mobile Banking App. Skill proficiency matched 95% of demands with a balanced fairness coefficient of 0.83. Workload distribution verified.', '2026-02-28 12:05:00'),
  ('a0000000-0000-4000-8000-000000000008', '10000000-0000-4000-8000-000000000016', '30000000-0000-4000-8000-000000000004', 0.81, 0.84, 0.88, 0.19, 'MEDIUM', 0.79, 'Selected Zoe Kravitz for Sentinel Real-Time Fraud Detector. Skill proficiency matched 95% of demands with a balanced fairness coefficient of 0.81. Workload distribution verified.', '2026-02-28 12:05:00'),
  ('a0000000-0000-4000-8000-000000000009', '10000000-0000-4000-8000-000000000019', '30000000-0000-4000-8000-000000000001', 0.88, 0.92, 0.98, 0.24, 'MEDIUM', 0.79, 'Selected Viktor Meyer for Apollo NextGen Core Platform. Skill proficiency matched 95% of demands with a balanced fairness coefficient of 0.88. Workload distribution verified.', '2026-02-28 12:05:00'),
  ('a0000000-0000-4000-8000-00000000000a', '10000000-0000-4000-8000-00000000001c', '30000000-0000-4000-8000-000000000002', 0.95, 0.82, 0.91, 0.08, 'MEDIUM', 0.78, 'Selected Ananya Roy for Nova Financial Ledger Engine. Skill proficiency matched 95% of demands with a balanced fairness coefficient of 0.95. Workload distribution verified.', '2026-02-28 12:05:00'),
  ('a0000000-0000-4000-8000-00000000000b', '10000000-0000-4000-8000-00000000001f', '30000000-0000-4000-8000-000000000003', 0.85, 0.97, 0.95, 0.11, 'MEDIUM', 0.85, 'Selected Dr. Aris Thorne for Helios Mobile Banking App. Skill proficiency matched 95% of demands with a balanced fairness coefficient of 0.85. Workload distribution verified.', '2026-02-28 12:05:00'),
  ('a0000000-0000-4000-8000-00000000000c', '10000000-0000-4000-8000-000000000022', '30000000-0000-4000-8000-000000000004', 0.96, 0.91, 0.86, 0.07, 'MEDIUM', 0.85, 'Selected Nina Simone for Sentinel Real-Time Fraud Detector. Skill proficiency matched 95% of demands with a balanced fairness coefficient of 0.96. Workload distribution verified.', '2026-02-28 12:05:00'),
  ('a0000000-0000-4000-8000-00000000000d', '10000000-0000-4000-8000-000000000025', '30000000-0000-4000-8000-000000000001', 0.82, 0.84, 0.96, 0.14, 'MEDIUM', 0.79, 'Selected Travis Scott for Apollo NextGen Core Platform. Skill proficiency matched 95% of demands with a balanced fairness coefficient of 0.82. Workload distribution verified.', '2026-02-28 12:05:00'),
  ('a0000000-0000-4000-8000-00000000000e', '10000000-0000-4000-8000-000000000028', '30000000-0000-4000-8000-000000000002', 0.79, 0.98, 0.97, 0.23, 'MEDIUM', 0.82, 'Selected Jessica Alba for Nova Financial Ledger Engine. Skill proficiency matched 95% of demands with a balanced fairness coefficient of 0.79. Workload distribution verified.', '2026-02-28 12:05:00'),
  ('a0000000-0000-4000-8000-00000000000f', '10000000-0000-4000-8000-000000000003', '30000000-0000-4000-8000-000000000003', 0.82, 0.95, 0.89, 0.08, 'MEDIUM', 0.8, 'Selected Devansh Sharma for Helios Mobile Banking App. Skill proficiency matched 95% of demands with a balanced fairness coefficient of 0.82. Workload distribution verified.', '2026-02-28 12:05:00'),
  ('a0000000-0000-4000-8000-000000000010', '10000000-0000-4000-8000-000000000006', '30000000-0000-4000-8000-000000000004', 0.87, 0.98, 0.91, 0.21, 'MEDIUM', 0.83, 'Selected Priya Patel for Sentinel Real-Time Fraud Detector. Skill proficiency matched 95% of demands with a balanced fairness coefficient of 0.87. Workload distribution verified.', '2026-02-28 12:05:00'),
  ('a0000000-0000-4000-8000-000000000011', '10000000-0000-4000-8000-000000000009', '30000000-0000-4000-8000-000000000001', 0.9, 0.93, 0.91, 0.25, 'MEDIUM', 0.84, 'Selected Tariq Al-Mansoor for Apollo NextGen Core Platform. Skill proficiency matched 95% of demands with a balanced fairness coefficient of 0.9. Workload distribution verified.', '2026-02-28 12:05:00'),
  ('a0000000-0000-4000-8000-000000000012', '10000000-0000-4000-8000-00000000000c', '30000000-0000-4000-8000-000000000002', 0.93, 0.93, 0.91, 0.24, 'MEDIUM', 0.8, 'Selected Emily Watson for Nova Financial Ledger Engine. Skill proficiency matched 95% of demands with a balanced fairness coefficient of 0.93. Workload distribution verified.', '2026-02-28 12:05:00'),
  ('a0000000-0000-4000-8000-000000000013', '10000000-0000-4000-8000-00000000000f', '30000000-0000-4000-8000-000000000003', 0.88, 0.96, 0.95, 0.23, 'MEDIUM', 0.81, 'Selected Kenji Sato for Helios Mobile Banking App. Skill proficiency matched 95% of demands with a balanced fairness coefficient of 0.88. Workload distribution verified.', '2026-02-28 12:05:00'),
  ('a0000000-0000-4000-8000-000000000014', '10000000-0000-4000-8000-000000000012', '30000000-0000-4000-8000-000000000004', 0.93, 0.98, 0.86, 0.2, 'MEDIUM', 0.82, 'Selected Rachel Green for Sentinel Real-Time Fraud Detector. Skill proficiency matched 95% of demands with a balanced fairness coefficient of 0.93. Workload distribution verified.', '2026-02-28 12:05:00')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 20. CLOSED-LOOP DECISION FEEDBACK (15 records)
-- ----------------------------------------------------------------------------
INSERT INTO decision_feedback (id, employee_id, project_id, allocation_id, outcome_score, success, actual_performance, expected_performance, deviation, created_at) VALUES
  ('d2000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000003', '30000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000001', 0.88, true, 0.88, 0.86, 0.02, '2026-04-15 10:00:00'),
  ('d2000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000005', '30000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000002', 0.9, true, 0.9, 0.86, 0.04, '2026-04-15 10:00:00'),
  ('d2000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-00000000001a', '30000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000003', 0.95, true, 0.95, 0.93, 0.02, '2026-04-15 10:00:00'),
  ('d2000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000004', '30000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000004', 0.84, true, 0.84, 0.9, -0.06, '2026-04-15 10:00:00'),
  ('d2000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000004', '30000000-0000-4000-8000-000000000006', '50000000-0000-4000-8000-000000000005', 0.86, true, 0.86, 0.92, -0.06, '2026-04-15 10:00:00'),
  ('d2000000-0000-4000-8000-000000000006', '10000000-0000-4000-8000-000000000019', '30000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000006', 0.88, true, 0.88, 0.88, 0, '2026-04-15 10:00:00'),
  ('d2000000-0000-4000-8000-000000000007', '10000000-0000-4000-8000-000000000019', '30000000-0000-4000-8000-000000000002', '50000000-0000-4000-8000-000000000007', 0.86, true, 0.86, 0.87, -0.01, '2026-04-15 10:00:00'),
  ('d2000000-0000-4000-8000-000000000008', '10000000-0000-4000-8000-000000000006', '30000000-0000-4000-8000-000000000002', '50000000-0000-4000-8000-000000000008', 0.87, true, 0.87, 0.85, 0.02, '2026-04-15 10:00:00'),
  ('d2000000-0000-4000-8000-000000000009', '10000000-0000-4000-8000-000000000008', '30000000-0000-4000-8000-000000000002', '50000000-0000-4000-8000-000000000009', 0.94, true, 0.94, 0.94, 0, '2026-04-15 10:00:00'),
  ('d2000000-0000-4000-8000-00000000000a', '10000000-0000-4000-8000-000000000014', '30000000-0000-4000-8000-000000000002', '50000000-0000-4000-8000-00000000000a', 0.97, true, 0.97, 0.92, 0.05, '2026-04-15 10:00:00'),
  ('d2000000-0000-4000-8000-00000000000b', '10000000-0000-4000-8000-000000000007', '30000000-0000-4000-8000-000000000003', '50000000-0000-4000-8000-00000000000b', 0.84, true, 0.84, 0.94, -0.1, '2026-04-15 10:00:00'),
  ('d2000000-0000-4000-8000-00000000000c', '10000000-0000-4000-8000-00000000000f', '30000000-0000-4000-8000-000000000003', '50000000-0000-4000-8000-00000000000c', 0.95, true, 0.95, 0.86, 0.09, '2026-04-15 10:00:00'),
  ('d2000000-0000-4000-8000-00000000000d', '10000000-0000-4000-8000-000000000026', '30000000-0000-4000-8000-000000000003', '50000000-0000-4000-8000-00000000000d', 0.89, true, 0.89, 0.93, -0.04, '2026-04-15 10:00:00'),
  ('d2000000-0000-4000-8000-00000000000e', '10000000-0000-4000-8000-00000000001f', '30000000-0000-4000-8000-000000000004', '50000000-0000-4000-8000-00000000000e', 0.84, true, 0.84, 0.87, -0.03, '2026-04-15 10:00:00'),
  ('d2000000-0000-4000-8000-00000000000f', '10000000-0000-4000-8000-000000000020', '30000000-0000-4000-8000-000000000004', '50000000-0000-4000-8000-00000000000f', 0.84, true, 0.84, 0.87, -0.03, '2026-04-15 10:00:00')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 21. OPERATIONAL & CAPACITY ALERTS (5 records)
-- ----------------------------------------------------------------------------
INSERT INTO alerts (id, type, message, severity, employee_id, project_id, created_at) VALUES
  ('b0000000-0000-4000-8000-000000000001', 'CAPACITY_EXCEEDED', 'Capacity exceeded: Sarah Jenkins is allocated 50h/40h (125% capacity) across Apollo Core Platform (30h) and Orion Design System (20h). High burnout probability (0.88).', 'CRITICAL', '10000000-0000-4000-8000-000000000004', '30000000-0000-4000-8000-000000000001', '2026-02-05 09:00:00'),
  ('b0000000-0000-4000-8000-000000000002', 'CAPACITY_EXCEEDED', 'Capacity exceeded: Viktor Meyer is allocated 50h/40h (125% capacity) across Apollo Core Platform (30h) and Nova Financial Ledger (20h). High fatigue risk (0.84).', 'CRITICAL', '10000000-0000-4000-8000-000000000019', '30000000-0000-4000-8000-000000000002', '2026-02-18 10:30:00'),
  ('b0000000-0000-4000-8000-000000000003', 'STAFFING_GAP', 'Staffing gap detected for project Pulse IoT Telemetry Pipeline: 2 unfilled slots for High-throughput Go/IoT Engineer. Recommend initiating external contracting.', 'WARNING', NULL, '30000000-0000-4000-8000-000000000005', '2026-10-22 14:15:00'),
  ('b0000000-0000-4000-8000-000000000004', 'CAPACITY_WARNING', 'Approaching capacity limit: Fatima Zahra is committed at 40h/40h (100% capacity) on Apollo NextGen Core Platform. Any additional shift will trigger overload.', 'WARNING', '10000000-0000-4000-8000-00000000001a', '30000000-0000-4000-8000-000000000001', '2026-02-01 11:00:00'),
  ('b0000000-0000-4000-8000-000000000005', 'BURNOUT_RISK', 'Predictive alert: Sarah Jenkins shows cognitive fatigue signal (burnout risk > 0.85) resulting from consecutive weeks with >45 hours logged.', 'CRITICAL', '10000000-0000-4000-8000-000000000004', '30000000-0000-4000-8000-000000000006', '2026-02-20 15:45:00')
ON CONFLICT (id) DO NOTHING;

COMMIT;
