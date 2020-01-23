import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NiveauxCrudComponent } from './niveaux-crud.component';

describe('NiveauxCrudComponent', () => {
  let component: NiveauxCrudComponent;
  let fixture: ComponentFixture<NiveauxCrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NiveauxCrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NiveauxCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
