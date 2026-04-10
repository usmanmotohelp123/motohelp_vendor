import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegisterDashboardComponent } from './new-register-dashboard.component';

describe('NewRegisterDashboardComponent', () => {
  let component: NewRegisterDashboardComponent;
  let fixture: ComponentFixture<NewRegisterDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewRegisterDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewRegisterDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
