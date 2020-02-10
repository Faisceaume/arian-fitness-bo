import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExercicesSeriesComponent } from './exercices-series.component';

describe('ExercicesSeriesComponent', () => {
  let component: ExercicesSeriesComponent;
  let fixture: ComponentFixture<ExercicesSeriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExercicesSeriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExercicesSeriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
