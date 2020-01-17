import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciceFormComponent } from './exercice-form.component';

describe('ExerciceFormComponent', () => {
  let component: ExerciceFormComponent;
  let fixture: ComponentFixture<ExerciceFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExerciceFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExerciceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
