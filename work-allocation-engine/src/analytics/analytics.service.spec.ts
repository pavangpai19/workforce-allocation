import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { SupabaseService } from '../supabase/supabase.service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;
  let mockSupabaseService: any;
  let mockClient: any;

  beforeEach(async () => {
    mockClient = {
      from: jest.fn(),
    };

    mockSupabaseService = {
      getClient: jest.fn().mockReturnValue(mockClient),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDashboardMetrics', () => {
    it('should aggregate active projects, allocations, proposals, and workforce utilization', async () => {
      const mockProjects = [{ id: 'proj-1', status: 'ACTIVE' }, { id: 'proj-2', status: 'IN_PROGRESS' }];
      const mockAllocations = [
        { id: 'alloc-1', allocated_hours_per_week: 30, status: 'ACTIVE' },
        { id: 'alloc-2', allocated_hours_per_week: 40, status: 'ACTIVE' },
      ];
      const mockProposals = [{ id: 'prop-1', status: 'PENDING_APPROVAL' }];
      const mockAlerts = [{ id: 'alert-1', status: 'ACTIVE' }];
      const mockEmployees = [
        { id: 'emp-1', weekly_capacity_hours: 40, max_capacity_hours: 40 },
        { id: 'emp-2', weekly_capacity_hours: 40, max_capacity_hours: 40 },
      ];

      mockClient.from.mockImplementation((tableName: string) => {
        if (tableName === 'projects') {
          return {
            select: jest.fn().mockResolvedValue({ data: mockProjects, count: 2, error: null }),
          };
        }
        if (tableName === 'allocations') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({ data: mockAllocations, count: 2, error: null }),
            }),
          };
        }
        if (tableName === 'allocation_proposals') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({ data: mockProposals, count: 1, error: null }),
            }),
          };
        }
        if (tableName === 'alerts') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({ data: mockAlerts, count: 1, error: null }),
            }),
          };
        }
        if (tableName === 'employees') {
          return {
            select: jest.fn().mockResolvedValue({ data: mockEmployees, error: null }),
          };
        }
        return {};
      });

      const metrics = await service.getDashboardMetrics();

      expect(metrics.active_projects_count).toBe(2);
      expect(metrics.active_allocations_count).toBe(2);
      expect(metrics.pending_proposals_count).toBe(1);
      expect(metrics.active_alerts_count).toBe(1);
      expect(metrics.total_allocated_hours).toBe(70);
      expect(metrics.total_workforce_capacity_hours).toBe(80);
      expect(metrics.average_allocation_utilization).toBe(0.875);
    });
  });

  describe('getProjectAnalytics', () => {
    const projectId = '8f43c3d5-263a-4467-8cfb-6f81e3a6a901';

    it('should return staffing coverage and team performance analytics', async () => {
      const mockProject = { id: projectId, name: 'Cloud Infrastructure' };
      const mockRequirements = [
        {
          id: 'req-1',
          project_id: projectId,
          required_role: 'Lead Architect',
          required_headcount: 1,
          skills: { id: 'sk-arch', name: 'Architecture' },
        },
        {
          id: 'req-2',
          project_id: projectId,
          required_role: 'Cloud Engineer',
          required_headcount: 2,
          skills: { id: 'sk-gcp', name: 'GCP' },
        },
      ];

      const mockAllocations = [
        {
          id: 'alloc-1',
          project_id: projectId,
          employee_id: 'emp-1',
          assigned_role: 'Lead Architect',
          allocated_hours_per_week: 40,
          employees: { name: 'Alice', role: 'Architect' },
        },
        {
          id: 'alloc-2',
          project_id: projectId,
          employee_id: 'emp-2',
          assigned_role: 'Cloud Engineer',
          allocated_hours_per_week: 40,
          employees: { name: 'Bob', role: 'Cloud Engineer' },
        },
      ];

      mockClient.from.mockImplementation((tableName: string) => {
        if (tableName === 'projects') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: mockProject, error: null }),
              }),
            }),
          };
        }
        if (tableName === 'project_staffing_requirements') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({ data: mockRequirements, error: null }),
            }),
          };
        }
        if (tableName === 'allocations') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                eq: jest.fn().mockResolvedValue({ data: mockAllocations, error: null }),
              }),
            }),
          };
        }
        if (tableName === 'allocation_proposals') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                order: jest.fn().mockReturnValue({
                  limit: jest.fn().mockResolvedValue({ data: [], error: null }),
                }),
              }),
            }),
          };
        }
        return {};
      });

      const analytics = await service.getProjectAnalytics(projectId);

      expect(analytics.project_name).toBe('Cloud Infrastructure');
      expect(analytics.required_headcount).toBe(3);
      expect(analytics.allocated_headcount).toBe(2);
      expect(analytics.staffing_coverage_percentage).toBe(66.67);
      expect(analytics.staffing_status).toBe('PARTIALLY_STAFFED');
      expect(analytics.team_members).toHaveLength(2);
    });

    it('should throw NotFoundException if project is missing', async () => {
      mockClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: true }),
          }),
        }),
      });

      await expect(service.getProjectAnalytics(projectId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getEmployeeWorkload', () => {
    const employeeId = '8f43c3d5-263a-4467-8cfb-6f81e3a6a901';

    it('should calculate employee utilization and capacity breakdown', async () => {
      const mockEmployee = {
        id: employeeId,
        name: 'Charlie Brown',
        role: 'Full Stack Dev',
        department: 'Engineering',
        weekly_capacity_hours: 40,
        max_capacity_hours: 40,
      };

      const mockAllocations = [
        {
          id: 'alloc-1',
          project_id: 'proj-1',
          allocated_hours_per_week: 20,
          projects: { name: 'Proj 1' },
        },
        {
          id: 'alloc-2',
          project_id: 'proj-2',
          allocated_hours_per_week: 15,
          projects: { name: 'Proj 2' },
        },
      ];

      mockClient.from.mockImplementation((tableName: string) => {
        if (tableName === 'employees') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: mockEmployee, error: null }),
              }),
            }),
          };
        }
        if (tableName === 'allocations') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                eq: jest.fn().mockResolvedValue({ data: mockAllocations, error: null }),
              }),
            }),
          };
        }
        return {};
      });

      const workload = await service.getEmployeeWorkload(employeeId);

      expect(workload.employee_name).toBe('Charlie Brown');
      expect(workload.total_allocated_hours).toBe(35);
      expect(workload.remaining_capacity_hours).toBe(5);
      expect(workload.utilization_percentage).toBe(87.5);
      expect(workload.workload_status).toBe('OPTIMAL');
      expect(workload.active_allocations_count).toBe(2);
    });

    it('should enforce role check for employee viewing other workloads', async () => {
      const user = { employeeId: 'other-emp', role: 'EMPLOYEE' };
      await expect(service.getEmployeeWorkload(employeeId, user)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('getAllocationTrends', () => {
    it('should group allocations into time-series buckets', async () => {
      const mockAllocations = [
        { id: 'alloc-1', status: 'ACTIVE', created_at: '2026-09-01T10:00:00Z' },
        { id: 'alloc-2', status: 'WORK_COMPLETED', created_at: '2026-09-10T10:00:00Z', actual_end_date: '2026-09-15' },
        { id: 'alloc-3', status: 'RELEASED', created_at: '2026-08-01T10:00:00Z', released_at: '2026-08-20' },
      ];

      mockClient.from.mockReturnValue({
        select: jest.fn().mockResolvedValue({ data: mockAllocations, error: null }),
      });

      const result = await service.getAllocationTrends();

      expect(result.total_new_allocations).toBe(3);
      expect(result.trends).toHaveLength(2); // 2026-08 and 2026-09
    });
  });

  describe('getSkillDemandAnalysis', () => {
    it('should aggregate demand and rank skills', async () => {
      const mockRequirements = [
        {
          id: 'req-1',
          skill_id: 'sk-rust',
          required_role: 'Rust Developer',
          required_headcount: 2,
          allocation_hours_per_week: 40,
          skills: { id: 'sk-rust', name: 'Rust' },
          project_id: 'p-1',
          projects: { name: 'High Perf Engine' },
        },
        {
          id: 'req-2',
          skill_id: 'sk-rust',
          required_role: 'Rust Developer',
          required_headcount: 3,
          allocation_hours_per_week: 40,
          skills: { id: 'sk-rust', name: 'Rust' },
          project_id: 'p-2',
          projects: { name: 'Crypto Core' },
        },
      ];

      const mockEmployeeSkills = [{ skill_id: 'sk-rust', employee_id: 'emp-1' }];

      mockClient.from.mockImplementation((tableName: string) => {
        if (tableName === 'project_staffing_requirements') {
          return {
            select: jest.fn().mockResolvedValue({ data: mockRequirements, error: null }),
          };
        }
        if (tableName === 'employee_skills') {
          return {
            select: jest.fn().mockResolvedValue({ data: mockEmployeeSkills, error: null }),
          };
        }
        return {};
      });

      const demand = await service.getSkillDemandAnalysis();

      expect(demand).toHaveLength(1);
      expect(demand[0].skill_name).toBe('Rust');
      expect(demand[0].demanded_headcount).toBe(5);
      expect(demand[0].project_count).toBe(2);
      expect(demand[0].available_supply_count).toBe(1);
      expect(demand[0].supply_deficit).toBe(4);
    });
  });
});
