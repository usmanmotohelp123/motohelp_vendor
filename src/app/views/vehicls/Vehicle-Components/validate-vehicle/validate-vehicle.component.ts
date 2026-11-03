import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AllServicesService } from '../../../all-services.service';
import { SharedService } from '../../../Services/shared.service';
import { HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.prod';

@Component({
  selector: 'app-validate-vehicle',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,RouterModule],
  templateUrl: './validate-vehicle.component.html',
  styleUrl: './validate-vehicle.component.scss'
})
export class ValidateVehicleComponent implements OnInit {

  @Output() vehichleValidated = new EventEmitter<any>();

  addVehicleForm!: FormGroup;

  vehicleForm!: FormGroup;

  vehicles: any[] = [];

  vehicleFilter: string = 'unverified';
  vehicleSearch: string = '';

  showValidateForm:boolean=false;
  vendorId:String = '';
  vehicleDetails: any;
  vehicleType:any;
  vehicleId: any;

  showEditModal: boolean = false;
  selectedVehicle: any = null;
  editVehicleForm!: FormGroup;

  showOtpModal = false;
  selectedValidateVehicle: any = null;
  otp: string[] = ['', '', '', ''];
  
  baseUrl:string = "https://stag.motohelpindia.com"

vehicleWeightRanges = [
  { min: 0, max: 1000, vehicleType: 'MINI' },
  { min: 1001, max: 3000, vehicleType: 'MEDIUM' },
  { min: 3001, max: 7500, vehicleType: 'HEAVY' },
  { min: 7501, max: 12000, vehicleType: 'LCV' },
  { min: 12001, max: 25000, vehicleType: 'MCV' },
  { min: 25001, max: 50000, vehicleType: 'HCV' },
];

  isValidated: boolean = false;
  weight: any;
  bodyType: any;

  selectedBodyType: any = null;
  selectedFrontImage: string = '';
  selectedBackImage: string = '';

  
  constructor(private route: ActivatedRoute,private router: Router,private allServices:AllServicesService,private sharedService: SharedService,private fb: FormBuilder){

  }

  ngOnInit(): void {
        
  
     this.vendorId = String(localStorage.getItem('vendorId'));
     this.addVehicleForm = this.fb.group({
          vehicles: this.fb.array([
            this.createVehicle()
          ])
      });

      this.editVehicleForm = this.fb.group({
          registrationNumber: ['', Validators.required],
          loadingCapacity: ['', [Validators.required, Validators.min(1)]]
      });

        // this.vendorId = String(localStorage.getItem('vendorid'));
          // this.vehicles = [
          //   {
          //     registration_no: 'MH46F5158',
          //     verify_flag: 'Y'
          //   },
          //   {
          //     registration_no: 'MH46F5158',
          //     verify_flag: 'N'
          //   },
          //   {
          //     registration_no: 'MH46F5158',
          //     verify_flag: 'N'
          //   },
          //   {
          //     registration_no: 'MH46F5158',
          //     verify_flag: 'N'
          //   }
          // ];
  
       
      
      this.vehicleForm = this.fb.group({
        registration_no: [{ value: '', disabled: true }],
        body_type: ['', Validators.required],
        vehicle_weight: [{ value: '', disabled: true }],
        segment: [{ value: '', disabled: true }],
        dhala_length: ['', Validators.required],
        dhala_width: ['', Validators.required],
        dhala_height: ['', Validators.required],
        front_img: [null, Validators.required],
        back_img: [null],
        right_img: [null],
        left_img: [null],
        floring_img: [null],
        extra_img: [null]
      });

       this.getVehicle();
  }



 get vehicleControls(): FormArray {
    return this.addVehicleForm.get('vehicles') as FormArray;
  }

 createVehicle(): FormGroup {
    return this.fb.group({
      registrationNumber: ['',[Validators.required,Validators.pattern(/^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{1,4}$/)]],
      loadingCapacity: ['',[Validators.required,Validators.min(1)]]
    });
  }

  // addVehicle(): void {
  //     this.vehicleControls.controls.forEach(control => {
  //       control.markAllAsTouched();
  //     });
  //     this.vehicleControls.push(this.createVehicle());
  // }

