import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrognutDetailsComponent } from './prognut-details.component';

describe('PrognutDetailsComponent', () => {
  let component: PrognutDetailsComponent;
  let fixture: ComponentFixture<PrognutDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrognutDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrognutDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
