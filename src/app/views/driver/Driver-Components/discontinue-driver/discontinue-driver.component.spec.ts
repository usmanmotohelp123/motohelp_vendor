import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscontinueDriverComponent } from './discontinue-driver.component';

describe('DiscontinueDriverComponent', () => {
  let component: DiscontinueDriverComponent;
  let fixture: ComponentFixture<DiscontinueDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscontinueDriverComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DiscontinueDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
