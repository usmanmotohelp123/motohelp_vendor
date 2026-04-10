import { Component } from '@angular/core';
import { CardBodyComponent, CardComponent } from '@coreui/angular';

@Component({
  selector: 'app-vehicle-health-card',
  standalone: true,
  imports: [CardComponent, CardBodyComponent,],
  templateUrl: './vehicle-health-card.component.html',
  styleUrl: './vehicle-health-card.component.scss'
})
export class VehicleHealthCardComponent {

  totalVehicles: number = 0;
  activeVehicles: number = 0;
  accidentVehicles: number = 0;
  serviceVehicles: number = 0;
  repairVehicles: number = 0;

  constructor() {}

  ngOnInit(): void {
    this.loadVehicleHealth();
  }

  loadVehicleHealth() {
    // Mock data – replace with API response
    this.totalVehicles = 0;
    this.activeVehicles = 0;
    this.accidentVehicles = 0;
    this.serviceVehicles = 0;
    this.repairVehicles = 0;
  }

}