  addVehicle() {
    this.vehicleControls.controls.forEach(control => {
      control.markAllAsTouched();
    });
    const last = this.vehicleControls.at(this.vehicles.length - 1);
    // Optional: prevent adding empty row
    if (last) {
      const reg = last.get('registrationNumber')?.value?.trim();
      const cap = last.get('loadingCapacity')?.value?.trim();
      if (!reg || !cap) {
        return; 
      }
    }
    this.vehicleControls.insert(0, this.createVehicle()); 
      this.vehicleControls.controls.forEach(group => {
      group.get('registrationNumber')?.clearValidators();
      group.get('registrationNumber')?.updateValueAndValidity();
      group.get('loadingCapacity')?.clearValidators();
      group.get('loadingCapacity')?.updateValueAndValidity();
    });
  }
  convertRegistrationToUpperCase(index: number): void {
    const control = this.vehicleControls.at(index).get('registrationNumber');
    if (control) {
      const value = control.value?.toUpperCase() || '';
      control.setValue(value, { emitEvent: false});
    }
  }


  submitVehicles(): void {
    if (this.addVehicleForm.invalid) {
      this.addVehicleForm.markAllAsTouched();
      return;
    }
    const vehicles = this.addVehicleForm.value.vehicles;
    const payload = {
      Vehicles: vehicles.map((vehicle: any) => ({
        VehicleNo: vehicle.registrationNumber,
        LoadingCapacity: Number(vehicle.loadingCapacity)
      }))
    };
    console.log('API Payload:', payload);
    this.allServices.addVehicle(payload).subscribe({
      next: (res: any) => {
        console.log('Add Vehicle Response:', res);
        if (res.status === '00') {
          this.sharedService.success(res.message);
          this.addVehicleForm.reset();
          this.getVehicle()
        } else {
          this.sharedService.error(res.message);
        }
      },
      error: (err) => {
        console.error('Add Vehicle Error:', err);
        if (err.status === 500) {
          this.sharedService.error('Internal server error. Please try again later.');
        } else if (err.status === 0) {
          this.sharedService.error('Network error. Please check your internet connection.');
        } else if (err.status === 502) {
          this.sharedService.error('Network error. Bad Gateway.');
        } else {
          this.sharedService.error(err.error?.message || 'Something went wrong.');
        }
      }
    });
  }


  submitEditedVehicle(): void {
    if (this.editVehicleForm.invalid) {
      this.editVehicleForm.markAllAsTouched();
      return;
    }
    const updatedVehicle = {
      VehicleId:this.selectedVehicle.VehicleId,
      VehicleNo:this.editVehicleForm.value.registrationNumber.toUpperCase(),
      LoadingCapacity:this.editVehicleForm.value.loadingCapacity
    };
    // console.log('Updated Vehicle:', updatedVehicle);
    // const index = this.vehicles.findIndex((v: any) => v.registration_no === this.selectedVehicle.registration_no);
    // if (index !== -1) {
    //   this.vehicles[index] = updatedVehicle;
    // }
    this.allServices.editVehicle(updatedVehicle).subscribe({
      next: (res: any) => {
        console.log('Add Vehicle Response:', res);
        if (res[0].Status === '00') {
          this.sharedService.success(res[0].Message);
          this.editVehicleForm.reset();
           this.closeEditModal();
          this.getVehicle()
        } else {
          this.sharedService.error(res[0].Message);
        }
      },
      error: (err) => {
        console.error('Add Vehicle Error:', err);
        if (err.status === 500) {
          this.sharedService.error('Internal server error. Please try again later.');
        } else if (err.status === 0) {
          this.sharedService.error('Network error. Please check your internet connection.');
        } else if (err.status === 502) {
          this.sharedService.error('Network error. Bad Gateway.');
        } else {
          this.sharedService.error(err.error?.message || 'Something went wrong.');
        }
      }
    });

  }




// getVehicle() {
//   const payload = {
//     "vendorid": this.vendorId
//   }
//   this.allServices.getVehicleByVendor(payload).subscribe({
//     next: (res: any) => {
//       if (res.status === '00') {
//           // this.vehicles = res.data;
//           // this.vehicles = res.data.map((item: any) => item.vehicleDetails);
//               this.vehicles = res.data.map((item: any) => ({
//                 ...item.vehicleDetails,
//                 vehicleId: item.vehicleId
//               }));
//              console.log("Test.....",this.vehicles)
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
//      }
//    });
//  } 

