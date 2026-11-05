import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TeamFormationService } from './team-formation.service';
import { SupabaseService } from '../../supabase/supabase.service';

describe('TeamFormationService', () => {
  let service: TeamFormationService;
  let mockSupabaseService: any;
  let mockClient: any;

  const mockRequirements = [
    {
      id: 'req-1',
      project_id: 'proj-1',
      required_role: 'Frontend Engineer',
      skill_id: 'skill-react',
      minimum_proficiency: 3,
      required_headcount: 1,
      allocation_hours_per_week: 40,
      priority: 4,
    },
    {
      id: 'req-2',
      project_id: 'proj-1',
      required_role: 'Backend Engineer',
      skill_id: 'skill-nest',
      minimum_proficiency: 4,
      required_headcount: 1,
      allocation_hours_per_week: 40,
      priority: 5,
    },
  ];

  const mockEmployees = [
    {
      id: 'emp-1',
      name: 'Alice Smith',
      current_workload_hours: 0,
      max_capacity_hours: 40,
    },
    {
      id: 'emp-2',
      name: 'Bob Jones',
      current_workload_hours: 10,
      max_capacity_hours: 50, // Available: 50 - 10 = 40 >= 40
    },
    {
      id: 'emp-3',
      name: 'Charlie Burnout',
      current_workload_hours: 0,
      max_capacity_hours: 40,
    },
    {
      id: 'emp-4',
      name: 'Dave Overloaded',
      current_workload_hours: 30,
      max_capacity_hours: 40, // Available: 40 - 30 = 10 < 40 (Capacity constraint failure)
    },
  ];

  const mockEmployeeSkills = [
    { employee_id: 'emp-1', skill_id: 'skill-react', proficiency: 4 },
    { employee_id: 'emp-2', skill_id: 'skill-nest', proficiency: 5 },
    { employee_id: 'emp-3', skill_id: 'skill-react', proficiency: 5 },
    { employee_id: 'emp-4', skill_id: 'skill-nest', proficiency: 5 },
  ];

  const mockMlPredictions = [
    { employee_id: 'emp-1', predicted_performance: 0.9, burnout_risk_probability: 0.1 },
    { employee_id: 'emp-2', predicted_performance: 0.85, burnout_risk_probability: 0.2 },
    { employee_id: 'emp-3', predicted_performance: 0.95, burnout_risk_probability: 0.85 }, // Burnout > 0.8 (Burnout constraint failure)
    { employee_id: 'emp-4', predicted_performance: 0.9, burnout_risk_probability: 0.1 },
  ];

  beforeEach(async () => {
    mockClient = {
      from: jest.fn(),
    };

    mockSupabaseService = {
      getClient: jest.fn().mockReturnValue(mockClient),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamFormationService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
      ],
    }).compile();

    service = module.get<TeamFormationService>(TeamFormationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateTeamProposal', () => {
    it('should filter hard constraints and generate proposal with candidate scores', async () => {
      let createdProposal: any = null;
      let insertedMembers: any[] = [];
      let updatedStatus: string | null = null;

      mockClient.from.mockImplementation((table: string) => {
        if (table === 'project_staffing_requirements') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            order: jest.fn().mockResolvedValue({ data: mockRequirements, error: null }),
          };
        }
        if (table === 'employees') {
          return {
            select: jest.fn().mockResolvedValue({ data: mockEmployees, error: null }),
          };
        }
        if (table === 'employee_skills') {
          return {
            select: jest.fn().mockResolvedValue({ data: mockEmployeeSkills, error: null }),
          };
        }
        if (table === 'ml_predictions') {
          return {
            select: jest.fn().mockResolvedValue({ data: mockMlPredictions, error: null }),
          };
        }
        if (table === 'allocation_proposals') {
          return {
            insert: jest.fn().mockImplementation((payload) => {
              createdProposal = { id: 'prop-uuid-999', ...payload };
              return {
                select: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({ data: createdProposal, error: null }),
              };
            }),
            update: jest.fn().mockImplementation((payload) => {
              updatedStatus = payload.status;
              return {
                eq: jest.fn().mockResolvedValue({ error: null }),
              };
            }),
          };
        }
        if (table === 'allocation_proposal_members') {
          return {
            insert: jest.fn().mockImplementation((rows) => {
              insertedMembers = rows;
              return Promise.resolve({ error: null });
            }),
          };
        }
        return {};
      });

      const result = await service.generateTeamProposal('proj-1', 5, true);

      // Proposal checks
      expect(result.proposalId).toBe('prop-uuid-999');
      expect(result.requestedTeamSize).toBe(2);
      expect(result.selectedHeadcount).toBe(2); // emp-1 for frontend, emp-2 for backend
      expect(updatedStatus).toBe('PENDING_APPROVAL');

      // Candidate 1 (Alice) scoring verification:
      // skillMatch: 4 / 5.0 = 0.8
      // predictedPerformance: 0.9
      // fairness: 0.2 - (0/40)*0.2 = 0.2
      // finalScore: 0.8*0.4 + 0.9*0.4 + 0.2*0.2 = 0.32 + 0.36 + 0.04 = 0.72
      const alice = result.proposedMembers.find((m) => m.employee_id === 'emp-1');
      expect(alice).toBeDefined();
      expect(alice?.skill_match_score).toBe(0.8);
      expect(alice?.predicted_performance).toBe(0.9);
      expect(alice?.fairness_adjustment).toBe(0.2);
      expect(alice?.final_score).toBe(0.72);

      // Candidate 2 (Bob) scoring verification:
      // skillMatch: 5 / 5.0 = 1.0
      // predictedPerformance: 0.85
      // workloadRatio = 10 / 50 = 0.2
      // fairness = 0.2 - 0.2 * 0.2 = 0.16
      // finalScore: 1.0*0.4 + 0.85*0.4 + 0.16*0.2 = 0.4 + 0.34 + 0.032 = 0.772
      const bob = result.proposedMembers.find((m) => m.employee_id === 'emp-2');
      expect(bob).toBeDefined();
      expect(bob?.skill_match_score).toBe(1.0);
      expect(bob?.predicted_performance).toBe(0.85);
      expect(bob?.fairness_adjustment).toBe(0.16);
      expect(bob?.final_score).toBe(0.772);

      // Filtered out candidates:
      // Charlie (burnout > 0.8) and Dave (insufficient capacity) should not be selected
      expect(result.proposedMembers.some((m) => m.employee_id === 'emp-3')).toBe(false);
      expect(result.proposedMembers.some((m) => m.employee_id === 'emp-4')).toBe(false);
    });

    it('should throw NotFoundException if no staffing requirements found for project', async () => {
      mockClient.from.mockReturnValue({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: [], error: null }),
      });

      await expect(service.generateTeamProposal('empty-proj')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
