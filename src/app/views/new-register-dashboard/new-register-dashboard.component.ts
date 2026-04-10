import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ValidateVehicleComponent } from '../vehicls/Vehicle-Components/validate-vehicle/validate-vehicle.component';

@Component({
  selector: 'app-new-register-dashboard',
  standalone: true,
  imports: [CommonModule,FormsModule,ValidateVehicleComponent],
  templateUrl: './new-register-dashboard.component.html',
  styleUrl: './new-register-dashboard.component.scss'
})
export class NewRegisterDashboardComponent implements OnInit{
  hasVehicle = false;

  validateVehicle:boolean = false;
  addKyc:boolean = false;

  constructor() {

  }

  ngOnInit(): void {
   
  }

}
