import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyFinancialsCardComponent } from './daily-financials-card.component';

describe('DailyFinancialsCardComponent', () => {
  let component: DailyFinancialsCardComponent;
  let fixture: ComponentFixture<DailyFinancialsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyFinancialsCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DailyFinancialsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
