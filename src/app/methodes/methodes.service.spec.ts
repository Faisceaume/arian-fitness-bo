import { TestBed } from '@angular/core/testing';

import { MethodesService } from './methodes.service';

describe('MethodesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MethodesService = TestBed.get(MethodesService);
    expect(service).toBeTruthy();
  });
});
