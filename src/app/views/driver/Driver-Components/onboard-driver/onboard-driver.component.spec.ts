import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardDriverComponent } from './onboard-driver.component';

describe('OnboardDriverComponent', () => {
  let component: OnboardDriverComponent;
  let fixture: ComponentFixture<OnboardDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnboardDriverComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OnboardDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
