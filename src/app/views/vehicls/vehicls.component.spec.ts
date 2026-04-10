import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclsComponent } from './vehicls.component';

describe('VehiclsComponent', () => {
  let component: VehiclsComponent;
  let fixture: ComponentFixture<VehiclsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehiclsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VehiclsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
