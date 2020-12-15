import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExercicesListviewComponent } from './exercices-listview.component';

describe('ExercicesListviewComponent', () => {
  let component: ExercicesListviewComponent;
  let fixture: ComponentFixture<ExercicesListviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExercicesListviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExercicesListviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
