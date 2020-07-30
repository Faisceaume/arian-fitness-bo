import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TropheeFormComponent } from './trophee-form.component';

describe('TropheeFormComponent', () => {
  let component: TropheeFormComponent;
  let fixture: ComponentFixture<TropheeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TropheeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TropheeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
