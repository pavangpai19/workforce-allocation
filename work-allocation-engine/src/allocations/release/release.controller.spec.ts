import { Test, TestingModule } from '@nestjs/testing';
import { ReleaseController } from './release.controller';
import { ReleaseService } from './release.service';
import { SupabaseAuthGuard } from '../../auth/guards/supabase-auth/supabase-auth.guard';
import { RolesGuard } from '../../auth/guards/roles/roles.guard';

describe('ReleaseController', () => {
  let controller: ReleaseController;
  let mockReleaseService: any;

  beforeEach(async () => {
    mockReleaseService = {
      reportWorkCompletion: jest.fn().mockResolvedValue({
        id: '8f43c3d5-263a-4467-8cfb-6f81e3a6a901',
        status: 'WORK_COMPLETED',
      }),
      reviewCompletion: jest.fn().mockResolvedValue({
        id: '8f43c3d5-263a-4467-8cfb-6f81e3a6a901',
        status: 'AWAITING_RELEASE_CONFIRMATION',
        review_status: 'AWAITING_RELEASE_CONFIRMATION',
      }),
      confirmRelease: jest.fn().mockResolvedValue({
        message: 'Allocation release successfully confirmed',
        allocation: {
          id: '8f43c3d5-263a-4467-8cfb-6f81e3a6a901',
          status: 'RELEASED',
        },
        freed_capacity_info: { freed_capacity_hours: 40 },
      }),
      getReleasableAllocations: jest.fn().mockResolvedValue([
        {
          id: 'alloc-1',
          employee_name: 'Alice',
          allocated_hours: 40,
          status: 'WORK_COMPLETED',
        },
      ]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReleaseController],
      providers: [
        {
          provide: ReleaseService,
          useValue: mockReleaseService,
        },
      ],
    })
      .overrideGuard(SupabaseAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ReleaseController>(ReleaseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('reportWorkCompletion', () => {
    it('should report work completion with user context', async () => {
      const allocationId = '8f43c3d5-263a-4467-8cfb-6f81e3a6a901';
      const dto = { notes: 'Completed task' };
      const user = { employeeId: 'emp-101', role: 'EMPLOYEE' };

      const result = await controller.reportWorkCompletion(allocationId, dto, user);

      expect(result.status).toBe('WORK_COMPLETED');
      expect(mockReleaseService.reportWorkCompletion).toHaveBeenCalledWith(
        allocationId,
        'emp-101',
        dto,
      );
    });
  });

  describe('reviewCompletion', () => {
    it('should submit manager review', async () => {
      const allocationId = '8f43c3d5-263a-4467-8cfb-6f81e3a6a901';
      const dto = { review_notes: 'Looks good' };
      const user = { employeeId: 'mgr-201', role: 'MANAGER' };

      const result = await controller.reviewCompletion(allocationId, dto, user);

      expect(result.review_status).toBe('AWAITING_RELEASE_CONFIRMATION');
      expect(mockReleaseService.reviewCompletion).toHaveBeenCalledWith(
        allocationId,
        'mgr-201',
        dto,
      );
    });
  });

  describe('confirmRelease', () => {
    it('should confirm release and return freed capacity', async () => {
      const allocationId = '8f43c3d5-263a-4467-8cfb-6f81e3a6a901';
      const dto = { release_notes: 'Released' };
      const user = { employeeId: 'mgr-201', role: 'MANAGER' };

      const result = await controller.confirmRelease(allocationId, dto, user);

      expect(result.allocation.status).toBe('RELEASED');
      expect(mockReleaseService.confirmRelease).toHaveBeenCalledWith(
        allocationId,
        'mgr-201',
        dto,
      );
    });
  });

  describe('getReleasableAllocations', () => {
    it('should return list of releasable allocations for project', async () => {
      const projectId = '8f43c3d5-263a-4467-8cfb-6f81e3a6a901';

      const result = await controller.getReleasableAllocations(projectId);

      expect(result).toHaveLength(1);
      expect(mockReleaseService.getReleasableAllocations).toHaveBeenCalledWith(projectId);
    });
  });
});
