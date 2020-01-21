import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitCategoriesComponent } from './init-categories.component';

describe('InitCategoriesComponent', () => {
  let component: InitCategoriesComponent;
  let fixture: ComponentFixture<InitCategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitCategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
