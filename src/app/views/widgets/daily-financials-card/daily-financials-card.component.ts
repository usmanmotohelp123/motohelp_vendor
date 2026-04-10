
import { Component } from '@angular/core';
// import { ChartConfiguration, ChartType } from 'chart.js';
import { CommonModule } from '@angular/common';
import { ChartjsComponent, ChartjsModule } from '@coreui/angular-chartjs';
import { CardModule } from '@coreui/angular';
// import { NgChartsModule } from 'ng2-charts'

@Component({
  selector: 'app-daily-financials-card',
  standalone: true,
  imports: [CommonModule,ChartjsModule,ChartjsComponent,CardModule],
  templateUrl: './daily-financials-card.component.html',
  styleUrl: './daily-financials-card.component.scss'
})
export class DailyFinancialsCardComponent {

// barChartType: ChartType = 'bar';

//   barChartData: ChartConfiguration<'bar'>['data'] = {
//     labels: ['Fuel', 'Food', 'Toll', 'Parking', 'Maintenance', 'Advance'],
//     datasets: [
//       {
//         label: 'Expense (₹)',
//         data: [1200, 500, 300, 150, 400, 250],
//         backgroundColor: '#2563eb',
//         borderRadius: 6,
//         barThickness: 40
//       }
//     ]
//   };

//   barChartOptions: ChartConfiguration<'bar'>['options'] = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { display: false }
//     },
//     scales: {
//       x: {
//         grid: { display: false }
//       },
//       y: {
//         beginAtZero: true,
//         ticks: {
//           callback: value => '₹' + value
//         }
//       }
//     }
//   };


barData = {
    labels: ['Fuel', 'Food', 'Toll', 'Parking', 'Maintenance', 'Advance'],
    datasets: [
      {
        label: 'Expense (₹)',
        // backgroundColor: '#2563eb',
        backgroundColor: [
        '#2563eb', // Fuel - blue
        '#16a34a', // Food - green
        '#f59e0b', // Toll - amber
        '#ef4444', // Parking - red
        '#8b5cf6', // Maintenance - purple
        '#0ea5e9'  // Advance - sky
        ],
        
        barThickness: 40,
        borderRadius: 6,
        data: [1200, 500, 300, 150, 400, 250]
      }
    ]
  };

  barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => `₹${value}`
        }
      },
      x: {
        grid: { display: false }
      }
    }
  };


}
