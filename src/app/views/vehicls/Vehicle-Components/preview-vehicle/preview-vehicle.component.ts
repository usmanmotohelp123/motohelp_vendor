import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AllServicesService } from 'src/app/views/all-services.service';
import { SharedService } from 'src/app/views/Services/shared.service';

@Component({
  selector: 'app-preview-vehicle',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './preview-vehicle.component.html',
  styleUrl: './preview-vehicle.component.scss'
})
export class PreviewVehicleComponent implements OnInit {

  registration_no:string="MH473AS8902"
  vehicle_weight:number = 5000
  segment:string='Medium'
  body_type:string = 'Open'
  frontFileName:any
  backFileName:any
  rightFileName:any
  leftFileName:any
  VehicleId: any;
  vehicleDetails: any;

  constructor(private route: ActivatedRoute,private router: Router,private allServices:AllServicesService,private sharedService: SharedService,private fb: FormBuilder){

  }

  ngOnInit(): void {
      const state = history.state;
      console.log('Vehicle ID:', state.VehicleId);
      this.VehicleId = state.VehicleId
      if(this.VehicleId){
        this.getVehicleData();
      }
  }

  getVehicleData(){
    console.error('OTP API Error:');
    this.allServices.getVehicleData(this.VehicleId).subscribe({
      next: (res: any) => {
        if (res.status === '00') {
          this.vehicleDetails = res.data[0]
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

  // onVehicleImageChange(event: any, field: string) {
  //   const file = event.target.files[0];
  //   if (!file) return;

  //   // 1. Validate type
  //   const allowedTypes = ['image/png', 'image/jpeg'];
  //   if (!allowedTypes.includes(file.type)) {
  //     this.sharedService.error('Only JPG and PNG allowed');
  //     return;
  //   }

  //   // Set file name
  //   if (field === 'front_img') this.frontFileName = file.name;
  //   if (field === 'back_img') this.backFileName = file.name;
  //   if (field === 'right_img') this.rightFileName = file.name;
  //   if (field === 'left_img') this.leftFileName = file.name;

  //   const reader = new FileReader();

  //   reader.onload = (e: any) => {
  //     const img = new Image();
  //     img.src = e.target.result;

  //     img.onload = () => {

  //       const canvas = document.createElement('canvas');
  //       const ctx = canvas.getContext('2d');

  //       // Resize (smaller = better compression)
  //       let width = 250;
  //       let height = (img.height / img.width) * width;

  //       canvas.width = width;
  //       canvas.height = height;

  //       ctx?.drawImage(img, 0, 0, width, height);

  //       let base64 = '';
  //       let size = 0;
  //       let quality = 0.7;

  //       // Try compressing
  //       for (let i = 0; i < 10; i++) {

  //         base64 = canvas.toDataURL('image/jpeg', quality);
  //         size = this.base64Size(base64);

  //         if (size <= 7) {
  //           break; //  success
  //         }

  //         quality -= 0.1;

  //         // If quality too low → reduce dimension
  //         if (quality <= 0.1) {
  //           quality = 0.7;
  //           width *= 0.8;
  //           height *= 0.8;

  //           canvas.width = width;
  //           canvas.height = height;
  //           ctx?.drawImage(img, 0, 0, width, height);
  //         }
  //       }

  //       //  Final check
  //       if (size > 7) {
  //         this.sharedService.error('Image must be under 7KB. Please upload smaller image.');
  //         return;
  //       }

  //       //  const size = this.base64Size(base64);
  //       console.log("Image Size (KB):", size.toFixed(2));

  //       //  Patch form
  //       // this.vehicleForm.patchValue({
  //       //   [field]: base64
  //       // });

  //     };
  //   };

  //   reader.readAsDataURL(file);
  // }

  // base64Size(base64: string): number {
  //   const base64String = base64.split(',')[1];
  //   const sizeInBytes = (base64String.length * 3) / 4;
  //   return sizeInBytes / 1024; // KB
  // }

}
