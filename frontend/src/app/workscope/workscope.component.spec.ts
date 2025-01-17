import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkscopeComponent } from './workscope.component';

describe('WorkscopeComponent', () => {
  let component: WorkscopeComponent;
  let fixture: ComponentFixture<WorkscopeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkscopeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkscopeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
