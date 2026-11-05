import { Test, TestingModule } from '@nestjs/testing';
import { AutoAllocationService } from './auto-allocation.service';

describe('AutoAllocationService', () => {
  let service: AutoAllocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AutoAllocationService],
    }).compile();

    service = module.get<AutoAllocationService>(AutoAllocationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
