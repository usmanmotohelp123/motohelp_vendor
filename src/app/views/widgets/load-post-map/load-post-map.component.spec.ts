import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadPostMapComponent } from './load-post-map.component';

describe('LoadPostMapComponent', () => {
  let component: LoadPostMapComponent;
  let fixture: ComponentFixture<LoadPostMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadPostMapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoadPostMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
