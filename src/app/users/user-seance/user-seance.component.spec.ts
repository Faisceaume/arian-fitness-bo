import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSeanceComponent } from './user-seance.component';

describe('UserSeanceComponent', () => {
  let component: UserSeanceComponent;
  let fixture: ComponentFixture<UserSeanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSeanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSeanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
