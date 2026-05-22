import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ValidateVehicleComponent } from '../vehicls/Vehicle-Components/validate-vehicle/validate-vehicle.component';
import { AddBankComponent } from '../add-bank/add-bank.component';
import { AllServicesService } from '../all-services.service';
import { Router } from '@angular/router';
import { SharedService } from '../Services/shared.service';

@Component({
  selector: 'app-new-register-dashboard',
  standalone: true,
  imports: [CommonModule,FormsModule,ValidateVehicleComponent,AddBankComponent],
  templateUrl: './new-register-dashboard.component.html',
  styleUrl: './new-register-dashboard.component.scss'
})
export class NewRegisterDashboardComponent implements OnInit{
 

  validateVehicle:boolean = false;
  //validateBank:boolean = false;
  addKyc:boolean = false;
  vendorId: string = '';
  isVehicle: string = 'N';
  vehicles: any;
  vehiclesCount: any;

  constructor(private router: Router,private allServices:AllServicesService,private sharedService: SharedService){

  }

  ngOnInit(): void {
    this.vendorId = String(localStorage.getItem('vendorid'));
    this.isVehicle = String(localStorage.getItem('flag'));
    console.log("Is Vehicle", this.isVehicle)
    this.getVehicle();
  }

  getVehicle() {

  const payload = {
    "vendorid": this.vendorId
  }

  this.allServices.getVehicleByVendor(payload).subscribe({
    next: (res: any) => {
      if (res.status === '00') {
          this.vehiclesCount = res.data[0].vehicleDetails.vehicle_count;
          // this.vehicles = res.data.map((item: any) => item.vehicleDetails);
          console.log("Test.....",res.data[0].vehicleDetails)
      } else {
        this.sharedService.error(res.message);
      }
    },
    error: (err) => {
      // console.error(err);
      // this.sharedService.error(err);
      console.error('OTP API Error:', err);
        if (err.status === 500) {
          this.sharedService.error('Internal server error. Please try again later.');
        } else if (err.status === 0) {
          this.sharedService.error('Network error. Please check your internet connection.');
        }else if (err.status === 502) {
            this.sharedService.error('Network error. Bat Gateway');
        }
         else {
          this.sharedService.error(err.error?.message || 'Something went wrong.');
        }
    }
  });
 
} 

  validateVehicleEnable(){
    this.validateVehicle = true;
    this.addKyc = false;
  }

  validateBankEnable(){
    this.validateVehicle = false;
    this.addKyc = true;
  }

}
