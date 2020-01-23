import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectifsCrudComponent } from './objectifs-crud.component';

describe('ObjectifsCrudComponent', () => {
  let component: ObjectifsCrudComponent;
  let fixture: ComponentFixture<ObjectifsCrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectifsCrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectifsCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
