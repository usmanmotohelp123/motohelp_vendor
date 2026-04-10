import { Component } from '@angular/core';
import { CardBodyComponent, CardComponent } from '@coreui/angular';

@Component({
  selector: 'app-driver-performance-card',
  standalone: true,
  imports: [CardComponent, CardBodyComponent,],
  templateUrl: './driver-performance-card.component.html',
  styleUrl: './driver-performance-card.component.scss'
})
export class DriverPerformanceCardComponent {

  avgTrips: number = 0;
  avgEarnings: number = 0;
  avgRating: number = 0;
  avgDistance: number = 0;

  constructor() {}

  ngOnInit(): void {
    // Later you can replace this with API call
    this.loadDriverPerformance();
  }

  loadDriverPerformance() {
    // Mock data (replace with real API)
    this.avgTrips = 0;
    this.avgEarnings = 0;
    this.avgRating = 0;
    this.avgDistance = 0;
  }

}
