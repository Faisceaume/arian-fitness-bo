import { TestBed } from '@angular/core/testing';

import { ProgrammesService } from './programmes.service';

describe('ProgrammesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProgrammesService = TestBed.get(ProgrammesService);
    expect(service).toBeTruthy();
  });
});
