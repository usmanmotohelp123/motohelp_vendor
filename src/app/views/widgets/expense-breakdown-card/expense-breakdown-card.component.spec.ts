import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseBreakdownCardComponent } from './expense-breakdown-card.component';

describe('ExpenseBreakdownCardComponent', () => {
  let component: ExpenseBreakdownCardComponent;
  let fixture: ComponentFixture<ExpenseBreakdownCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseBreakdownCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExpenseBreakdownCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
