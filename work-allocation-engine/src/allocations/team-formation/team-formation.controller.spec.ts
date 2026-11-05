import { Test, TestingModule } from '@nestjs/testing';
import { TeamFormationController } from './team-formation.controller';
import { TeamFormationService } from './team-formation.service';
import { SupabaseAuthGuard } from '../../auth/guards/supabase-auth/supabase-auth.guard';
import { RolesGuard } from '../../auth/guards/roles/roles.guard';

describe('TeamFormationController', () => {
  let controller: TeamFormationController;
  let mockTeamFormationService: any;

  beforeEach(async () => {
    mockTeamFormationService = {
      generateTeamProposal: jest.fn().mockResolvedValue({
        proposalId: 'prop-123',
        proposedMembers: [{ employee_id: 'emp-1' }],
        requestedTeamSize: 2,
        selectedHeadcount: 1,
        staffingGapSummary: 'Shortfall: 1 position',
        explanation: 'Generated proposal',
      }),
      getProposal: jest.fn().mockResolvedValue({ id: 'prop-123', status: 'PENDING_APPROVAL' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamFormationController],
      providers: [
        {
          provide: TeamFormationService,
          useValue: mockTeamFormationService,
        },
      ],
    })
      .overrideGuard(SupabaseAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<TeamFormationController>(TeamFormationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call generateTeamProposal on POST /generate', async () => {
    const dto = {
      project_id: '123e4567-e89b-12d3-a456-426614174000',
      max_candidates_per_role: 3,
      include_fairness_adjustment: true,
    };

    const result = await controller.generateProposal(dto);
    expect(result.proposal_id).toBe('prop-123');
    expect(result.status).toBe('PENDING_APPROVAL');
    expect(mockTeamFormationService.generateTeamProposal).toHaveBeenCalledWith(
      '123e4567-e89b-12d3-a456-426614174000',
      3,
      true,
    );
  });

  it('should call getProposal on GET /proposal/:proposalId', async () => {
    const result = await controller.getProposal('123e4567-e89b-12d3-a456-426614174000');
    expect(result.id).toBe('prop-123');
    expect(mockTeamFormationService.getProposal).toHaveBeenCalledWith(
      '123e4567-e89b-12d3-a456-426614174000',
    );
  });
});
