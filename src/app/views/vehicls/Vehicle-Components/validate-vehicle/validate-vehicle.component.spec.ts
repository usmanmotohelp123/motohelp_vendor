import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateVehicleComponent } from './validate-vehicle.component';

describe('ValidateVehicleComponent', () => {
  let component: ValidateVehicleComponent;
  let fixture: ComponentFixture<ValidateVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidateVehicleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ValidateVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
