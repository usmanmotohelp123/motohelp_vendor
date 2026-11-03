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
  isVehicleVerified:boolean = false;
  isKycVerified:boolean = false
    // isVehicleVerified:any;
    // isKycVerified:any

  constructor(private router: Router,private allServices:AllServicesService,public sharedService: SharedService){

  }

  ngOnInit(): void {
    this.getVehicleCounts()
    this.vendorId = String(localStorage.getItem('vendorid'));
    // this.isVehicle = String(localStorage.getItem('flag'));
    // this.isVehicleVerified = localStorage.getItem('isVehicleVerified')
    // this.isKycVerified = localStorage.getItem('isKycVerified')
      this.isVehicleVerified = JSON.parse(localStorage.getItem('isVehicleVerified') || 'false');
      this.isKycVerified = JSON.parse(localStorage.getItem('isKycVerified') || 'false');

      console.log('isVehicleVerified >>>',this.isVehicleVerified,typeof this.isVehicleVerified);
      console.log('isKycVerified >>>',this.isKycVerified,typeof this.isKycVerified);
    // this.getVehicle();
  }

 getVehicleCounts() {


  this.allServices.getVehicleCounts().subscribe({
    next: (res: any) => {
      if (res.status === '00') {
        this.vehiclesCount = res.data.totalVehicles;
      } else {
        this.sharedService.error(res.message);
      }
    },
    error: (err) => {
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

//  getVehicle() {
//   // const payload = {
//   //   "vendorid": this.vendorId
//   // }
//   this.allServices.getVehicleByVendor().subscribe({
//     next: (res: any) => {
//       if (res.status === '00') {
//           // this.vehiclesCount = res.data[0].vehicleDetails.vehicle_count;
//           this.vehicles = res.data
//           console.log("Test.....",res.data)
//       } else {
//         this.sharedService.error(res.message);
//       }
//     },
//     error: (err) => {
//       // console.error(err);
//       // this.sharedService.error(err);
//       console.error('OTP API Error:', err);
//         if (err.status === 500) {
//           this.sharedService.error('Internal server error. Please try again later.');
//         } else if (err.status === 0) {
//           this.sharedService.error('Network error. Please check your internet connection.');
//         }else if (err.status === 502) {
//             this.sharedService.error('Network error. Bat Gateway');
//         }
//          else {
//           this.sharedService.error(err.error?.message || 'Something went wrong.');
//         }
//      }
//    });
//   } 

  validateVehicleEnable(){
    this.validateVehicle = true;
    this.addKyc = false;
  }

  validateBankEnable(){
    this.validateVehicle = false;
    this.addKyc = true;
  }

  vehichleValidatedEvent(){
    this.validateVehicle = false;
    this.addKyc = false;
  }

}
