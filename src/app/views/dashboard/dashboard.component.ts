import { CommonModule, DatePipe, DOCUMENT, NgStyle } from '@angular/common';
import { Component, DestroyRef, effect, inject, OnInit, Renderer2, signal, WritableSignal, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Output, ViewChild } from '@angular/core';

import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartOptions } from 'chart.js';
import {
  AvatarComponent,
  ButtonDirective,
  ButtonGroupComponent,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  FormCheckLabelDirective,
  GutterDirective,
  ProgressBarDirective,
  ProgressComponent,
  RowComponent,
  TableDirective,
  TextColorDirective
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';

import { WidgetsBrandComponent } from '../widgets/widgets-brand/widgets-brand.component';
import { WidgetsDropdownComponent } from '../widgets/widgets-dropdown/widgets-dropdown.component';
import { DashboardChartsData, IChartProps } from './dashboard-charts-data';
import { MapViewComponent } from '../widgets/map-view/map-view.component';
import { LoadPostMapComponent } from '../widgets/load-post-map/load-post-map.component';
import { MatDialog } from '@angular/material/dialog';
import { AllServicesService } from '../all-services.service';
import { SharedService } from '../Services/shared.service';
import { DriverPerformanceCardComponent } from '../widgets/driver-performance-card/driver-performance-card.component';
import { VehicleHealthCardComponent } from '../widgets/vehicle-health-card/vehicle-health-card.component';
import { ExpenseBreakdownCardComponent } from '../widgets/expense-breakdown-card/expense-breakdown-card.component';
import { DailyFinancialsCardComponent } from '../widgets/daily-financials-card/daily-financials-card.component';

interface IUser {
  name: string;
  state: string;
  registered: string;
  country: string;
  usage: number;
  period: string;
  payment: string;
  activity: string;
  avatar: string;
  status: string;
  color: string;
}

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
  standalone: true,
  imports: [CommonModule,FormsModule, WidgetsDropdownComponent, TextColorDirective, CardComponent, CardBodyComponent, RowComponent,ColComponent,
           ButtonDirective, IconDirective, ReactiveFormsModule, ButtonGroupComponent, FormCheckLabelDirective,ChartjsComponent,
           NgStyle, CardFooterComponent, GutterDirective, ProgressBarDirective, ProgressComponent, WidgetsBrandComponent,CardHeaderComponent,
           TableDirective, AvatarComponent,MapViewComponent,LoadPostMapComponent,DriverPerformanceCardComponent,VehicleHealthCardComponent,ExpenseBreakdownCardComponent,
          DailyFinancialsCardComponent],
     schemas: [CUSTOM_ELEMENTS_SCHEMA],
     providers: [DatePipe]
})
export class DashboardComponent implements OnInit {
 
  selectedOption:any
  selectedOption1:any
 
  @ViewChild('activeTrip') activeTrip!: MapViewComponent;

  allActiveTrips: any[] = [];
  selectedRoute: [number, number][] = [];
  showModal = false;
  showModal1 = false;
  selectedTrip: any;
  autoShuffleIndex = 0;
  autoShuffleTimer: any;


constructor(private dialog: MatDialog, private allServices: AllServicesService, private sharedService: SharedService,) {
       
  }


ngOnInit(): void {
    // this.getActiveLoadPost();

  }

enableSelectOnMap(data:any){

}


// onChangeActiveTrips(trips: any[]) {
//   this.allActiveTrips = trips;

//   // auto-select first trip
//   if (trips?.length && !this.selectedTrip) {
//     this.selectedTrip = trips[0];
//   }
// }

onChangeActiveTrips(trips: any[]) {
  this.allActiveTrips = trips;

  if (trips?.length) {
    this.selectedTrip = trips[0];
    this.autoShuffleIndex = 0;

    // trigger map for first trip
    this.triggerTripChange(this.selectedTrip);

    this.startAutoShuffle();
  }
}

onOptionChange(event: any) {
  const tripId = event.target.value;
  this.selectedTrip = this.allActiveTrips.find(t => t.id == tripId);
    if (this.activeTrip) {
      this.activeTrip.onChangeTrip(this.selectedTrip.id);
    }
}


startAutoShuffle() {
  // clear existing timer (important)
  if (this.autoShuffleTimer) {
    clearInterval(this.autoShuffleTimer);
  }

  this.autoShuffleTimer = setInterval(() => {
    if (!this.allActiveTrips?.length) return;

    this.autoShuffleIndex =
      (this.autoShuffleIndex + 1) % this.allActiveTrips.length;

    this.selectedTrip = this.allActiveTrips[this.autoShuffleIndex];

    this.triggerTripChange(this.selectedTrip);

  }, 60000); // ⏱ 1 minute
}


triggerTripChange(trip: any) {
  if (!trip) return;

  if (this.activeTrip) {
    this.activeTrip.onChangeTrip(trip.id);
  }
}




  // getActiveLoadPost(){
  //     const obj = {
  //     CustomerID:'CM100144',
  //     // LoadPostID:""
      
  //     }
    
  //     this.allServices.getActiveLoadPost(obj).subscribe({
  //       next: (res: any) => {
  //         console.log(res);
  //         if (res.status === '00') {
  //           // this.vehicles = res.data;
  //           alert(res.message);
  //           console.log("Vehicles", res);
  //         }
  //         else{
  //           alert(res.message);
  //         }
  //       },
  //       error: (err) => {
  //         console.error(err);
  //         alert(err)
  //       }
  //     })
  // }

 
  


}
