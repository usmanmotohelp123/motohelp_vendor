import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverPerformanceCardComponent } from './driver-performance-card.component';

describe('DriverPerformanceCardComponent', () => {
  let component: DriverPerformanceCardComponent;
  let fixture: ComponentFixture<DriverPerformanceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverPerformanceCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DriverPerformanceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
