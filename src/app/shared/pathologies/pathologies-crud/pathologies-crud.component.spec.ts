import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PathologiesCrudComponent } from './pathologies-crud.component';

describe('PathologiesCrudComponent', () => {
  let component: PathologiesCrudComponent;
  let fixture: ComponentFixture<PathologiesCrudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PathologiesCrudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PathologiesCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