 getVehicle() {
  // const payload = {
  //   "vendorid": this.vendorId
  // }
  this.allServices.getVehicleByVendor().subscribe({
    next: (res: any) => {
      if (res.status === '00') {
          // this.vehiclesCount = res.data[0].vehicleDetails.vehicle_count;
          this.vehicles = res.data
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

  filteredVehicles(): any[] {
    let result = [...this.vehicles];
    if (this.vehicleFilter === 'verified') {
      result = result.filter(vehicle => vehicle.IsVerified === true);
    } 
    else if (this.vehicleFilter === 'unverified') {
      result = result.filter(vehicle => vehicle.IsVerified === false || vehicle.IsVerified === null);
    }
    if (this.vehicleSearch.trim()) {
      const search = this.vehicleSearch.toLowerCase().trim();
      result = result.filter(vehicle =>vehicle.registration_no ?.toLowerCase().includes(search));
    }
   return result;
  }


validateVehicle(vehicle: any) {
   if(vehicle.IsVerified === false || vehicle.IsVerified === null){
    //  this.showValidateForm = true
     this.selectedValidateVehicle = vehicle;
      this.otp = ['', '', '', ''];
      this.showOtpModal = true;

     this.vehicleDetails = vehicle;
     this.vehicleId  = vehicle.vehicleId
      this.getVehicleType()
      this.getBodyType()
   }
   else{
      this.sharedService.success("Vehicle "+vehicle.number+" Alredy Valideted");
   }
 }

closeOtpModal(): void {
  this.showOtpModal = false;
  this.selectedValidateVehicle = null;
  this.otp = ['', '', '', ''];
}
 skipVehicle(vehicle: any) {
   console.log('Skip:', vehicle);
 }

  moveToNext(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.value && index < 3) {
      const inputs = document.querySelectorAll<HTMLInputElement>('.otp-inputs input');
      inputs[index + 1]?.focus();
    }
  }

  moveToPrevious(event: Event, index: number): void {
    const keyboardEvent = event as KeyboardEvent;
    const input = event.target as HTMLInputElement;
    if (keyboardEvent.key === 'Backspace' && !input.value && index > 0) 
    {
      const inputs = document.querySelectorAll<HTMLInputElement>('.otp-inputs input');
      inputs[index - 1]?.focus();
    }
  }

  submitOtp(): void {
    const enteredOtp = this.otp.join('');
    if (enteredOtp.length !== 4) {
      // alert('Please enter 4 digit OTP');
      this.sharedService.error('Please enter 4 digit OTP');
      return;
    }
      
     this.showValidateForm = true
     this.vehicleDetails = this.selectedValidateVehicle
     this.vehicleId  = this.selectedValidateVehicle.vehicleId
     this.getVehicleType()
    console.log('Vehicle:', this.selectedValidateVehicle);
    console.log('OTP:', enteredOtp);
    // Call your OTP validation API here
    this.closeOtpModal();
  }

 editVehicle(vehicle: any): void {
    this.selectedVehicle = vehicle;
    this.editVehicleForm.patchValue({
      registrationNumber: vehicle.VehicleNo || '',
      loadingCapacity: vehicle.LoadingCapacity || ''
    });
    this.showEditModal = true;
  }

 closeEditModal(): void {
  this.showEditModal = false;
  this.selectedVehicle = null;
  this.editVehicleForm.reset();
}


getBodyType(){
   console.error('OTP API Error:');
  const capacity= this.vehicleForm.get('vehicle_weight')?.value
  this.allServices.getBodyType(capacity).subscribe({
    next: (res: any) => {
      if (res.status === '00') {
          this.bodyType = res.data
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


// selectBodyType(type: string): void {
//   this.vehicleForm.get('body_type')?.setValue(type);
// }

// selectBodyType(type: any): void {
//   this.vehicleForm.get('body_type')?.setValue(type.bodytype);
//   console.log('Selected Body Type:', type);
// }

selectBodyType(type: any): void {
  this.vehicleForm.get('body_type')?.setValue(type.bodytype);
  this.selectedBodyType = type;
  this.selectedFrontImage = type.front_image_url;
  this.selectedBackImage = type.back_image_url;
  console.log('Selected Body Type:', type);
  console.log('Front Image:', this.selectedFrontImage);
  console.log('Back Image:', this.selectedBackImage);
}


getVehicleType() {
  const weight = Number(this.vehicleDetails?.LoadingCapacity);
  console.log('Weight >>>', weight);
  const matchWeight = this.vehicleWeightRanges.find(range => weight >= range.min && weight <= range.max);
  this.vehicleType = matchWeight ? matchWeight.vehicleType : null;
  console.log('Vehicle Type >>>', this.vehicleType);
  this.vehicleForm.patchValue({
    registration_no: this.vehicleDetails?.VehicleNo || '',
    vehicle_weight: this.vehicleDetails?.LoadingCapacity || '',
    segment: this.vehicleType || ''
  });
  console.log('Vehicle Form >>>',this.vehicleForm.getRawValue());
 }

frontFileName = '';
backFileName = '';
rightFileName = '';
leftFileName = '';
floringFileName = '';
extraFileName = '';


onVehicleImageChange(event: any, field: string) {
  const file = event.target.files?.[0];
  if (!file) return;
  // Validate type
  const allowedTypes = ['image/png', 'image/jpeg'];
  if (!allowedTypes.includes(file.type)) {
    this.sharedService.error('Only JPG and PNG allowed');
    return;
  }
  // Set file name
  if (field === 'front_img') {
    this.frontFileName = file.name;
  }
  if (field === 'back_img') {
    this.backFileName = file.name;
  }
  if (field === 'right_img') {
    this.rightFileName = file.name;
  }
  if (field === 'left_img') {
    this.leftFileName = file.name;
  }
  if (field === 'floring_img') {
    this.floringFileName = file.name;
  }
  if (field === 'extra_img') {
    this.extraFileName = file.name;
  }
  // Store original File directly
  this.vehicleForm.patchValue({
    [field]: file
  });
  console.log('Selected File:', field, file);
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
//   if (field === 'floring_img') this.floringFileName = file.name;
//   if (field === 'extra_img') this.extraFileName = file.name;
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
//        console.log("Image Size (KB):", size.toFixed(2));

//       //  Patch form
//       this.vehicleForm.patchValue({
//         [field]: base64
//       });

//     };
//   };

//   reader.readAsDataURL(file);
// }

// base64Size(base64: string): number {
//   const base64String = base64.split(',')[1];
//   const sizeInBytes = (base64String.length * 3) / 4;
//   return sizeInBytes / 1024; // KB
// }




// onSubmitVehicle() {

//   if (this.vehicleForm.invalid) {
//     this.vehicleForm.markAllAsTouched();
//     this.sharedService.error('All Fields Required');
//     console.log('Form Value:', this.vehicleForm.getRawValue());
//     return;
//   }
//   // Body type must be selected
//   if (!this.selectedBodyType) {
//     this.sharedService.error('Please select Body Type');
//     return;
//   }

//   const form = this.vehicleForm.getRawValue();
//   const params = new HttpParams()
//     .set('rc_number',this.vehicleDetails?.VehicleNo || '')
//     .set('BodyType',form.body_type || '')
//     .set('LoadingCapacity',this.vehicleDetails?.LoadingCapacity?.toString() || '')
//     .set('DhalaHeight',form.dhala_height?.toString() || '')
//     .set('DhalaLength',form.dhala_length?.toString() || '')
//     .set('DhalaWidth',form.dhala_width?.toString() || '')
//     .set('FrontImage',this.selectedFrontImage || '')
//     .set('BackImage',this.selectedBackImage || '');
//   console.log('Query Params:', params.toString());
//   this.allServices.insertVehicleData(params).subscribe({
//     next: (res: any) => {
//       if (res.status === '00') {
//         this.sharedService.success(res.message);
//         this.vehicleForm.reset();
//         this.selectedBodyType = null;
//         this.selectedFrontImage = '';
//         this.selectedBackImage = '';
//         this.showValidateForm = false;
//       } else {
//         this.sharedService.error(res.message);
//       }
//     },
//     error: (err) => {
//       console.error('Insert Vehicle Error:', err);
//       this.sharedService.error(
//         err.error?.message || 'Error occurred'
//       );
//     }
//   });
// }

// onSubmitVehicle() {

//   if (this.vehicleForm.invalid) {
//     this.vehicleForm.markAllAsTouched();
//     this.sharedService.error('All Fields Required');
//     console.log('Form Value:', this.vehicleForm.getRawValue());
//     return;
//   }
//   if (!this.selectedBodyType) {
//     this.sharedService.error('Please select Body Type');
//     return;
//   }
//   const form = this.vehicleForm.getRawValue();
//   const payload = {
//     rc_number: this.vehicleDetails?.VehicleNo || '',
//     BodyType: form.body_type || '',
//     LoadingCapacity:this.vehicleDetails?.LoadingCapacity || '',
//     DhalaHeight:form.dhala_height || '',
//     DhalaLength:form.dhala_length || '',
//     DhalaWidth:form.dhala_width || '',
//     FrontImage:this.selectedFrontImage || '',
//     BackImage:this.selectedBackImage || ''
//   };
//   console.log('Request Payload:', payload);
//   this.allServices.insertVehicleData(payload).subscribe({
//     next: (res: any) => {
//       console.log('API Response:', res);
//       if (res.status === '00') {
//         this.sharedService.success(res.message);
//         this.vehicleForm.reset();
//         this.selectedBodyType = null;
//         this.selectedFrontImage = '';
//         this.selectedBackImage = '';
//         this.showValidateForm = false;
//       } else {
//         this.sharedService.error(res.message);
//       }
//     },
//     error: (err) => {
//       console.error('Insert Vehicle Error:', err);
//       this.sharedService.error(
//         err.error?.message || 'Error occurred'
//       );
//     }
//   });
// }


async onSubmitVehicle() {
  if (this.vehicleForm.invalid) {
    this.vehicleForm.markAllAsTouched();
    this.sharedService.error('All Fields Required');
    console.log('Form Value:',this.vehicleForm.getRawValue());
    return;
  }
  if (!this.selectedBodyType) {
    this.sharedService.error('Please select Body Type');
    return;
  }
  const form = this.vehicleForm.getRawValue();

  // console.log('All form values:', form);
  // console.log('Segment value:', form.segment);
  // console.log('Segment control:', this.vehicleForm.get('segment')?.value);

  try {
    // Create multipart/form-data
    const formData = new FormData();
    // Required fields
    formData.append('rc_number',this.vehicleDetails?.VehicleNo || '');
    // formData.append('Segment',form.segment || '');
    formData.append('Segment', String(this.vehicleType ?? ''));
    formData.append('LoadingCapacity',String(this.vehicleDetails?.LoadingCapacity || 0));
    formData.append('BodyType',form.body_type || '');
    formData.append('DhalaLength',String(form.dhala_length || 0));
    formData.append('DhalaWidth',String(form.dhala_width || 0));
    formData.append('DhalaHeight',String(form.dhala_height || 0));
     
    if (form.front_img instanceof File) {
      formData.append('FrontImage',form.front_img,form.front_img.name);
    }

   // Back Image
    if (form.back_img instanceof File) {
      formData.append('BackImage',form.back_img,form.back_img.name);
    }

    // Left Image
    if (form.left_img instanceof File) {
      formData.append('LeftImage',form.left_img,form.left_img.name);
    }

    // Right Image
    if (form.right_img instanceof File) {
      formData.append('RightImage',form.right_img,form.right_img.name);
    }

    console.log('FormData:');
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    this.allServices.insertVehicleData(formData)
      .subscribe({
        next: (res: any) => {
          console.log('API Response:', res);
          if (res.status === '00') {
            this.sharedService.success(res.message);
            this.vehicleForm.reset();
            this.selectedBodyType = null;
            this.selectedFrontImage = '';
            this.selectedBackImage = '';
            this.showValidateForm = false;
            this.frontFileName = '';
            this.backFileName = '';
            this.rightFileName = '';
            this.leftFileName = '';
            this.floringFileName = '';
            this.extraFileName = '';
            this.vehicleType=null;
            // this.getVehicle()
            // localStorage.setItem('isVehicleVerified',JSON.stringify(true));
            const data = {
               isVehicleVerified:true
            }
           this.sharedService.updateVerificationStatus(data);
           this.vehichleValidated.emit();
            this.ngOnInit()
          } else {
            this.sharedService.error(res.message);
          }
        },
        error: (err) => {
          console.error('Insert Vehicle Error:',err);
          this.sharedService.error(err.error?.message || 'Error occurred');
        }
      });

  } catch (error) {
    console.error('Image conversion error:',error);
    this.sharedService.error('Unable to load vehicle images');
  }
}

preview(){
   this.isValidated = true
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


 bankKyc(){
    // this.router.navigate(['/newRegisterDashboard'], {});
    this.vehichleValidated.emit();
 }


}
