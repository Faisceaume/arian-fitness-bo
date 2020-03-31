import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrognutFormComponent } from './prognut-form.component';

describe('PrognutFormComponent', () => {
  let component: PrognutFormComponent;
  let fixture: ComponentFixture<PrognutFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrognutFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrognutFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
