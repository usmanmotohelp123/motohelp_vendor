import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AllServicesService } from '../../../all-services.service';
import { SharedService } from '../../../Services/shared.service';

@Component({
  selector: 'app-validate-vehicle',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './validate-vehicle.component.html',
  styleUrl: './validate-vehicle.component.scss'
})
export class ValidateVehicleComponent implements OnInit {

  vehicleForm!: FormGroup;

  vehicles:any[] = [];

  showValidateForm:boolean=false;
  vendorId:String = '';
  vehicleDetails: any;
  vehicleType:any;
  vehicleId: any;

vehicleWeightRanges = [
  { min: 0, max: 1000, vehicleType: 'MINI' },
  { min: 1001, max: 3000, vehicleType: 'MEDIUM' },
  { min: 3001, max: 7500, vehicleType: 'HEAVY' },
  { min: 7501, max: 12000, vehicleType: 'LCV' },
  { min: 12001, max: 25000, vehicleType: 'MCV' },
  { min: 25001, max: 50000, vehicleType: 'HCV' },
];
  

  constructor(private router: Router,private allServices:AllServicesService,private sharedService: SharedService,private fb: FormBuilder){

  }

  ngOnInit(): void {
      this.vendorId = String(localStorage.getItem('vendorid'));
      this.getVehicle();

      this.vehicleForm = this.fb.group({
        registration_no: [{ value: '', disabled: true }],

        body_type: ['', Validators.required],

        vehicle_weight: [{ value: '', disabled: true }],
        segment: [{ value: '', disabled: true }],

        dhala_length: ['', Validators.required],
        dhala_width: ['', Validators.required],
        dhala_height: ['', Validators.required],

        front_img: [null, Validators.required],
        back_img: [null, Validators.required],
        right_img: [null, Validators.required],
        left_img: [null, Validators.required]
      });

  }


getVehicle() {

  const payload = {
    "vendorid": this.vendorId
  }

  this.allServices.getVehicleByVendor(payload).subscribe({
    next: (res: any) => {
      if (res.status === '00') {
          // this.vehicles = res.data;
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


validateVehicle(vehicle: any) {
   if(vehicle.verify_flag === 'N'){
     this.showValidateForm = true
     this.vehicleDetails = vehicle;
     this.vehicleId  = vehicle.vehicleId
     this.getVehicleType()
   }
   else{
      this.sharedService.success("Vehicle "+vehicle.number+" Alredy Valideted");
   }

 }


getVehicleType() {
  const weight = this.vehicleDetails.vehicle_weight;
  console.log("weight>>>",weight)
  const matchWeight = this.vehicleWeightRanges.find(range => weight >= range.min && weight <= range.max);
  this.vehicleType = matchWeight ? matchWeight.vehicleType : null;
  console.log("vehicleType>>>",this.vehicleType)

    this.vehicleForm.patchValue({
      registration_no: this.vehicleDetails.registration_no,
      vehicle_weight: this.vehicleDetails.vehicle_weight,
      segment: this.vehicleType 
    });
}


frontFileName = '';
backFileName = '';
rightFileName = '';
leftFileName = '';

// onVehicleImageChange(event: any, field: string) {
//   const file = event.target.files[0];
//   if (!file) return;

//   // Set file name
//   if (field === 'front_img') this.frontFileName = file.name;
//   if (field === 'back_img') this.backFileName = file.name;
//   if (field === 'right_img') this.rightFileName = file.name;
//   if (field === 'left_img') this.leftFileName = file.name;

//   // Convert to base64
//   const reader = new FileReader();

//   reader.onload = () => {
//     this.vehicleForm.patchValue({
//       [field]: reader.result
//     });
//   };

//   reader.readAsDataURL(file);
// }



// onVehicleImageChange(event: any, field: string) {
//   const file = event.target.files[0];
//   if (!file) return;

//   // 1. Validate type
//   const allowedTypes = ['image/png', 'image/jpeg'];
//   if (!allowedTypes.includes(file.type)) {
//     // alert('Only JPG and PNG allowed');
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

//       const maxWidth = 300;
//       const scale = maxWidth / img.width;

//       canvas.width = maxWidth;
//       canvas.height = img.height * scale;

//       ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

//       let quality = 0.7;
//       let base64 = canvas.toDataURL('image/jpeg', quality);

//       // Reduce quality until <= 8KB
//       while (this.base64Size(base64) > 7 && quality > 0.1) {
//         quality -= 0.1;
//         base64 = canvas.toDataURL('image/jpeg', quality);
//       }

//       if (this.base64Size(base64) > 7) {
//           this.sharedService.error('Image must be under 7KB. Please upload smaller image.');
//         return;
//       }

//       this.vehicleForm.patchValue({
//         [field]: base64
//       });

//     };
//   };

//   reader.readAsDataURL(file);
// }

onVehicleImageChange(event: any, field: string) {
  const file = event.target.files[0];
  if (!file) return;

  // 1. Validate type
  const allowedTypes = ['image/png', 'image/jpeg'];
  if (!allowedTypes.includes(file.type)) {
    this.sharedService.error('Only JPG and PNG allowed');
    return;
  }

  // Set file name
  if (field === 'front_img') this.frontFileName = file.name;
  if (field === 'back_img') this.backFileName = file.name;
  if (field === 'right_img') this.rightFileName = file.name;
  if (field === 'left_img') this.leftFileName = file.name;

  const reader = new FileReader();

  reader.onload = (e: any) => {
    const img = new Image();
    img.src = e.target.result;

    img.onload = () => {

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Resize (smaller = better compression)
      let width = 250;
      let height = (img.height / img.width) * width;

      canvas.width = width;
      canvas.height = height;

      ctx?.drawImage(img, 0, 0, width, height);

      let base64 = '';
      let size = 0;
      let quality = 0.7;

      // Try compressing
      for (let i = 0; i < 10; i++) {

        base64 = canvas.toDataURL('image/jpeg', quality);
        size = this.base64Size(base64);

        if (size <= 7) {
          break; //  success
        }

        quality -= 0.1;

        // If quality too low → reduce dimension
        if (quality <= 0.1) {
          quality = 0.7;
          width *= 0.8;
          height *= 0.8;

          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
        }
      }

      //  Final check
      if (size > 7) {
        this.sharedService.error('Image must be under 7KB. Please upload smaller image.');
        return;
      }

      //  const size = this.base64Size(base64);
       console.log("Image Size (KB):", size.toFixed(2));

      //  Patch form
      this.vehicleForm.patchValue({
        [field]: base64
      });

    };
  };

  reader.readAsDataURL(file);
}

base64Size(base64: string): number {
  const base64String = base64.split(',')[1];
  const sizeInBytes = (base64String.length * 3) / 4;
  return sizeInBytes / 1024; // KB
}

// base64Size(base64: string): number {
//   let stringLength = base64.length - (base64.indexOf(',') + 1);
//   let sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
//   return sizeInBytes / 1024; // KB
// }


onSubmitVehicle() {

  if (this.vehicleForm.invalid) {
    this.vehicleForm.markAllAsTouched();
    this.sharedService.error("All Feilds Required");
    return;
  }

  // const formValue = this.vehicleForm.getRawValue();
  // const payload = {
  //   "vendorid": this.vendorId
  // }

   const form = this.vehicleForm.value;

    const payload = {
      vendorid: this.vendorId,
      vehicleid: this.vehicleId,

      vehicleDetails: {
        registrationNo: this.vehicleDetails.registration_no,
        bodyType: form.body_type
      },

      VehicleTypesDetails: {
        VehicleWeight: this.vehicleDetails.vehicle_weight,
        vehicleType: this.vehicleType, // from your getVehicleType()
        height: form.dhala_height,
        length: form.dhala_length,
        width: form.dhala_width
      },

      vehiclePhotos: {
        front_img: form.front_img,
        back_img: form.back_img,
        right_img: form.right_img,
        left_img: form.left_img
      }
    };


  console.log("Vehicle FormData:", payload);

  this.allServices.insertVehicleData(payload).subscribe({
    next: (res: any) => {
      if (res.status === '00') {
        this.sharedService.success(res.message);
        this.vehicleForm.reset();
        this.showValidateForm = false
        localStorage.setItem('flag', "Y");
      } else {
        this.sharedService.error(res.message);
      }
    },
    error: (err) => {
      console.error(err);
      this.sharedService.error("Error occurred");
    }
  });
}


 validatedVehicle(vehicle: any) {
  //  if(vehicle.verified === false){
  //    this.showValidateForm = true
  //  }
  //  else{
  //     this.sharedService.success("Vehicle "+vehicle.number+" Alredy Valideted");
  //  }

    this.router.navigate(['/vahicleDetails'], {
      queryParams: { id: vehicle.id, number: vehicle.number }
    });

 }


}
