import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { SupabaseService } from '../supabase/supabase.service';
import { AlertStatus, AlertType } from './dto/create-alert.dto';

describe('AlertsService', () => {
  let service: AlertsService;
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
        AlertsService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
      ],
    }).compile();

    service = module.get<AlertsService>(AlertsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkCapacityAlerts', () => {
    const employeeId = '8f43c3d5-263a-4467-8cfb-6f81e3a6a901';

    it('should create CAPACITY_EXCEEDED alert if workload > 100%', async () => {
      const mockEmployee = {
        id: employeeId,
        name: 'John Doe',
        weekly_capacity_hours: 40,
        max_capacity_hours: 40,
        current_workload_hours: 48,
      };

      const mockAllocations = [
        { allocated_hours_per_week: 28, status: 'ACTIVE' },
        { allocated_hours_per_week: 20, status: 'ACTIVE' },
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
        if (tableName === 'alerts') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                  eq: jest.fn().mockResolvedValue({ data: [], error: null }),
                }),
              }),
            }),
            insert: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: {
                    id: 'alert-1',
                    type: AlertType.CAPACITY_EXCEEDED,
                    employee_id: employeeId,
                  },
                  error: null,
                }),
              }),
            }),
          };
        }
        return {};
      });

      const result = await service.checkCapacityAlerts(employeeId);

      expect(result.has_alert).toBe(true);
      expect(result.alert_type).toBe(AlertType.CAPACITY_EXCEEDED);
      expect(result.total_allocated_hours).toBe(48);
      expect(result.utilization_percentage).toBe(120);
    });

    it('should create CAPACITY_WARNING alert if workload is between 90% and 100%', async () => {
      const mockEmployee = {
        id: employeeId,
        name: 'Jane Doe',
        weekly_capacity_hours: 40,
        max_capacity_hours: 40,
        current_workload_hours: 38,
      };

      const mockAllocations = [
        { allocated_hours_per_week: 38, status: 'ACTIVE' },
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
        if (tableName === 'alerts') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                  eq: jest.fn().mockResolvedValue({ data: [], error: null }),
                }),
              }),
            }),
            insert: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: {
                    id: 'alert-2',
                    type: AlertType.CAPACITY_WARNING,
                    employee_id: employeeId,
                  },
                  error: null,
                }),
              }),
            }),
          };
        }
        return {};
      });

      const result = await service.checkCapacityAlerts(employeeId);

      expect(result.has_alert).toBe(true);
      expect(result.alert_type).toBe(AlertType.CAPACITY_WARNING);
      expect(result.total_allocated_hours).toBe(38);
      expect(result.utilization_percentage).toBe(95);
    });

    it('should throw NotFoundException if employee does not exist', async () => {
      mockClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: true }),
          }),
        }),
      });

      await expect(service.checkCapacityAlerts(employeeId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('checkStaffingGapAlerts', () => {
    const projectId = '8f43c3d5-263a-4467-8cfb-6f81e3a6a901';

    it('should detect staffing gaps and create STAFFING_GAP alerts', async () => {
      const mockProject = { id: projectId, name: 'Project Titan' };
      const mockRequirements = [
        {
          id: 'req-1',
          project_id: projectId,
          required_role: 'Full Stack Engineer',
          required_headcount: 3,
          skills: { id: 'sk-1', name: 'React' },
        },
      ];
      const mockAllocations = [
        {
          id: 'alloc-1',
          staffing_requirement_id: 'req-1',
          assigned_role: 'Full Stack Engineer',
          status: 'ACTIVE',
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
        if (tableName === 'alerts') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                  eq: jest.fn().mockReturnValue({
                    eq: jest.fn().mockResolvedValue({ data: [], error: null }),
                  }),
                }),
              }),
            }),
            insert: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: { id: 'alert-gap-1', type: AlertType.STAFFING_GAP },
                  error: null,
                }),
              }),
            }),
          };
        }
        return {};
      });

      const result = await service.checkStaffingGapAlerts(projectId);

      expect(result.requirements_with_gaps_count).toBe(1);
      expect(result.gaps[0].gap).toBe(2);
      expect(result.gaps[0].filled_headcount).toBe(1);
      expect(result.gaps[0].required_headcount).toBe(3);
    });
  });

  describe('checkHiringSignals', () => {
    it('should aggregate staffing gaps and trigger HIRING_NEEDED for persistent gaps (>3 projects)', async () => {
      const mockRequirements = [
        {
          id: 'req-1',
          project_id: 'proj-1',
          required_role: 'Backend Go Engineer',
          required_headcount: 2,
          skill_id: 'sk-go',
          skills: { id: 'sk-go', name: 'Golang' },
          projects: { id: 'proj-1', name: 'Proj 1', status: 'ACTIVE' },
        },
        {
          id: 'req-2',
          project_id: 'proj-2',
          required_role: 'Backend Go Engineer',
          required_headcount: 1,
          skill_id: 'sk-go',
          skills: { id: 'sk-go', name: 'Golang' },
          projects: { id: 'proj-2', name: 'Proj 2', status: 'ACTIVE' },
        },
        {
          id: 'req-3',
          project_id: 'proj-3',
          required_role: 'Backend Go Engineer',
          required_headcount: 2,
          skill_id: 'sk-go',
          skills: { id: 'sk-go', name: 'Golang' },
          projects: { id: 'proj-3', name: 'Proj 3', status: 'ACTIVE' },
        },
      ];

      mockClient.from.mockImplementation((tableName: string) => {
        if (tableName === 'project_staffing_requirements') {
          return {
            select: jest.fn().mockResolvedValue({ data: mockRequirements, error: null }),
          };
        }
        if (tableName === 'allocations') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({ data: [], error: null }),
            }),
          };
        }
        if (tableName === 'alerts') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                eq: jest.fn().mockResolvedValue({ data: [], error: null }),
              }),
            }),
            insert: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: { id: 'hiring-alert-1', type: AlertType.HIRING_NEEDED },
                  error: null,
                }),
              }),
            }),
          };
        }
        return {};
      });

      const result = await service.checkHiringSignals();

      expect(result.persistent_hiring_signals_count).toBe(1);
      expect(result.signals[0].skill_name).toBe('Golang');
      expect(result.signals[0].affected_projects_count).toBe(3);
      expect(result.signals[0].hiring_signal).toBe('HIRING_NEEDED');
      expect(result.signals[0].total_headcount_gap).toBe(5);
    });
  });

  describe('dismissAlert', () => {
    it('should dismiss active alert with manager info and reason', async () => {
      const alertId = '8f43c3d5-263a-4467-8cfb-6f81e3a6a901';
      const existingAlert = {
        id: alertId,
        status: AlertStatus.ACTIVE,
        type: AlertType.CAPACITY_WARNING,
      };

      const dismissedAlert = {
        ...existingAlert,
        status: AlertStatus.DISMISSED,
        dismissed_by: 'mgr-1',
        dismissal_reason: 'Resolved by offloading tasks',
      };

      mockClient.from.mockImplementation((tableName: string) => {
        if (tableName === 'alerts') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: existingAlert, error: null }),
              }),
            }),
            update: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                select: jest.fn().mockReturnValue({
                  single: jest.fn().mockResolvedValue({ data: dismissedAlert, error: null }),
                }),
              }),
            }),
          };
        }
        return {};
      });

      const result = await service.dismissAlert(
        alertId,
        'mgr-1',
        'Resolved by offloading tasks',
      );

      expect(result.status).toBe(AlertStatus.DISMISSED);
      expect(result.dismissal_reason).toBe('Resolved by offloading tasks');
    });
  });
});
