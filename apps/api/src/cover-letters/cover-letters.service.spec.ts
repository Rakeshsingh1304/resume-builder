import { Test, TestingModule } from '@nestjs/testing';
import { CoverLettersService } from './cover-letters.service';

describe('CoverLettersService', () => {
  let service: CoverLettersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoverLettersService],
    }).compile();

    service = module.get<CoverLettersService>(CoverLettersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
