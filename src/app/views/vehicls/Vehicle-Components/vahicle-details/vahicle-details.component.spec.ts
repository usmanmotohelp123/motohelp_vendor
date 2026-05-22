import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VahicleDetailsComponent } from './vahicle-details.component';

describe('VahicleDetailsComponent', () => {
  let component: VahicleDetailsComponent;
  let fixture: ComponentFixture<VahicleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VahicleDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VahicleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
