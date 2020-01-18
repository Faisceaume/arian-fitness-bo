import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciceDetailsComponent } from './exercice-details.component';

describe('ExerciceDetailsComponent', () => {
  let component: ExerciceDetailsComponent;
  let fixture: ComponentFixture<ExerciceDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExerciceDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
