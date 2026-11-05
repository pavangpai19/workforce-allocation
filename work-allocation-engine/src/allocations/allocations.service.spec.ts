import { Test, TestingModule } from '@nestjs/testing';
import { AllocationsService } from './allocations.service';
import { SupabaseService } from '../supabase/supabase.service';

describe('AllocationsService', () => {
  let service: AllocationsService;
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
        AllocationsService,
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
      ],
    }).compile();

    service = module.get<AllocationsService>(AllocationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an allocation with status ACTIVE (never PROPOSED)', async () => {
    let insertedRows: any[] = [];

    mockClient.from.mockReturnValue({
      insert: jest.fn().mockImplementation((rows) => {
        insertedRows = rows;
        return {
          select: jest.fn().mockResolvedValue({ data: rows, error: null }),
        };
      }),
    });

    const body = {
      employee_id: 'emp-101',
      project_id: 'proj-001',
      week_start_date: '2026-09-08',
      allocated_hours: 40,
    };

    await service.create(body);

    expect(insertedRows).toHaveLength(1);
    expect(insertedRows[0].status).toBe('ACTIVE');
  });
});
