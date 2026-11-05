import { Test, TestingModule } from '@nestjs/testing';
import { AllocationsController } from './allocations.controller';
import { AllocationsService } from './allocations.service';
import { SupabaseAuthGuard } from '../auth/guards/supabase-auth/supabase-auth.guard';
import { RolesGuard } from '../auth/guards/roles/roles.guard';

describe('AllocationsController', () => {
  let controller: AllocationsController;
  let mockAllocationsService: any;

  beforeEach(async () => {
    mockAllocationsService = {
      findAll: jest.fn().mockResolvedValue([{ id: 'alloc-1' }]),
      create: jest.fn().mockResolvedValue([{ id: 'alloc-2' }]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AllocationsController],
      providers: [
        {
          provide: AllocationsService,
          useValue: mockAllocationsService,
        },
      ],
    })
      .overrideGuard(SupabaseAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AllocationsController>(AllocationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call findAll', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([{ id: 'alloc-1' }]);
    expect(mockAllocationsService.findAll).toHaveBeenCalled();
  });

  it('should call create', async () => {
    const result = await controller.create({ employee_id: 'emp-1' });
    expect(result).toEqual([{ id: 'alloc-2' }]);
    expect(mockAllocationsService.create).toHaveBeenCalledWith({ employee_id: 'emp-1' });
  });
});
