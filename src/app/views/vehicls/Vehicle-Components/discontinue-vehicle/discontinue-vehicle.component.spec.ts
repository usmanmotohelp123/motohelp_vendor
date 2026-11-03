import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscontinueVehicleComponent } from './discontinue-vehicle.component';

describe('DiscontinueVehicleComponent', () => {
  let component: DiscontinueVehicleComponent;
  let fixture: ComponentFixture<DiscontinueVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscontinueVehicleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DiscontinueVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
