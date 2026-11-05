import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DecisionLogsService } from './decision-logs.service';
import { SupabaseService } from '../supabase/supabase.service';
import { DecisionOutcome, DecisionType } from './dto/create-decision-log.dto';

describe('DecisionLogsService', () => {
  let service: DecisionLogsService;
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
        DecisionLogsService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
      ],
    }).compile();

    service = module.get<DecisionLogsService>(DecisionLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createDecisionLog', () => {
    it('should insert a complete decision log and dual-write to allocation_decisions', async () => {
      const dto = {
        decision_type: DecisionType.ALLOCATION,
        entity_id: 'alloc-101',
        entity_type: 'ALLOCATION',
        employee_id: 'emp-201',
        project_id: 'proj-301',
        decision_outcome: DecisionOutcome.APPROVED,
        decided_by: 'mgr-401',
        fairness: 0.9,
        performance: 0.85,
        skill_score: 0.95,
        knowledge_score: 0.8,
        risk_score: 0.1,
        confidence: 0.9,
        final_score: 0.88,
        explanation: 'Best fit based on skill match and fairness balance',
        decision_context: { ml_version: 'v2.1' },
      };

      const insertedRow = {
        id: 'log-1',
        ...dto,
        created_at: new Date().toISOString(),
      };

      mockClient.from.mockImplementation((tableName: string) => {
        if (tableName === 'decision_logs') {
          return {
            insert: jest.fn().mockReturnValue({
              select: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: insertedRow, error: null }),
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

      const result = await service.createDecisionLog(dto);

      expect(result.id).toBe('log-1');
      expect(result.decision_type).toBe(DecisionType.ALLOCATION);
      expect(mockClient.from).toHaveBeenCalledWith('decision_logs');
    });
  });

  describe('getDecisionHistory', () => {
    it('should query decision history for an allocation', async () => {
      const mockLogs = [
        {
          id: 'log-1',
          allocation_id: 'alloc-101',
          employee_id: 'emp-201',
          decision_snapshot: { decision_type: 'ALLOCATION' },
          created_at: '2026-09-21T10:00:00Z',
        },
      ];

      mockClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: mockLogs, error: null }),
          }),
        }),
      });

      const result = await service.getDecisionHistory('alloc-101', 'ALLOCATION');

      expect(result).toEqual(mockLogs);
      expect(mockClient.from).toHaveBeenCalledWith('decision_logs');
    });

    it('should enforce role visibility for EMPLOYEE role', async () => {
      const mockLogs = [
        {
          id: 'log-1',
          allocation_id: 'alloc-101',
          employee_id: 'emp-201',
          created_at: '2026-09-21T10:00:00Z',
        },
        {
          id: 'log-2',
          allocation_id: 'alloc-102',
          employee_id: 'emp-other',
          created_at: '2026-09-21T11:00:00Z',
        },
      ];

      mockClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: mockLogs, error: null }),
          }),
        }),
      });

      const user = { employeeId: 'emp-201', role: 'EMPLOYEE' };
      const result = await service.getDecisionHistory('proj-1', 'PROJECT', user);

      expect(result).toHaveLength(1);
      expect(result[0].employee_id).toBe('emp-201');
    });
  });

  describe('getAuditTrail', () => {
    const projectId = '8f43c3d5-263a-4467-8cfb-6f81e3a6a901';

    it('should return complete audit trail for a project', async () => {
      const mockProject = { id: projectId, name: 'Core Platform' };
      const mockLogs = [
        {
          id: 'log-1',
          project_id: projectId,
          allocation_id: 'alloc-1',
          employee_id: 'emp-1',
          fairness: 0.9,
          performance: 0.95,
          skill_score: 0.9,
          knowledge_score: 0.85,
          risk_score: 0.05,
          confidence: 0.95,
          final_score: 0.92,
          explanation: 'Allocation approved',
          decision_snapshot: { decision_type: 'ALLOCATION', decision_outcome: 'APPROVED' },
          employees: { name: 'Alice', role: 'ENGINEER' },
          projects: { name: 'Core Platform' },
          created_at: '2026-09-21T12:00:00Z',
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
        if (tableName === 'decision_logs') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                order: jest.fn().mockResolvedValue({ data: mockLogs, error: null }),
              }),
            }),
          };
        }
        return {};
      });

      const result = await service.getAuditTrail(projectId);

      expect(result.project_id).toBe(projectId);
      expect(result.total_events).toBe(1);
      expect(result.audit_trail[0].decision_type).toBe('ALLOCATION');
      expect(result.audit_trail[0].employee_name).toBe('Alice');
    });

    it('should throw NotFoundException if project does not exist', async () => {
      mockClient.from.mockImplementation((tableName: string) => {
        if (tableName === 'projects') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: null, error: true }),
              }),
            }),
          };
        }
        return {};
      });

      await expect(service.getAuditTrail(projectId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('exportDecisionLog', () => {
    const logId = '8f43c3d5-263a-4467-8cfb-6f81e3a6a901';

    it('should format full decision record for export', async () => {
      const mockLog = {
        id: logId,
        allocation_id: 'alloc-1',
        project_id: 'proj-1',
        employee_id: 'emp-1',
        fairness: 0.95,
        performance: 0.9,
        skill_score: 0.98,
        knowledge_score: 0.88,
        risk_score: 0.05,
        confidence: 0.95,
        final_score: 0.93,
        explanation: 'Top ranked candidate with zero burnout risk',
        decision_snapshot: {
          decision_type: 'ALLOCATION',
          decision_outcome: 'COMMITTED',
          decided_by: 'mgr-100',
          decision_context: {
            constraints: { max_hours: 40 },
          },
        },
        employees: {
          id: 'emp-1',
          name: 'Bob Smith',
          email: 'bob@example.com',
          role: 'ENGINEER',
          department: 'Engineering',
        },
        projects: {
          id: 'proj-1',
          name: 'Mobile App',
        },
        created_at: '2026-09-21T10:00:00Z',
      };

      mockClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: mockLog, error: null }),
          }),
        }),
      });

      const result = await service.exportDecisionLog(logId);

      expect(result.export_metadata.format).toBe('AUDIT_RECORD_JSON');
      expect(result.decision_id).toBe(logId);
      expect(result.scores.fairness_score).toBe(0.95);
      expect(result.employee.name).toBe('Bob Smith');
      expect(result.project.name).toBe('Mobile App');
      expect(result.constraints).toEqual({ max_hours: 40 });
    });

    it('should throw NotFoundException if log is not found', async () => {
      mockClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({ data: null, error: true }),
          }),
        }),
      });

      await expect(service.exportDecisionLog(logId)).rejects.toThrow(NotFoundException);
    });
  });
});
