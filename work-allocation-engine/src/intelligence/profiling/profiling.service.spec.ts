import { Test, TestingModule } from '@nestjs/testing';
import { ProfilingService } from './profiling.service';

describe('ProfilingService', () => {
  let service: ProfilingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfilingService],
    }).compile();

    service = module.get<ProfilingService>(ProfilingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
