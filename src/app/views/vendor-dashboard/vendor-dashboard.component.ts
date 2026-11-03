import { CommonModule } from '@angular/common';
import { Component,OnInit,AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AllServicesService } from '../all-services.service';
import { SharedService } from '../Services/shared.service';
import * as L from 'leaflet';
import { Router } from '@angular/router';
import { SocketService } from '../Services/socket.service';

@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [CommonModule,FormsModule,],
  templateUrl: './vendor-dashboard.component.html',
  styleUrl: './vendor-dashboard.component.scss'
})
export class VendorDashboardComponent implements AfterViewInit ,OnInit{


private map!: L.Map;
private selectedMarker: L.Marker | null = null;
onBoardId:any
  vendorId: any;
  vendorUserId: any;

constructor(private router: Router,private dialog: MatDialog, private allServices: AllServicesService, public sharedService: SharedService,private socketService:SocketService){

  }

  ngOnInit(): void {
     this.vendorId = String(localStorage.getItem('vendorId'));
     this.vendorUserId = String(localStorage.getItem('userId'));
     this.socketService.connect(this.vendorUserId!);
    // this.initMap();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map').setView([20.5937, 78.9629], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);
    this.getCurrentLocation();
    this.map.on('click', (e: any) => {
      this.setMarker(e.latlng.lat, e.latlng.lng);
    });
  }

  // private initMap(): void {
  //     this.map = L.map('map').setView([20.5937, 78.9629],5);
  //     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  //       {
  //         attribution: '&copy; OpenStreetMap contributors',
  //         maxZoom: 19
  //       }
  //    ).addTo(this.map);
  //   this.getCurrentLocation();
  //   this.map.on('click', (e: L.LeafletMouseEvent) => {
  //     this.setMarker(e.latlng.lat,e.latlng.lng);
  //   });
  // }

  private getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          this.map.setView([lat, lng], 15); 
          this.setMarker(lat, lng);
        },
        (error) => {
          console.error('Location error:', error);
        }
      );
    }
  }

  // private getCurrentLocation(): void {
  //   if (!navigator.geolocation) {
  //     console.error('Geolocation is not supported by this browser.');
  //     return;
  //   }
  //   navigator.geolocation.getCurrentPosition(
  //     (position: GeolocationPosition) => {
  //       const lat = position.coords.latitude;
  //       const lng = position.coords.longitude;
  //       console.log('Current Latitude:', lat);
  //       console.log('Current Longitude:', lng);
  //       console.log('Accuracy:',position.coords.accuracy,'meters');
  //       this.map.setView([lat, lng],16);
  //       this.setMarker(lat,lng);
  //     },
  //     (error: GeolocationPositionError) => {
  //       console.error('Geolocation Error:',error);
  //       switch (error.code) {
  //         case error.PERMISSION_DENIED:
  //           console.error('Location permission was denied.');
  //           break;
  //         case error.POSITION_UNAVAILABLE:
  //           console.error('Location information is unavailable.');
  //           break;
  //         case error.TIMEOUT:
  //           console.error('Location request timed out.');
  //           break;
  //       }
  //     },
  //     {
  //       enableHighAccuracy: true,
  //       timeout: 15000,
  //       maximumAge: 0
  //     });
  // }

  private setMarker(lat: number, lng: number): void {
    if (this.selectedMarker) {
      this.map.removeLayer(this.selectedMarker);
    }
    // const selectedIcon = L.icon({
    //     iconUrl: 'assets/images/Vector.png',
    //     iconSize: [40, 70],
    //     iconAnchor: [16, 32]
    //   });
    const selectedIcon = L.icon({
        iconUrl: 'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2_hdpi.png',
        iconSize: [40, 70],
        iconAnchor: [15, 45],
      });
    this.selectedMarker = L.marker([lat, lng],{icon:selectedIcon})
      .addTo(this.map)
      // .bindPopup('You are here 📍')
      .openPopup();
  }

  // private setMarker(lat: number,lng: number): void {
  //   if (this.selectedMarker) {
  //     this.map.removeLayer(this.selectedMarker);
  //   }
  //   const selectedIcon = L.icon({
  //     iconUrl:'https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2_hdpi.png',
  //     iconSize: [40, 70],
  //     iconAnchor: [20, 70]
  //   });
  //   this.selectedMarker = L.marker([lat, lng],{icon: selectedIcon}).addTo(this.map);
  // }


