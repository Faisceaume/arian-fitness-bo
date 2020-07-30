import { TestBed } from '@angular/core/testing';

import { StripecheckoutService } from './stripecheckout.service';

describe('StripecheckoutService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StripecheckoutService = TestBed.get(StripecheckoutService);
    expect(service).toBeTruthy();
  });
});
