import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { SupabaseService } from '../../supabase/supabase.service';
import { ProposalStatus, ProposalAvailabilityStatus } from './dto/create-proposal-persistence.dto';

describe('ProposalsService', () => {
  let service: ProposalsService;
  let mockSupabaseService: any;
  let mockClient: any;

  const sampleMembers = [
    {
      id: 'member-1',
      proposal_id: 'proposal-111',
      employee_id: 'emp-101',
      staffing_requirement_id: 'req-201',
      proposed_role: 'Frontend Lead',
      allocated_hours_per_week: 40,
      allocation_percentage: 100,
      skill_match_score: 0.95,
      predicted_performance: 0.88,
      burnout_risk_probability: 0.12,
      final_score: 0.91,
      availability_status: 'AVAILABLE_NOW',
      explanation: 'Top tier match for Frontend Lead slot.',
      employees: {
        id: 'emp-101',
        name: 'Alice Smith',
        role: 'Senior Engineer',
        department: 'Engineering',
        weekly_capacity_hours: 40,
      },
    },
    {
      id: 'member-2',
      proposal_id: 'proposal-111',
      employee_id: 'emp-102',
      staffing_requirement_id: 'req-202',
      proposed_role: 'Backend Lead',
      allocated_hours_per_week: 40,
      allocation_percentage: 100,
      skill_match_score: 0.92,
      predicted_performance: 0.85,
      burnout_risk_probability: 0.15,
      final_score: 0.89,
      availability_status: 'AVAILABLE_NOW',
      explanation: 'Strong backend fit with low workload.',
      employees: {
        id: 'emp-102',
        name: 'Bob Jones',
        role: 'Backend Engineer',
        department: 'Engineering',
        weekly_capacity_hours: 40,
      },
    },
  ];

  const samplePendingProposal = {
    id: 'proposal-111',
    project_id: 'proj-001',
    requested_by: 'manager-123',
    status: 'PENDING_APPROVAL',
    requested_team_size: 2,
    selected_headcount: 2,
  };

  beforeEach(async () => {
    mockClient = {
      from: jest.fn(),
    };

    mockSupabaseService = {
      getClient: jest.fn().mockReturnValue(mockClient),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProposalsService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
      ],
    }).compile();

    service = module.get<ProposalsService>(ProposalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createProposal - Default Status and Availability Invariants', () => {
    it('should default proposal status to DRAFT and member availability to AVAILABLE_NOW', async () => {
      let insertedProposalRow: any = null;
      let insertedMemberRows: any[] = [];

      mockClient.from.mockImplementation((table: string) => {
        if (table === 'allocation_proposals') {
          return {
            insert: jest.fn().mockImplementation((rows) => {
              insertedProposalRow = { id: 'prop-new-1', ...rows[0] };
              return {
                select: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({ data: insertedProposalRow, error: null }),
              };
            }),
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: insertedProposalRow, error: null }),
          };
        }
        if (table === 'allocation_proposal_members') {
          return {
            insert: jest.fn().mockImplementation((rows) => {
              insertedMemberRows = rows;
              return Promise.resolve({ error: null });
            }),
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValue({ data: insertedMemberRows, error: null }),
          };
        }
        return {};
      });

      const dto = {
        project_id: 'proj-001',
        requested_team_size: 1,
        selected_headcount: 1,
        members: [
          {
            employee_id: 'emp-101',
            staffing_requirement_id: 'req-201',
            proposed_role: 'Frontend Dev',
            skill_match_score: 0.9,
            predicted_performance: 0.85,
            burnout_risk_probability: 0.1,
            fairness_adjustment: 0.95,
            final_score: 0.9,
          },
        ],
      };

      const result = await service.createProposal(dto as any);
      expect(insertedProposalRow.status).toBe(ProposalStatus.DRAFT);
      expect(insertedMemberRows[0].availability_status).toBe(ProposalAvailabilityStatus.AVAILABLE_NOW);
    });
  });

  describe('findById', () => {
    it('should return proposal with populated members', async () => {
      mockClient.from.mockImplementation((table: string) => {
        if (table === 'allocation_proposals') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: samplePendingProposal, error: null }),
          };
        }
        if (table === 'allocation_proposal_members') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValue({ data: sampleMembers, error: null }),
          };
        }
        return {};
      });

      const result = await service.findById('proposal-111');
      expect(result).toEqual({
        ...samplePendingProposal,
        members: sampleMembers,
      });
    });

    it('should throw NotFoundException if proposal not found', async () => {
      mockClient.from.mockImplementation((table: string) => {
        if (table === 'allocation_proposals') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: null, error: true }),
          };
        }
        return {};
      });

      await expect(service.findById('unknown-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('approveProposal - Optimistic Status Claim & Invariants', () => {
    it('should successfully approve a PENDING_APPROVAL proposal with atomic status claim and commit ACTIVE allocations', async () => {
      let proposalUpdatePayload: any = null;
      let statusFilterUsed: string | null = null;
      const insertedAllocations: any[] = [];
      const insertedAuditLogs: any[] = [];

      mockClient.from.mockImplementation((table: string) => {
        if (table === 'allocation_proposals') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: samplePendingProposal, error: null }),
            update: jest.fn().mockImplementation((payload) => {
              proposalUpdatePayload = payload;
              return {
                eq: jest.fn().mockImplementation((col1, val1) => {
                  return {
                    eq: jest.fn().mockImplementation((col2, val2) => {
                      if (col2 === 'status') statusFilterUsed = val2;
                      return {
                        select: jest.fn().mockResolvedValue({
                          data: [{ id: 'proposal-111', ...payload }],
                          error: null,
                        }),
                      };
                    }),
                  };
                }),
              };
            }),
          };
        }

        if (table === 'allocation_proposal_members') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValue({ data: sampleMembers, error: null }),
          };
        }

        if (table === 'allocations') {
          return {
            insert: jest.fn().mockImplementation((rows) => {
              const generated = rows.map((r: any, idx: number) => ({
                id: `alloc-${idx + 1}`,
                ...r,
              }));
              insertedAllocations.push(...generated);
              return {
                select: jest.fn().mockResolvedValue({
                  data: generated,
                  error: null,
                }),
              };
            }),
          };
        }

        if (table === 'allocation_decisions') {
          return {
            insert: jest.fn().mockImplementation((rows) => {
              insertedAuditLogs.push(...rows);
              return Promise.resolve({ data: rows, error: null });
            }),
          };
        }

        return {};
      });

      const result = await service.approveProposal('proposal-111', {
        manager_id: 'manager-123',
        review_comment: 'Team approved for Q3 launch',
      });

      // 1. Claim status updated to APPROVED with PENDING_APPROVAL filter
      expect(proposalUpdatePayload.status).toBe('APPROVED');
      expect(statusFilterUsed).toBe('PENDING_APPROVAL');
      expect(proposalUpdatePayload.reviewed_by).toBe('manager-123');

      // 2. Exactly 2 allocations committed with status ACTIVE (never PROPOSED)
      expect(insertedAllocations).toHaveLength(2);
      expect(insertedAllocations[0].status).toBe('ACTIVE');
      expect(insertedAllocations[1].status).toBe('ACTIVE');

      // 3. Return summary
      expect(result.status).toBe('APPROVED');
      expect(result.committed_allocations_count).toBe(2);
    });

    it('should reject approval if proposal is in DRAFT status', async () => {
      const draftProposal = {
        ...samplePendingProposal,
        status: 'DRAFT',
      };

      mockClient.from.mockImplementation((table: string) => {
        if (table === 'allocation_proposals') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: draftProposal, error: null }),
          };
        }
        if (table === 'allocation_proposal_members') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValue({ data: sampleMembers, error: null }),
          };
        }
        return {};
      });

      await expect(
        service.approveProposal('proposal-111', { manager_id: 'manager-123' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject duplicate approval if proposal is already APPROVED (ConflictException)', async () => {
      const alreadyApproved = {
        ...samplePendingProposal,
        status: 'APPROVED',
      };

      mockClient.from.mockImplementation((table: string) => {
        if (table === 'allocation_proposals') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: alreadyApproved, error: null }),
          };
        }
        if (table === 'allocation_proposal_members') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValue({ data: sampleMembers, error: null }),
          };
        }
        return {};
      });

      await expect(
        service.approveProposal('proposal-111', { manager_id: 'manager-123' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('rejectProposal', () => {
    it('should update proposal status to REJECTED and create ZERO allocations', async () => {
      let proposalUpdatePayload: any = null;
      let allocationsTableCalled = false;

      mockClient.from.mockImplementation((table: string) => {
        if (table === 'allocation_proposals') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: samplePendingProposal, error: null }),
            update: jest.fn().mockImplementation((payload) => {
              proposalUpdatePayload = payload;
              return {
                eq: jest.fn().mockImplementation(() => {
                  return {
                    eq: jest.fn().mockImplementation(() => {
                      return {
                        select: jest.fn().mockResolvedValue({
                          data: [{ id: 'proposal-111', ...payload }],
                          error: null,
                        }),
                      };
                    }),
                  };
                }),
              };
            }),
          };
        }

        if (table === 'allocation_proposal_members') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValue({ data: sampleMembers, error: null }),
          };
        }

        if (table === 'allocations') {
          allocationsTableCalled = true;
          return {};
        }

        return {};
      });

      const result = await service.rejectProposal('proposal-111', {
        manager_id: 'manager-123',
        review_comment: 'Budget paused for this initiative',
      });

      expect(proposalUpdatePayload.status).toBe('REJECTED');
      expect(allocationsTableCalled).toBe(false);
      expect(result.status).toBe('REJECTED');
    });
  });
});
