import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AllServicesService } from '../../../../views/all-services.service';
import { SharedService } from '../../../../views/Services/shared.service';
import { CommonModule } from '@angular/common';
import { FormModule } from '@coreui/angular';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { SOCKET_EVENTS } from '../../../Socket/socket-events';
import { SocketService } from 'src/app/views/Services/socket.service';

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

  // selectedVehicle:any = ''
  // selectedDriver:any = ''
  selectedVehicle:any = null
  selectedDriver: any = null;

  drivers: any[] = [];

  vehicles: any[] = [];

details: any[] = [
  // {
  //   AssignID: 'Assign489627',
  //   AssignmentDate: '05 Feb 2026',
  //   VehicleNumber: 'MH46F5158',
  //   DriverName: 'Yuvraj Singh'
  // },
  // {
  //   AssignID: 'Assign489627',
  //   AssignmentDate: '05 Feb 2026',
  //   VehicleNumber: 'MH46F5158',
  //   DriverName: 'Yuvraj Singh'
  // },
  //  {
  //   AssignID: 'Assign489627',
  //   AssignmentDate: '05 Feb 2026',
  //   VehicleNumber: 'MH46F5158',
  //   DriverName: 'Yuvraj Singh'
  // },
  // {
  //   AssignID: 'Assign489627',
  //   AssignmentDate: '05 Feb 2026',
  //   VehicleNumber: 'MH46F5158',
  //   DriverName: 'Yuvraj Singh'
  // }
];

  vendorId: string ='';
  unassignedDetails: any;
  vendorUserId: any;

  constructor(private router: Router,private allService:AllServicesService,private sharedService: SharedService,private socketService:SocketService){
  
  }
  
  ngOnInit(): void {
     this.vendorId = String(localStorage.getItem('vendorId'));
     this.vendorUserId = String(localStorage.getItem('userId'));
     this.socketService.connect(this.vendorUserId!);
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

  // const payload = {
  //    "VendorID": this.vendorId,
  //    "verify_flag": "Y"
  // }

  this.allService.getDriverVehicleAssign().subscribe({
    next: (res: any) => {
      if (res.status === '00') {
        this.details = res.data.filter((item:any)=>item.IsActive === true)
        this.unassignedDetails = res.data.filter((item:any)=>item.IsActive === false)
      } else {
        //  this.details = res.data
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

  // const payload = {
  //   "vendorId": this.vendorId,
  // }
  this.allService.getUnassignDriver().subscribe({
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

  // const payload = {
  //   "vendorId": this.vendorId,
  // }

  this.allService.getUnassignVehicle().subscribe({
    next: (res: any) => {
      if (res.status === '00') {
         this.vehicles = res.data
        //  this.vehicles = res.data.filter((item: any) => item.IsVerified === true || item.IsVerified === 'true')
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

   console.log("driver>>>>> ",this.selectedDriver.DriverProfileId)
   const payload = {
    "DriverProfileId": this.selectedDriver.DriverProfileId,
     "VehicleId": this.selectedVehicle.VehicleId
    // "VehicleId": this.selectedVehicle.VehicleNo
   }

   const socketPayload = {
      "driverId":this.selectedDriver.DriverUserId,
      "vehicleId": this.selectedVehicle.VehicleNo
    }

  this.allService.assignVehicle(payload).subscribe({
    next: (res: any) => {
      if (res.status === '00') {
      //  this.sharedService.success(res.message);
      //  this.socketService.emitWhenConnected(SOCKET_EVENTS.DRIVER_VEHICLE_ASSIGNED_BY_VENDOR,socketPayload);
         this.socketService.emitWhenConnected(SOCKET_EVENTS.DRIVER_VEHICLE_ASSIGNED_BY_VENDOR,socketPayload, (response: any) => {
            if(response.status === "00"){
              this.sharedService.success(res.message);
              console.log('Driver Assigned... >>>>>>', response);
            }else{
              this.sharedService.error(res.message);
              console.log('Driver Not Assigned >>>>>>', response);
            }
          });
          this.getDriverVehicleAssign();
          this.getDriverAvailable();
          this.getVehicleAvailable();
        // this.details = res.data
          this.selectedDriver = null
          this.selectedVehicle = null
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


deassignDriver(DriverUserId:any,DriverProfileId:any,VehicleId:any) {

  //  const payload = {
  //    "VendorID":  this.vendorId,
  //    "AssignID": assignId,
  // }
   const payload = {
    "DriverProfileId": DriverProfileId,
     "VehicleId": VehicleId
   }

    const socketPayload = {
      "driverId":DriverUserId,
      "vehicleId": this.selectedVehicle
    }

  this.allService.diassignVehicle(payload).subscribe({
    next: (res: any) => {
      if (res.status === '00') {
      //  this.sharedService.success(res.message);
      //  this.socketService.emitWhenConnected(SOCKET_EVENTS.DRIVER_VEHICLE_DEASSIGNED_BY_VENDOR,socketPayload);
          this.socketService.emitWhenConnected(SOCKET_EVENTS.DRIVER_VEHICLE_DEASSIGNED_BY_VENDOR,socketPayload, (response: any) => {
            // console.log('Driver Deassigned... >>>>>>', response);
            if(response.status === "00"){
              this.sharedService.success(res.message);
                console.log('Driver Deassigned... >>>>>>', response);
            }else{
              this.sharedService.error(res.message);
              console.log('Driver Not Deassigned >>>>>>', response);
            }
          });
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
