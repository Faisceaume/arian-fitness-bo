import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TropheeDetailsComponent } from './trophee-details.component';

describe('TropheeDetailsComponent', () => {
  let component: TropheeDetailsComponent;
  let fixture: ComponentFixture<TropheeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TropheeDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TropheeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
