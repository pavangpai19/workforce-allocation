import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth/supabase-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;
  let mockAnalyticsService: any;

  beforeEach(async () => {
    mockAnalyticsService = {
      getDashboardMetrics: jest.fn().mockResolvedValue({ active_projects_count: 5 }),
      getProjectAnalytics: jest.fn().mockResolvedValue({ project_name: 'Project A', staffing_coverage_percentage: 100 }),
      getEmployeeWorkload: jest.fn().mockResolvedValue({ employee_name: 'Alice', utilization_percentage: 80 }),
      getAllocationTrends: jest.fn().mockResolvedValue({ total_new_allocations: 10 }),
      getSkillDemandAnalysis: jest.fn().mockResolvedValue([{ skill_name: 'TypeScript', demanded_headcount: 8 }]),
      getSystemMetrics: jest.fn().mockResolvedValue({ total_allocations: 20 }),
      getEmployeeMetrics: jest.fn().mockResolvedValue([{ employee_id: 'emp-1' }]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        {
          provide: AnalyticsService,
          useValue: mockAnalyticsService,
        },
      ],
    })
      .overrideGuard(SupabaseAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getDashboardMetrics', () => {
    it('should return dashboard metrics', async () => {
      const result = await controller.getDashboardMetrics({});
      expect(result).toEqual({ active_projects_count: 5 });
      expect(mockAnalyticsService.getDashboardMetrics).toHaveBeenCalled();
    });
  });

  describe('getProjectAnalytics', () => {
    it('should return project analytics', async () => {
      const projectId = '8f43c3d5-263a-4467-8cfb-6f81e3a6a901';
      const result = await controller.getProjectAnalytics(projectId);
      expect(result.staffing_coverage_percentage).toBe(100);
      expect(mockAnalyticsService.getProjectAnalytics).toHaveBeenCalledWith(projectId);
    });
  });

  describe('getEmployeeWorkload', () => {
    it('should return workload breakdown', async () => {
      const employeeId = '8f43c3d5-263a-4467-8cfb-6f81e3a6a901';
      const user = { employeeId: '8f43c3d5-263a-4467-8cfb-6f81e3a6a901', role: 'EMPLOYEE' };
      const result = await controller.getEmployeeWorkload(employeeId, user);
      expect(result.utilization_percentage).toBe(80);
      expect(mockAnalyticsService.getEmployeeWorkload).toHaveBeenCalledWith(employeeId, user);
    });
  });

  describe('getAllocationTrends', () => {
    it('should return allocation trends', async () => {
      const filter = { startDate: '2026-01-01' };
      const result = await controller.getAllocationTrends(filter);
      expect(result.total_new_allocations).toBe(10);
      expect(mockAnalyticsService.getAllocationTrends).toHaveBeenCalledWith(filter);
    });
  });

  describe('getSkillDemandAnalysis', () => {
    it('should return skill demand ranking', async () => {
      const result = await controller.getSkillDemandAnalysis();
      expect(result).toHaveLength(1);
      expect(mockAnalyticsService.getSkillDemandAnalysis).toHaveBeenCalled();
    });
  });
});
