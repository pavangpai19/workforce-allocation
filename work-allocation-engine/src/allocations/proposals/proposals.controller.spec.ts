import { Test, TestingModule } from '@nestjs/testing';
import { ProposalsController, ProjectProposalsController } from './proposals.controller';
import { ProposalsService } from './proposals.service';
import { SupabaseAuthGuard } from '../../auth/guards/supabase-auth/supabase-auth.guard';
import { RolesGuard } from '../../auth/guards/roles/roles.guard';

describe('ProposalsController', () => {
  let controller: ProposalsController;
  let mockProposalsService: any;

  beforeEach(async () => {
    mockProposalsService = {
      findById: jest.fn().mockResolvedValue({ id: 'prop-1', status: 'DRAFT' }),
      createProposal: jest.fn().mockResolvedValue({ id: 'prop-1' }),
      approveProposal: jest.fn().mockResolvedValue({ status: 'APPROVED' }),
      rejectProposal: jest.fn().mockResolvedValue({ status: 'REJECTED' }),
      findByProjectId: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProposalsController, ProjectProposalsController],
      providers: [
        {
          provide: ProposalsService,
          useValue: mockProposalsService,
        },
      ],
    })
      .overrideGuard(SupabaseAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ProposalsController>(ProposalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should extract employeeId from user property on approval', async () => {
    const mockUser = {
      authUserId: 'auth-user-1',
      employeeId: 'emp-manager-789',
      role: 'MANAGER',
    };

    const dto = { review_comment: 'Approved team' };

    await controller.approveProposal('123e4567-e89b-12d3-a456-426614174000', dto, mockUser);

    expect(mockProposalsService.approveProposal).toHaveBeenCalledWith(
      '123e4567-e89b-12d3-a456-426614174000',
      dto,
      'emp-manager-789',
    );
  });

  it('should extract employeeId from user property on rejection', async () => {
    const mockUser = {
      authUserId: 'auth-user-1',
      employeeId: 'emp-manager-789',
      role: 'MANAGER',
    };

    const dto = { review_comment: 'Rejected' };

    await controller.rejectProposal('123e4567-e89b-12d3-a456-426614174000', dto, mockUser);

    expect(mockProposalsService.rejectProposal).toHaveBeenCalledWith(
      '123e4567-e89b-12d3-a456-426614174000',
      dto,
      'emp-manager-789',
    );
  });
});
