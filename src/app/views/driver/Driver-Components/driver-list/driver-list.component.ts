import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AllServicesService } from '../../../../views/all-services.service';
import { SharedService } from '../../../../views/Services/shared.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-driver-list',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './driver-list.component.html',
  styleUrl: './driver-list.component.scss'
})
export class DriverListComponent implements OnInit{

// drivers = [
//   { driving_license_no: 'MH463839300393', full_name: 'Upendra ', contact_no:'8765498768', licenseExpiry:'26-02-2030',is_verified:true},
//   { driving_license_no: 'MH463839300393', full_name: 'Atul Kumar',contact_no:'8765498768',licenseExpiry:'26-02-2030',is_verified:false},
//   { driving_license_no: 'MH463839300393', full_name: 'Anubhav Kumar' ,contact_no:'8765498768',licenseExpiry:'26-02-2030',is_verified:false},
//   { driving_license_no: 'MH463839300393', full_name: 'Deepak Kumar',contact_no:'8765498768',licenseExpiry:'26-02-2030',is_verified:false},
//   { driving_license_no: 'MH463839300393', full_name: 'Ravi Kumar' ,contact_no:'8765498768',licenseExpiry:'26-02-2030',is_verified:false},
//   { driving_license_no: 'MH463839300393', full_name: 'Tushar Kumar',contact_no:'8765498768',licenseExpiry:'26-02-2030',is_verified:false},
// ];

  drivers:any[] = [];

  vendorId: string = '';


constructor(private router: Router,private allServices:AllServicesService,private sharedService: SharedService){

}

ngOnInit(): void {
  this.vendorId = String(localStorage.getItem('vendorid'));
  this.getDrivers();
}

// getDrivers() {

//   const payload = {
//     "vendorid": this.vendorId
//   }

//   this.allServices.getDriverByVendor(payload).subscribe({
//     next: (res: any) => {
//       if (res.status === '00') {
//           // this.drivers = res.data;
//           this.drivers = res.data.map((item: any) => ({
//               ...item.DriverDetails,
//               driverId: item.driver_id
//             }));
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
//     }
//   });
 
// } 

getDrivers() {
  // const payload = {
  //   "vendorid": this.vendorId
  // }
  this.allServices.getDriverByVendor().subscribe({
    next: (res: any) => {
      if (res.status === '00') {
          // this.drivers = res.data.map((item: any) => item.DriverDetails);
          //  this.drivers = res.data.map((item: any) => ({
          //       ...item.DriverDetails,
          //       driverId: item.driver_id
          //     }));
          this.drivers = res.data
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


validatedDriver(driver:any){

}

validateDriver(driver:any){

}

}
