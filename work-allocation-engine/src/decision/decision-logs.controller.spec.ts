import { Test, TestingModule } from '@nestjs/testing';
import { DecisionLogsController } from './decision-logs.controller';
import { DecisionLogsService } from './decision-logs.service';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth/supabase-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';

describe('DecisionLogsController', () => {
  let controller: DecisionLogsController;
  let mockDecisionLogsService: any;

  beforeEach(async () => {
    mockDecisionLogsService = {
      createDecisionLog: jest.fn().mockResolvedValue({ id: 'log-1' }),
      getDecisionHistory: jest.fn().mockResolvedValue([{ id: 'log-1' }]),
      getAuditTrail: jest.fn().mockResolvedValue({ project_id: 'proj-1', total_events: 1 }),
      exportDecisionLog: jest.fn().mockResolvedValue({ decision_id: 'log-1', export_metadata: {} }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DecisionLogsController],
      providers: [
        {
          provide: DecisionLogsService,
          useValue: mockDecisionLogsService,
        },
      ],
    })
      .overrideGuard(SupabaseAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<DecisionLogsController>(DecisionLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createDecisionLog', () => {
    it('should create a decision log', async () => {
      const dto = {
        decision_type: 'ALLOCATION',
        entity_id: 'alloc-1',
      };
      const result = await controller.createDecisionLog(dto as any);
      expect(result).toEqual({ id: 'log-1' });
      expect(mockDecisionLogsService.createDecisionLog).toHaveBeenCalledWith(dto);
    });
  });

  describe('getDecisionHistory', () => {
    it('should fetch decision history with user context', async () => {
      const user = { employeeId: 'emp-101', role: 'EMPLOYEE' };
      const result = await controller.getDecisionHistory('ALLOCATION', 'alloc-1', user);
      expect(result).toEqual([{ id: 'log-1' }]);
      expect(mockDecisionLogsService.getDecisionHistory).toHaveBeenCalledWith(
        'alloc-1',
        'ALLOCATION',
        user,
      );
    });
  });

  describe('getAuditTrail', () => {
    it('should fetch audit trail for project', async () => {
      const projectId = '8f43c3d5-263a-4467-8cfb-6f81e3a6a901';
      const result = await controller.getAuditTrail(projectId);
      expect(result.project_id).toBe('proj-1');
      expect(mockDecisionLogsService.getAuditTrail).toHaveBeenCalledWith(projectId);
    });
  });

  describe('exportDecisionLog', () => {
    it('should export decision log as JSON', async () => {
      const logId = '8f43c3d5-263a-4467-8cfb-6f81e3a6a901';
      const result = await controller.exportDecisionLog(logId);
      expect(result.decision_id).toBe('log-1');
      expect(mockDecisionLogsService.exportDecisionLog).toHaveBeenCalledWith(logId);
    });
  });
});
