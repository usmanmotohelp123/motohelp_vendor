import { AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';
import { CardModule, ColComponent, RowComponent, WidgetStatDComponent } from '@coreui/angular';
import { ChartData } from 'chart.js';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CardDataDialogComponent } from '../card-data-dialog/card-data-dialog.component';
import { of } from 'rxjs';

type BrandData = {
  title : string; 
  icon: string
  values: any[]
}

// type BrandData = {
//   key: string;      // IMPORTANT
//   title: string;
//   icon: string;
//   values: any[];
// }


@Component({
  selector: 'app-widgets-brand',
  templateUrl: './widgets-brand.component.html',
  styleUrls: ['./widgets-brand.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  standalone: true,
  imports: [RowComponent, ColComponent, WidgetStatDComponent, IconDirective, ChartjsComponent, CommonModule,CardModule,]
})
export class WidgetsBrandComponent implements AfterContentInit {

  constructor(private changeDetectorRef: ChangeDetectorRef,private dialog: MatDialog,) {

  }

  @Input() withCharts?: boolean;
  // @ts-ignore
  chartOptions = {
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3
      }
    },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        display: false
      },
      y: {
        display: false
      }
    }
  };
  labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  datasets = {
    borderWidth: 2,
    fill: true
  };

  colors = {
    backgroundColor: 'rgba(255,255,255,.1)',
    borderColor: 'rgba(255,255,255,.55)',
    pointHoverBackgroundColor: '#fff',
    pointBackgroundColor: 'rgba(255,255,255,.55)'
  };

  brandData: BrandData[] = [
    {
      title: 'Load',
      icon:'cilTruck',
      values: [{ title: 'Total Drivers', value: '15'},{ title: 'Total Vehicles', value: '20' },{ title: 'Active Duties', value: '5'},{ title: 'Criticle Alert', value: '2' },{ title: 'Pending Invoice', value: '42' }],
      
    },

    // {
    //   title: 'TAT',
    //   icon: 'cilAvTimer', //{ title: 'tweets', value: '1.792' }
    //   values: [{ title: 'On Time', value: '10' },{ title: 'Due', value: '5' } ]

    // },
    {
      title: 'Sales',
      icon: 'cilCheckCircle',// { title: 'feeds', value: '1.292' }
      values: [{ title: 'Total Income', value: '100000' },{ title: 'Total Earnings', value: '50000' },{ title: 'Total Expenses', value: '50000' },{ title: 'Avg Expenses/Trip', value: '5000' }],
      
    },
 
  ];




// brandData: BrandData[] = [
//   {
//     key: 'load',
//     title: 'Load',
//     icon: 'cilTruck',
//     values: [
//       { title: 'Total Drivers', value: '15' },
//       { title: 'Total Vehicles', value: '20' },
//       { title: 'Active Duties', value: '5' },
//       { title: 'Critical Alert', value: '2' },
//       { title: 'Pending Invoice', value: '42' }
//     ]
//   },
//   {
//     key: 'sales',
//     title: 'Sales',
//     icon: 'cilCheckCircle',
//     values: [
//       { title: 'Net Income', value: '100000' },
//       { title: 'Total Earnings', value: '50000' },
//       { title: 'Total Expenses', value: '50000' },
//       { title: 'Avg Expenses/Trip', value: '5000' }
//     ]
//   }
// ];




  capStyle(value: string) {
    return !!value ? { '--cui-card-cap-bg': value } : {};
  }

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();
  }


  openBrandDialog(title: string) {
    // Fetch data based on the title passed from frontend
    this.getBrandDataByTitle(title).subscribe((res: any) => {
  
      // Calculate total if needed
      const total = res.reduce((acc: number, curr: any) => acc + Number(curr.value), 0);
      console.log(res,"<<<<<<<<<")
      // Open the dialog and pass data
      this.dialog.open(CardDataDialogComponent, {
        width: '600px',
        data: {
          title,     
          items: res, 
          total      
        }
      });
    });
  }



getBrandDataByTitle(title: string) {
  const demoData: Record<string, { title: string; value: string }[]> = {
    trip: [
      { title: 'Active', value: '15' },
      { title: 'Delivered', value: '20' },
      { title: 'Close', value: '5' },
      { title: 'NDA', value: '2' },
      { title: 'All Trip', value: '42' },
    ],
    tat: [
      { title: 'On Time', value: '10' },
      { title: 'Due', value: '5' },
    ],
    sales: [
      { title: 'Net Income', value: '100000' },
      { title: 'Net Earnings', value: '50000' },
      { title: 'Net Expenses', value: '50000' },
      { title: 'Avg Expenses/Trip', value: '5000' },
    ]
  };

  const key = title?.toLowerCase().trim();
  return of(demoData[key] ?? []);
}


// getBrandDataByTitle(key: string) {
//   const demoData: Record<string, { title: string; value: string }[]> = {
//     load: [
//       { title: 'Total Drivers', value: '15' },
//       { title: 'Total Vehicles', value: '20' },
//       { title: 'Active Duties', value: '5' },
//       { title: 'Critical Alert', value: '2' },
//       { title: 'Pending Invoice', value: '42' }
//     ],
//     tat: [
//       { title: 'On Time', value: '10' },
//       { title: 'Due', value: '5' }
//     ],
//     sales: [
//       { title: 'Net Income', value: '100000' },
//       { title: 'Total Earnings', value: '50000' },
//       { title: 'Total Expenses', value: '50000' },
//       { title: 'Avg Expenses/Trip', value: '5000' }
//     ]
//   };

//   return of(demoData[key] ?? []);
// }

  
  

}