//  verifyId(){
//   this.router.navigate(['/vendorDashboard']);
//  }

  // verifyDriver() {
  //   const payload = {
  //       "onboard_id": this.onBoardId
  //   }
  //   // this.isVerified = true; // tempraray
  //    this.allServices.driverDetailsByScannerUID(this.vendorUserId,this.onBoardId).subscribe({
  //     next: (res: any) => {
  //       if (res.status === '00') {
  //       //   this.driverDetails = res.data;
  //       //   this.isVerified = true;
  //       //   this.driverFormPersonalInformation.patchValue({
  //       //     license_no: this.driverDetails.DrivingLicenseNo || '',
  //       //     dob: this.driverDetails.DOB ? this.formatDate(this.driverDetails.DOB) : '',
  //       //     phone_number: this.driverDetails.Mobile || '',
  //       //     full_name: this.driverDetails.FullName || '',
  //       //     nick_name: this.driverDetails.NickName || '',
  //       //     email: this.driverDetails.EmailId || ''
  //       //   });
  //       //   // License Images
  //       //   this.driverFormPersonalInformation.patchValue({
  //       //     dl_front_img: this.driverDetails.LicenseFrontImage || '',
  //       //     dl_back_img: this.driverDetails.LicenseBackImage || ''
  //       //   });
  //       //   this.frontFileName = this.driverDetails.LicenseFrontImage ? 'Front Image Uploaded' : '';
  //       //   this.backFileName = this.driverDetails.LicenseBackImage ? 'Back Image Uploaded' : '';
  //       //   // Address / KYC
  //       //   this.driverFormAddressKyc.patchValue({
  //       //     building: this.driverDetails.Building || '',
  //       //     street: this.driverDetails.Area || '',
  //       //     pincode: this.driverDetails.Pincode || '',
  //       //     tahsil: this.driverDetails.Tahsil || '',
  //       //     state: this.driverDetails.State || '',
  //       //     // district: this.driverDetails.District || '',
  //       //     adhaar: this.driverDetails.AadharNo || '',
  //       //     familyMemberApp: this.driverDetails.ReferredPersonName || '',
  //       //     phoneNumber: this.driverDetails.ReferredPersonContactNo || '',
  //       //     relation: this.driverDetails.Relation || ''
  //       //   });
  //       //   //  this.driverFormAddressKyc.patchValue({
  //       //   //   state: this.driverDetails.State || '',
  //       //   // });
  //       //   this.driverFormAddressKyc.patchValue({
  //       //     district: this.driverDetails.District || '',
  //       //   });

  //       // // Aadhaar Images
  //       // this.driverFormAddressKyc.patchValue({
  //       //   adhaar_front_img: this.driverDetails.AadharFrontImage || '',
  //       //   adhaar_back_img: this.driverDetails.AadharBackImage || ''
  //       // });
  //       // this.frontAdhaarImg = this.driverDetails.AadharFrontImage ? 'Front Image Uploaded' : '';
  //       // this.backAdhaarImg = this.driverDetails.AadharBackImage ? 'Back Image Uploaded' : '';
  //         const param = {
  //           data:res.data
  //         };
  //           this.router.navigate(['/onboardDriver'], {
  //               queryParams: param
  //           });
  //         // this.router.navigate(['/vendorDashboard']);
  //       } else {
  //         this.sharedService.error(res.message);
  //       }
  //     },
  //     error: (err) => {
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
  //       // this.isVerified = false;
  //     }
  //    });
  // }

  verifyDriver(): void {
    this.allServices.driverDetailsByScannerUID(this.vendorUserId,this.onBoardId).subscribe({
      next: (res: any) => {
        if (res.status === '00' && res.data) {
          this.sharedService.setDriverDetails(res.data);
          this.router.navigate(['/onboardDriver']);
          this.sharedService.closeOnboardModel()
        } else {
          this.sharedService.error(res.message);
        }
      },
      error: (err) => {
        console.error('Driver verification API error:', err);
        this.sharedService.error(
          err.error?.message || 'Something went wrong.'
        );
      }
    });
  }
  

}
