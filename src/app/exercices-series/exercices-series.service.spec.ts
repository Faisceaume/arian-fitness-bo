import { TestBed } from '@angular/core/testing';

import { ExercicesSeriesService } from './exercices-series.service';

describe('ExercicesSeriesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExercicesSeriesService = TestBed.get(ExercicesSeriesService);
    expect(service).toBeTruthy();
  });
});
