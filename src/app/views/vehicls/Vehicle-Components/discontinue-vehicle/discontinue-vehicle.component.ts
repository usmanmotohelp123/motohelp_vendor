import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AllServicesService } from '../../../all-services.service';
import { SharedService } from '../../../Services/shared.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-discontinue-vehicle',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './discontinue-vehicle.component.html',
  styleUrl: './discontinue-vehicle.component.scss'
})
export class DiscontinueVehicleComponent implements OnInit {



// vehicles = [
//   { vehicleNo: 'MH 02 JM 2626', permitNo: 'UP5520120009289', ownerMobile: '8262226338', permitExpiry: '07-02-2032', status: 'Inactive' },

//   { vehicleNo: 'MH 04 AB 4587', permitNo: 'DL3321456789012', ownerMobile: '9876543210', permitExpiry: '15-08-2030', status: 'Active' },

//   { vehicleNo: 'MH 01 XY 7788', permitNo: 'GJ7788996655443', ownerMobile: '9123456780', permitExpiry: '21-11-2031', status: 'Inactive' },

//   { vehicleNo: 'MH 03 CD 1199', permitNo: 'RJ4455667788990', ownerMobile: '9988776655', permitExpiry: '30-06-2029', status: 'Active' },

//   { vehicleNo: 'MH 05 PQ 5544', permitNo: 'KA2233445566778', ownerMobile: '8899001122', permitExpiry: '12-12-2033', status: 'Inactive' },

//   { vehicleNo: 'MH 48 LM 9087', permitNo: 'TN9988776655441', ownerMobile: '7766554433', permitExpiry: '19-03-2031', status: 'Active' }
// ];

vehicles:any[] = []
  
  showPin:boolean=false;
  showForm = false;
  rating:number = 0;
  vendorId: string = '';
  vehicleNumber:any
  DriverName:any
  remark:any;
  vehicleId: any;
  
  constructor(private router: Router,private allService:AllServicesService,private sharedService: SharedService){
  
  }
  
  ngOnInit(): void {
    console.log("Rating -> ",this.rating)
      this.vendorId = String(localStorage.getItem('vendorid'));
      this.getVehicle();
  }

  setRating(value: number) {
    this.rating = value;
  }
  
  validatedDriver(driver:any){
  
  }
  
  validateDriver(driver:any){
  
  }

getVehicle() {

  const payload = {
    "vendorid": this.vendorId
  }

  this.allService.getVehicleByVendor(payload).subscribe({
    next: (res: any) => {
      if (res.status === '00') {
          // this.vehicles = res.data[0].vehicleDetails;
          // this.vehicles = res.data.map((item: any) => item.vehicleDetails);
              this.vehicles = res.data.map((item: any) => ({
                ...item.vehicleDetails,
                vehicleId: item.vehicleId
              }));
             
          console.log("Test.....",this.vehicles)
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


showIncativeMessage(){
  this.sharedService.error("Vehicle is In-Active !");
  return;
}
  
  openPopup(event: Event) {
    event.stopPropagation(); // prevent immediate close
    this.showPin = true;
  }
  
    closePopup() {
      this.showPin = false;
    }
  
    /*  GLOBAL CLICK LISTENER */
    @HostListener('document:click')
    handleOutsideClick() {
      if (this.showPin) {
        this.closePopup();
      }
    }
  
  verifyPin() {
    this.showPin = false;
    this.showForm = true;
  }

handleVehicleClick(event: any, vehicle: any) {

  if (vehicle.verify_flag !== 'N') {
    this.openPopup(event);
    this.deleteVehicleData(vehicle);
  } else {
    this.showIncativeMessage();
  }

}

deleteVehicleData(vehicle: any){
  if(vehicle.verify_flag === 'N'){
     this.sharedService.error("Vehicle is Not Active !");
     return;
  }
  console.log("Vehicle>>>>>",vehicle)
  this.DriverName = ''
  this.vehicleNumber = vehicle.registration_no;
  this.vehicleId =  vehicle.vehicleId;
}

deleteVehicle(){
    const payload = {
    "vendorid": this.vendorId,
    "vehicleid":  this.vehicleId,
    "remark": this.remark,
    "RatingValue": this.rating
  }


  this.allService.deleteVehicle(payload).subscribe({
    next: (res: any) => {
      if (res.status === '00') {
        this.sharedService.success(res.message);
        this.vehicleNumber = null;
        this.remark = null,
        this.rating = 0
        this.showForm = false
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
