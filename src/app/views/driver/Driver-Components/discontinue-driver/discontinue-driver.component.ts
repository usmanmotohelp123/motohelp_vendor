import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AllServicesService } from '../../../all-services.service';
import { SharedService } from '../../../Services/shared.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-discontinue-driver',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './discontinue-driver.component.html',
  styleUrl: './discontinue-driver.component.scss'
})
export class DiscontinueDriverComponent implements OnInit{

//   drivers = [
//   { licenseNo: 'MH463839300393', driverName: 'Upendra ', mobileNo:'8765498768', licenseExpiry:'26-02-2030'},
//   { licenseNo: 'MH463839300393', driverName: 'Atul Kumar',mobileNo:'8765498768',licenseExpiry:'26-02-2030'},
//   { licenseNo: 'MH463839300393', driverName: 'Anubhav Kumar' ,mobileNo:'8765498768',licenseExpiry:'26-02-2030'},
//   { licenseNo: 'MH463839300393', driverName: 'Deepak Kumar',mobileNo:'8765498768',licenseExpiry:'26-02-2030'},
//   { licenseNo: 'MH463839300393', driverName: 'Ravi Kumar' ,mobileNo:'8765498768',licenseExpiry:'26-02-2030'},
//   { licenseNo: 'MH463839300393', driverName: 'Tushar Kumar',mobileNo:'8765498768',licenseExpiry:'26-02-2030'},
// ];

drivers:any[]=[];

showPin:boolean=false;
showForm = false;
rating:number = 0;
vendorId: string = '';
remark: any;
driverName:any
driverNumber:any
driverLicenseNumber:any
driverId: any;

constructor(private router: Router,private allServices:AllServicesService,private sharedService: SharedService){

}

ngOnInit(): void {

  this.vendorId = String(localStorage.getItem('vendorid'));
  this.getDrivers();
}

  setRating(value: number) {
    this.rating = value;
  }

validatedDriver(driver:any){

}

validateDriver(driver:any){

}


getDrivers() {

  const payload = {
    "vendorid": this.vendorId
  }

  this.allServices.getDriverByVendor(payload).subscribe({
    next: (res: any) => {
      if (res.status === '00') {
          // this.drivers = res.data.map((item: any) => item.DriverDetails);
           this.drivers = res.data.map((item: any) => ({
                ...item.DriverDetails,
                driverId: item.driver_id
              }));
          console.log("Test.....",res.data)
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
  this.sharedService.error("Driver is In-Active !");
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
  // after validation
  this.showPin = false;
  this.showForm = true;
}

handleVehicleClick(event: any, driver: any) {

  if (driver.is_verified === true) {
    this.openPopup(event);
    this.deleteDriverData(driver);
  } else {
    this.showIncativeMessage();
  }

}

deleteDriverData(driver: any) {
    if(driver.is_verified === false){
    //  this.sharedService.error("Vehicle is Not Active !");
     return;
  }
  console.log("Vehicle>>>>>",driver)
  this.driverName = driver.full_name
  this.driverNumber = driver.contact_no;
  this.driverLicenseNumber = driver.driving_license_no;
  this.driverId = driver.driverId
}

deleteDriver(){
  //   {
//     "driver_id": "SHR-5864",
//     "vendorid": "SHR2026040001",
//     "Remark": "AAAA",
//     "rating": 2
// }
    const payload = {
    "vendorid": this.vendorId,
    "driver_id":  this.driverId,
    "remark": this.remark,
    "RatingValue": this.rating
  }


  this.allServices.deleteDriver(payload).subscribe({
    next: (res: any) => {
      if (res.status === '00') {
        this.sharedService.success(res.message);
        this.driverNumber = null;
        this.driverLicenseNumber = null;
        this.driverName = null;
        this.remark = null,
        this.rating = 0
        this.showForm = false
      }
      else if (res.status === '02') {
        this.sharedService.success(res.message);
        this.driverNumber = null;
        this.driverLicenseNumber = null;
        this.driverName = null;
        this.remark = null,
        this.rating = 0
        this.showForm = false
      } 
       else {
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
