import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardBodyComponent, CardComponent } from '@coreui/angular';

@Component({
  selector: 'app-expense-breakdown-card',
  standalone: true,
  imports: [CommonModule,CardComponent, CardBodyComponent,],
  templateUrl: './expense-breakdown-card.component.html',
  styleUrl: './expense-breakdown-card.component.scss'
})
export class ExpenseBreakdownCardComponent {
 expenses = {
    fuel: 0,
    food: 0,
    toll: 0,
    parking: 0,
    maintenance: 0,
    driverAdvance: 0
  };

  constructor() {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses() {
    // Replace with API later
    this.expenses = {
      fuel: 0,
      food: 0,
      toll: 0,
      parking: 0,
      maintenance: 0,
      driverAdvance: 0
    };
  }

}
