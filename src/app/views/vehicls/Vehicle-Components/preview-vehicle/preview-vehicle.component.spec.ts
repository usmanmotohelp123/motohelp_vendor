import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewVehicleComponent } from './preview-vehicle.component';

describe('PreviewVehicleComponent', () => {
  let component: PreviewVehicleComponent;
  let fixture: ComponentFixture<PreviewVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewVehicleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreviewVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
