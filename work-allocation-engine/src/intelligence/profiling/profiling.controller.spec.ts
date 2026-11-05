import { Test, TestingModule } from '@nestjs/testing';
import { ProfilingController } from './profiling.controller';

describe('ProfilingController', () => {
  let controller: ProfilingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfilingController],
    }).compile();

    controller = module.get<ProfilingController>(ProfilingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
