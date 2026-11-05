import { Test, TestingModule } from '@nestjs/testing';
import { AutoAllocationController } from './auto-allocation.controller';
import { AutoAllocationService } from './auto-allocation.service';
import { SupabaseAuthGuard } from '../../auth/guards/supabase-auth/supabase-auth.guard';
import { RolesGuard } from '../../auth/guards/roles/roles.guard';

describe('AutoAllocationController', () => {
  let controller: AutoAllocationController;
  let mockAutoAllocationService: any;

  beforeEach(async () => {
    mockAutoAllocationService = {
      autoAllocate: jest.fn().mockResolvedValue({
        message: 'Auto allocation successful',
        selected_employee: { employee_id: 'emp-101' },
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AutoAllocationController],
      providers: [
        {
          provide: AutoAllocationService,
          useValue: mockAutoAllocationService,
        },
      ],
    })
      .overrideGuard(SupabaseAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AutoAllocationController>(AutoAllocationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should execute autoAllocate with canonical skill parameter', async () => {
    const dto = {
      project_id: '123e4567-e89b-12d3-a456-426614174000',
      skill: 'React',
      required_hours: 40,
      week_start_date: '2026-09-08',
    };

    const result = await controller.autoAllocate(dto);
    expect(result.message).toBe('Auto allocation successful');
    expect(mockAutoAllocationService.autoAllocate).toHaveBeenCalledWith(
      '123e4567-e89b-12d3-a456-426614174000',
      'React',
      40,
      '2026-09-08',
    );
  });
});
