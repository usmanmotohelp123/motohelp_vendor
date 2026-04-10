import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDataDialogComponent } from './card-data-dialog.component';

describe('CardDataDialogComponent', () => {
  let component: CardDataDialogComponent;
  let fixture: ComponentFixture<CardDataDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardDataDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CardDataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
