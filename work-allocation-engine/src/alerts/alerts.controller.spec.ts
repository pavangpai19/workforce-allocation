import { Test, TestingModule } from '@nestjs/testing';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth/supabase-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';

describe('AlertsController', () => {
  let controller: AlertsController;
  let mockAlertsService: any;

  beforeEach(async () => {
    mockAlertsService = {
      getAlerts: jest.fn().mockResolvedValue({ alerts: [{ id: 'alert-1' }], total: 1 }),
      getAlertById: jest.fn().mockResolvedValue({ id: 'alert-1', type: 'CAPACITY_WARNING' }),
      checkCapacityAlerts: jest.fn().mockResolvedValue({ has_alert: true, status: 'CAPACITY_WARNING' }),
      checkStaffingGapAlerts: jest.fn().mockResolvedValue({ requirements_with_gaps_count: 1 }),
      checkHiringSignals: jest.fn().mockResolvedValue({ persistent_hiring_signals_count: 1 }),
      dismissAlert: jest.fn().mockResolvedValue({ id: 'alert-1', status: 'DISMISSED' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlertsController],
      providers: [
        {
          provide: AlertsService,
          useValue: mockAlertsService,
        },
      ],
    })
      .overrideGuard(SupabaseAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AlertsController>(AlertsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAlerts', () => {
    it('should query alerts with filters', async () => {
      const filters = { status: 'ACTIVE', page: 1, limit: 10 };
      const result = await controller.getAlerts(filters);
      expect(result.total).toBe(1);
      expect(mockAlertsService.getAlerts).toHaveBeenCalledWith(filters);
    });
  });

  describe('checkCapacityAlerts', () => {
    it('should trigger employee capacity check', async () => {
      const employeeId = '8f43c3d5-263a-4467-8cfb-6f81e3a6a901';
      const result = await controller.checkCapacityAlerts(employeeId);
      expect(result.has_alert).toBe(true);
      expect(mockAlertsService.checkCapacityAlerts).toHaveBeenCalledWith(employeeId);
    });
  });

  describe('checkStaffingGapAlerts', () => {
    it('should trigger project staffing gap check', async () => {
      const projectId = '8f43c3d5-263a-4467-8cfb-6f81e3a6a901';
      const result = await controller.checkStaffingGapAlerts(projectId);
      expect(result.requirements_with_gaps_count).toBe(1);
      expect(mockAlertsService.checkStaffingGapAlerts).toHaveBeenCalledWith(projectId);
    });
  });

  describe('checkHiringSignals', () => {
    it('should trigger hiring signal aggregation', async () => {
      const result = await controller.checkHiringSignals();
      expect(result.persistent_hiring_signals_count).toBe(1);
      expect(mockAlertsService.checkHiringSignals).toHaveBeenCalled();
    });
  });

  describe('dismissAlert', () => {
    it('should dismiss alert with manager context', async () => {
      const alertId = '8f43c3d5-263a-4467-8cfb-6f81e3a6a901';
      const dto = { reason: 'Handled' };
      const user = { employeeId: 'mgr-101', role: 'MANAGER' };

      const result = await controller.dismissAlert(alertId, dto, user);
      expect(result.status).toBe('DISMISSED');
      expect(mockAlertsService.dismissAlert).toHaveBeenCalledWith(
        alertId,
        'mgr-101',
        'Handled',
      );
    });
  });
});
