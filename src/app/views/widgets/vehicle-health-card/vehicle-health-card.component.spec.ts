import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleHealthCardComponent } from './vehicle-health-card.component';

describe('VehicleHealthCardComponent', () => {
  let component: VehicleHealthCardComponent;
  let fixture: ComponentFixture<VehicleHealthCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleHealthCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VehicleHealthCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
