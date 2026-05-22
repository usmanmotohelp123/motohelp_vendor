import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AllServicesService } from '../../../../views/all-services.service';
import { SharedService } from '../../../../views/Services/shared.service';
import { CommonModule } from '@angular/common';
import { FormModule } from '@coreui/angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-assign-vehicle',
  standalone: true,
  imports: [CommonModule,FormsModule,FormModule,NgSelectModule],
  templateUrl: './assign-vehicle.component.html',
  styleUrl: './assign-vehicle.component.scss'
})
export class AssignVehicleComponent implements OnInit{


  assignEnable:boolean=true;

  informationEnable:boolean=true
  kycEnable:boolean = false
  driverDetailsEnable:boolean = false

  isVerified:boolean = false

  selectedVehicle:any = ''
  selectedDriver:any = ''

  drivers: any[] = [];

  vehicles: any[] = [];

details: any[] = [
  // {
  //   assignId: 'Assign489627',
  //   date: '05 Feb 2026',
  //   vehicleNo: 'MH46F5158',
  //   driverName: 'Yuvraj Singh'
  // },
  // {
  //   assignId: 'Assign489627',
  //   date: '05 Feb 2026',
  //   vehicleNo: 'MH46F5158',
  //   driverName: 'Yuvraj Singh'
  // },
  //  {
  //   assignId: 'Assign489627',
  //   date: '05 Feb 2026',
  //   vehicleNo: 'MH46F5158',
  //   driverName: 'Yuvraj Singh'
  // },
  // {
  //   assignId: 'Assign489627',
  //   date: '05 Feb 2026',
  //   vehicleNo: 'MH46F5158',
  //   driverName: 'Yuvraj Singh'
  // }
];

  vendorId: string ='';
  
  
  constructor(private router: Router,private allService:AllServicesService,private sharedService: SharedService){
  
  }
  
  ngOnInit(): void {
   this.vendorId = String(localStorage.getItem('vendorid'));
   this.getDriverVehicleAssign();
   this.getDriverAvailable();
   this.getVehicleAvailable();
  }

  toggleAssignEnableButton() {
    this.assignEnable = !this.assignEnable
  }

  deleteItem(){
    
  }

  verifyDriver(){
    this.isVerified = true
  }





  // toggleInformationButton(){
  //   this.informationEnable = !this.informationEnable
  // }

  // toggleDriverDetailsButton(){
  //   this.driverDetailsEnable = true;
  // }


getDriverVehicleAssign(){

  const payload = {
     "VendorID": this.vendorId,
     "verify_flag": "Y"
  }

  this.allService.getDriverVehicleAssign(payload).subscribe({
    next: (res: any) => {
      if (res.status === '00') {
        this.details = res.data
      } else {
         this.details = res.data
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


getDriverAvailable(){

  const payload = {
    "vendorId": this.vendorId,
  }


  this.allService.getDriverAvailable(payload).subscribe({
    next: (res: any) => {
      if (res.status === '00') {
       // this.sharedService.success(res.message);
         this.drivers = res.data
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

getVehicleAvailable(){

  const payload = {
    "vendorId": this.vendorId,
  }

  this.allService.getVehicleAvailable(payload).subscribe({
    next: (res: any) => {
      if (res.status === '00') {
        // this.sharedService.success(res.message);
         this.vehicles = res.data
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

assignDriver() {

   const payload = {
    "DriverID": this.selectedDriver,
     "VendorID":  this.vendorId,
     "VehicleID": this.selectedVehicle
  }

  this.allService.assignVehicle(payload).subscribe({
    next: (res: any) => {
      if (res.status === '00') {
       this.sharedService.success(res.message);
          this.getDriverVehicleAssign();
          this.getDriverAvailable();
          this.getVehicleAvailable();
        // this.details = res.data
        this.selectedDriver = ''
        this.selectedVehicle = ''
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


deassignDriver(assignId:any) {

   const payload = {
     "VendorID":  this.vendorId,
     "AssignID": assignId,
  }

  this.allService.diassignVehicle(payload).subscribe({
    next: (res: any) => {
      if (res.status === '00') {
       this.sharedService.success(res.message);
          this.getDriverVehicleAssign();
          this.getDriverAvailable();
          this.getVehicleAvailable();
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




}
