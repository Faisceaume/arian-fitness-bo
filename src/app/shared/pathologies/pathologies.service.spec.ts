import { TestBed } from '@angular/core/testing';

import { PathologiesService } from './pathologies.service';

describe('PathologiesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PathologiesService = TestBed.get(PathologiesService);
    expect(service).toBeTruthy();
  });
});
