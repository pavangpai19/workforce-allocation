import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { StaffingRequirementsService } from './staffing-requirements.service';
import { SupabaseService } from '../../supabase/supabase.service';

describe('StaffingRequirementsService', () => {
  let service: StaffingRequirementsService;
  let mockSupabaseService: any;
  let mockClient: any;

  beforeEach(async () => {
    mockClient = {
      from: jest.fn(),
    };

    mockSupabaseService = {
      getClient: jest.fn().mockReturnValue(mockClient),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StaffingRequirementsService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
      ],
    }).compile();

    service = module.get<StaffingRequirementsService>(
      StaffingRequirementsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByProjectId', () => {
    it('should return list of staffing requirements for a project', async () => {
      const mockData = [
        {
          id: 'req-1',
          project_id: 'proj-1',
          required_role: 'Frontend Engineer',
          required_headcount: 2,
          minimum_proficiency: 4,
          skills: { id: 'skill-1', name: 'React' },
        },
      ];

      const queryBuilder: any = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({ data: mockData, error: null }),
      };

      mockClient.from.mockReturnValue(queryBuilder);

      const result = await service.findByProjectId('proj-1');
      expect(result).toEqual(mockData);
      expect(mockClient.from).toHaveBeenCalledWith(
        'project_staffing_requirements',
      );
    });

    it('should throw BadRequestException if database returns error', async () => {
      const queryBuilder: any = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        order: jest
          .fn()
          .mockResolvedValue({ data: null, error: { message: 'DB Error' } }),
      };

      mockClient.from.mockReturnValue(queryBuilder);

      await expect(service.findByProjectId('proj-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('create', () => {
    it('should create a new staffing requirement when project and skill exist', async () => {
      const createDto = {
        required_role: 'Backend Engineer',
        skill_id: 'skill-uuid-1',
        minimum_proficiency: 3,
        required_headcount: 2,
        allocation_hours_per_week: 40,
        is_mandatory: true,
        priority: 4,
      };

      const createdRow = {
        id: 'req-new',
        project_id: 'proj-1',
        ...createDto,
        skills: { id: 'skill-uuid-1', name: 'NestJS' },
      };

      mockClient.from.mockImplementation((tableName: string) => {
        if (tableName === 'projects') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest
              .fn()
              .mockResolvedValue({ data: { id: 'proj-1' }, error: null }),
          };
        }
        if (tableName === 'skills') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest
              .fn()
              .mockResolvedValue({ data: { id: 'skill-uuid-1' }, error: null }),
          };
        }
        if (tableName === 'project_staffing_requirements') {
          return {
            insert: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            single: jest
              .fn()
              .mockResolvedValue({ data: createdRow, error: null }),
          };
        }
        return {};
      });

      const result = await service.create('proj-1', createDto);
      expect(result).toEqual(createdRow);
    });

    it('should throw NotFoundException if project does not exist', async () => {
      mockClient.from.mockImplementation((tableName: string) => {
        if (tableName === 'projects') {
          return {
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: null, error: true }),
          };
        }
        return {};
      });

      await expect(
        service.create('non-existent-proj', {
          required_role: 'Engineer',
          skill_id: 'skill-1',
          minimum_proficiency: 3,
          required_headcount: 1,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a staffing requirement successfully', async () => {
      const existingRow = {
        id: 'req-1',
        project_id: 'proj-1',
        required_role: 'Engineer',
      };

      mockClient.from.mockImplementation((tableName: string) => {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest
            .fn()
            .mockResolvedValue({ data: existingRow, error: null }),
          delete: jest.fn().mockReturnThis(),
        };
      });

      const result = await service.delete('proj-1', 'req-1');
      expect(result).toEqual({
        message: 'Staffing requirement successfully deleted',
        id: 'req-1',
        project_id: 'proj-1',
      });
    });
  });
});
