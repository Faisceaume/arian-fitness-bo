import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodeFormComponent } from './methode-form.component';

describe('MethodeFormComponent', () => {
  let component: MethodeFormComponent;
  let fixture: ComponentFixture<MethodeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MethodeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
