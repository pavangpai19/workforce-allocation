import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ReleaseService } from './release.service';
import { SupabaseService } from '../../supabase/supabase.service';

describe('ReleaseService', () => {
  let service: ReleaseService;
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
        ReleaseService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
      ],
    }).compile();

    service = module.get<ReleaseService>(ReleaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('reportWorkCompletion', () => {
    const allocationId = '8f43c3d5-263a-4467-8cfb-6f81e3a6a901';
    const employeeId = 'emp-uuid-101';
    const projectId = 'proj-uuid-201';

    it('should successfully report work completion for an active allocation', async () => {
      const activeAllocation = {
        id: allocationId,
        employee_id: employeeId,
        project_id: projectId,
        status: 'ACTIVE',
        allocated_hours_per_week: 40,
        employees: { id: employeeId, name: 'Alice Smith', email: 'alice@example.com' },
        projects: { id: projectId, name: 'Cloud Migration' },
      };

      const updatedAllocation = {
        ...activeAllocation,
        status: 'WORK_COMPLETED',
        actual_end_date: new Date().toISOString().split('T')[0],
      };

      mockClient.from.mockImplementation((tableName: string) => {
        if (tableName === 'allocations') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: activeAllocation, error: null }),
              }),
            }),
            update: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                select: jest.fn().mockReturnValue({
                  single: jest.fn().mockResolvedValue({ data: updatedAllocation, error: null }),
                }),
              }),
            }),
          };
        }
        if (tableName === 'decision_logs' || tableName === 'allocation_decisions') {
          return {
            insert: jest.fn().mockResolvedValue({ error: null }),
          };
        }
        return {};
      });

      const dto = {
        notes: 'Frontend modules completed and verified',
        deliverables_summary: 'PR #42 merged',
        actual_hours_spent: 38,
      };

      const result = await service.reportWorkCompletion(allocationId, employeeId, dto);

      expect(result.status).toBe('WORK_COMPLETED');
      expect(result.actual_end_date).toBeDefined();
      expect(mockClient.from).toHaveBeenCalledWith('allocations');
    });

    it('should throw NotFoundException if allocation does not exist', async () => {
      mockClient.from.mockImplementation(() => ({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
          }),
        }),
      }));

      await expect(
        service.reportWorkCompletion(allocationId, employeeId, {}),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if allocation is not ACTIVE', async () => {
      mockClient.from.mockImplementation(() => ({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: {
                id: allocationId,
                employee_id: employeeId,
                status: 'WORK_COMPLETED',
              },
              error: null,
            }),
          }),
        }),
      }));

      await expect(
        service.reportWorkCompletion(allocationId, employeeId, {}),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw ForbiddenException if reporting employee is not the assigned employee', async () => {
      mockClient.from.mockImplementation(() => ({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: {
                id: allocationId,
                employee_id: employeeId,
                status: 'ACTIVE',
              },
              error: null,
            }),
          }),
        }),
      }));

      await expect(
        service.reportWorkCompletion(allocationId, 'wrong-emp-id', {}),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('reviewCompletion', () => {
    const allocationId = '8f43c3d5-263a-4467-8cfb-6f81e3a6a901';
    const managerId = 'mgr-uuid-001';
    const projectId = 'proj-uuid-201';

    it('should successfully review completed allocation and transition to AWAITING_RELEASE_CONFIRMATION', async () => {
      const completedAllocation = {
        id: allocationId,
        employee_id: 'emp-uuid-101',
        project_id: projectId,
        status: 'WORK_COMPLETED',
        employees: { id: 'emp-uuid-101', name: 'Alice Smith' },
        projects: { id: projectId, name: 'Cloud Migration', manager_id: managerId },
      };

      const awaitingReleaseAllocation = {
        ...completedAllocation,
        status: 'AWAITING_RELEASE_CONFIRMATION',
      };

      mockClient.from.mockImplementation((tableName: string) => {
        if (tableName === 'allocations') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: completedAllocation, error: null }),
              }),
            }),
            update: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                select: jest.fn().mockReturnValue({
                  single: jest.fn().mockResolvedValue({
                    data: awaitingReleaseAllocation,
                    error: null,
                  }),
                }),
              }),
            }),
          };
        }
        if (tableName === 'projects') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: { id: projectId, manager_id: managerId },
                  error: null,
                }),
              }),
            }),
          };
        }
        if (tableName === 'employees') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: { id: managerId, role: 'MANAGER' },
                  error: null,
                }),
              }),
            }),
          };
        }
        if (tableName === 'allocation_decisions') {
          return {
            insert: jest.fn().mockResolvedValue({ error: null }),
          };
        }
        return {};
      });

      const dto = {
        review_notes: 'All deliverables met quality criteria',
        performance_feedback: 'Excellent execution',
      };

      const result = await service.reviewCompletion(allocationId, managerId, dto);

      expect(result.status).toBe('AWAITING_RELEASE_CONFIRMATION');
      expect(result.review_status).toBe('AWAITING_RELEASE_CONFIRMATION');
      expect(result.reviewed_by).toBe(managerId);
    });

    it('should throw BadRequestException if allocation status is not WORK_COMPLETED', async () => {
      mockClient.from.mockImplementation(() => ({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: {
                id: allocationId,
                status: 'ACTIVE',
                project_id: projectId,
              },
              error: null,
            }),
          }),
        }),
      }));

      await expect(
        service.reviewCompletion(allocationId, managerId, {}),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('confirmRelease', () => {
    const allocationId = '8f43c3d5-263a-4467-8cfb-6f81e3a6a901';
    const managerId = 'mgr-uuid-001';
    const employeeId = 'emp-uuid-101';
    const projectId = 'proj-uuid-201';

    it('should successfully confirm release and decrement employee workload hours', async () => {
      const awaitingAllocation = {
        id: allocationId,
        employee_id: employeeId,
        project_id: projectId,
        status: 'AWAITING_RELEASE_CONFIRMATION',
        allocated_hours_per_week: 20,
        employees: {
          id: employeeId,
          name: 'Alice Smith',
          current_workload_hours: 40,
          weekly_capacity_hours: 40,
        },
        projects: { id: projectId, name: 'Cloud Migration' },
      };

      const releasedAllocation = {
        ...awaitingAllocation,
        status: 'RELEASED',
        released_at: new Date().toISOString(),
      };

      let updatedWorkload: number | null = null;

      mockClient.from.mockImplementation((tableName: string) => {
        if (tableName === 'allocations') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: awaitingAllocation, error: null }),
              }),
            }),
            update: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                select: jest.fn().mockReturnValue({
                  single: jest.fn().mockResolvedValue({
                    data: releasedAllocation,
                    error: null,
                  }),
                }),
              }),
            }),
          };
        }
        if (tableName === 'employees') {
          return {
            update: jest.fn().mockImplementation((payload) => {
              updatedWorkload = payload.current_workload_hours;
              return {
                eq: jest.fn().mockResolvedValue({ error: null }),
              };
            }),
          };
        }
        if (tableName === 'decision_logs' || tableName === 'allocation_decisions') {
          return {
            insert: jest.fn().mockResolvedValue({ error: null }),
          };
        }
        return {};
      });

      const dto = {
        release_notes: 'Employee released and available for new allocations',
      };

      const result = await service.confirmRelease(allocationId, managerId, dto);

      expect(result.allocation.status).toBe('RELEASED');
      expect(result.freed_capacity_info.freed_capacity_hours).toBe(20);
      expect(result.freed_capacity_info.previous_workload_hours).toBe(40);
      expect(result.freed_capacity_info.new_workload_hours).toBe(20);
      expect(updatedWorkload).toBe(20);
    });

    it('should throw BadRequestException if allocation is not AWAITING_RELEASE_CONFIRMATION', async () => {
      mockClient.from.mockImplementation(() => ({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: {
                id: allocationId,
                status: 'RELEASED',
              },
              error: null,
            }),
          }),
        }),
      }));

      await expect(
        service.confirmRelease(allocationId, managerId, {}),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getReleasableAllocations', () => {
    const projectId = 'proj-uuid-201';

    it('should return releasable allocations for a project', async () => {
      const mockAllocations = [
        {
          id: 'alloc-1',
          project_id: projectId,
          employee_id: 'emp-1',
          assigned_role: 'Frontend Dev',
          allocated_hours: 40,
          allocated_hours_per_week: 40,
          status: 'WORK_COMPLETED',
          actual_end_date: '2026-09-20',
          employees: {
            id: 'emp-1',
            name: 'Bob',
            email: 'bob@test.com',
            role: 'ENGINEER',
            current_workload_hours: 40,
            weekly_capacity_hours: 40,
          },
        },
        {
          id: 'alloc-2',
          project_id: projectId,
          employee_id: 'emp-2',
          assigned_role: 'QA Engineer',
          allocated_hours: 20,
          allocated_hours_per_week: 20,
          status: 'AWAITING_RELEASE_CONFIRMATION',
          actual_end_date: '2026-09-21',
          employees: {
            id: 'emp-2',
            name: 'Carol',
            email: 'carol@test.com',
            role: 'ENGINEER',
            current_workload_hours: 20,
            weekly_capacity_hours: 40,
          },
        },
      ];

      mockClient.from.mockImplementation((tableName: string) => {
        if (tableName === 'projects') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: { id: projectId, name: 'Test Proj' },
                  error: null,
                }),
              }),
            }),
          };
        }
        if (tableName === 'allocations') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                in: jest.fn().mockReturnValue({
                  order: jest.fn().mockResolvedValue({
                    data: mockAllocations,
                    error: null,
                  }),
                }),
              }),
            }),
          };
        }
        return {};
      });

      const result = await service.getReleasableAllocations(projectId);

      expect(result).toHaveLength(2);
      expect(result[0].employee_name).toBe('Bob');
      expect(result[0].allocated_hours).toBe(40);
      expect(result[0].completion_date).toBe('2026-09-20');
      expect(result[1].employee_name).toBe('Carol');
      expect(result[1].status).toBe('AWAITING_RELEASE_CONFIRMATION');
    });

    it('should throw NotFoundException if project does not exist', async () => {
      mockClient.from.mockImplementation(() => ({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: { message: 'Not found' } }),
          }),
        }),
      }));

      await expect(service.getReleasableAllocations('non-existent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
