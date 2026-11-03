import { Component, NgZone, OnInit, Type } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective } from '@coreui/angular';
import { ActivatedRoute, Router, RouterModule} from '@angular/router';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AllServicesService } from '../../all-services.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedService } from '../../Services/shared.service';
import { LoginComponent } from '../login/login.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../Services/auth.service';
declare var google: any;

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: true,
    imports: [ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent,
       FormDirective, InputGroupComponent,InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective,
        CommonModule,FormsModule,ReactiveFormsModule,HttpClientModule,NgSelectModule,RouterModule,MatTooltipModule]
})
export class RegisterComponent implements OnInit {

  private apiKey = 'AIzaSyBam0VcHF4WsWfiDVxjaW82Xt7xhhvlXvk';
  registerForm!: FormGroup;
  documentsForm!: FormGroup;
  company:string | undefined
  mobileNo: any;
  stateList: any;
  cityList: any;
  locations:any
  lastSelectedState: string | null = null;
  isMobileReadonly = false;

  registrationType:   'organization' | 'individual' = 'individual';

 companyList: any[] = [
  { name: 'OWENER/INDIVIDUAL' },
  { name: 'PROPRIETORSHIP' },
  { name: 'CHALAK MALAK' },
  { name: 'PARTNERSHIP' },
  { name: 'PVT LTD' },
  { name: 'LLP' }
];

  isLegalDocumentsForm:boolean = false
  isAuthoritiesForm:boolean = false

  stateControl: any;
  districtControl: any;
  companyControl:any
  googleAddressControl:any;

  stateHasValue = false;
  districtHasValue = false;
  companyHasValue = false;
  googleAddressHasValue = false;
  selectedAddressComponents: any;

  private googleLocationCache: any = null;
  

  pincode:any;
  state:any;

  verifyState = {
    aadhaar: 'idle',   
    pan: 'idle',
    gst: 'idle'
  };

  registerValue: any;
  docomentsData: any;
  authoritiesData: any;

  authorityForm!: FormGroup;
  maxAuthorities = 1;
  backToAuthority: boolean = false;


constructor(private fb: FormBuilder,private route: ActivatedRoute,private allServices: AllServicesService,private http:HttpClient,
 private authService:AuthService, private sharedService: SharedService,private router: Router,private zone: NgZone) 
{

}

  ngOnInit(): void {

   this.registerForm = this.fb.group({
      vendorName: ['', Validators.required],
      organizationType:['', Validators.required],
      authorizesPerson: ['',Validators.required],
      mobileno: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      address1: ['', Validators.required],
      address2: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      town: [''],
      state: ['', Validators.required],
      district: ['', Validators.required]
    });
  
    this.documentsForm = this.fb.group({
        // aadhaar: ['', Validators.required],//Validators.pattern(/^[2-9]{1}[0-9]{11}$/)     
        pan: ['', [Validators.required,Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],  
        gst: ['', [Validators.pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)]],
        chekMark:[false],
        organisation:[''],
        // NoOfVehicle:['',Validators.required],
        // vehicles: this.fb.array([])
         vehicles: this.fb.array([
            this.createVehicleGroup()
          ])
      });
      // this.createVehicleFields()

    // this.authorityForm = this.fb.group({
    //     NoOfAuthority:[0],
    //     authorities: this.fb.array([])
    //   });
    //   this.createAuthoritiesFields()

    // Get Query Params
    this.route.queryParams.subscribe(params => {
      this.mobileNo = params['mobileNo'];
      if (this.mobileNo) {
        this.registerForm.patchValue({
          mobileno: this.mobileNo
        });
        // this.registerForm.get('mobileno')?.disable();
        this.isMobileReadonly = true;
      }
    });

      this.stateControl = this.registerForm.get('state');
      this.districtControl = this.registerForm.get('district');
      this.companyControl = this.registerForm.get('companyType');
      this.googleAddressControl = this.registerForm.get('googleAddress');

      //  Keep track of value changes for label animation
      this.stateControl.valueChanges.subscribe((val: string) => {
          this.stateHasValue = !!val;
      });
      this.districtControl.valueChanges.subscribe((val: string) => {
          this.districtHasValue = !!val;
      });

      this.companyControl.valueChanges.subscribe((val: string) => {
          this.companyHasValue = !!val;
      });
   
      this.googleAddressControl.valueChanges.subscribe((val: string) => {
          this.googleAddressHasValue = !!val;
      });
      // this.setValidatorsByType();
      this.getStateData()
  }

  onNoGstChange(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const gstControl = this.documentsForm.get('gst');
    if (checked) {
      gstControl?.setValue('');
      gstControl?.disable();
    } else {
      gstControl?.enable();
    }
  }


get vehicles(): FormArray {
  return this.documentsForm.get('vehicles') as FormArray;
}  

createVehicleGroup(): FormGroup {
  return this.fb.group({
    registrationNumber: ['', Validators.required],
    loadingCapacity: ['', Validators.required]
  });
}

addVehicle() {
  const last = this.vehicles.at(this.vehicles.length - 1);

  // Optional: prevent adding empty row
  if (last) {
    const reg = last.get('registrationNumber')?.value?.trim();
    const cap = last.get('loadingCapacity')?.value?.trim();
    if (!reg || !cap) {
      return; 
    }
  }

  // this.vehicles.push(this.createVehicleGroup());
   this.vehicles.insert(0, this.createVehicleGroup()); 
    this.vehicles.controls.forEach(group => {
    group.get('registrationNumber')?.clearValidators();
    group.get('registrationNumber')?.updateValueAndValidity();
    group.get('loadingCapacity')?.clearValidators();
    group.get('loadingCapacity')?.updateValueAndValidity();
  });
}


  convertRegistrationToUpperCase(index: number): void {
    const control = this.vehicles.at(index).get('registrationNumber');
    if (control) {
      const value = control.value?.toUpperCase() || '';
      control.setValue(value, { emitEvent: false});
    }
  }

// createVehicleFields() {
//   this.documentsForm.get('NoOfVehicle')?.valueChanges.subscribe((count: any) => {
//     const vehicleCount = Number(count);   // convert string → number
//     this.vehicles.clear();
//     if (vehicleCount > 0) {
//       for (let i = 0; i < vehicleCount; i++) {
//         const vehicleGroup = this.fb.group({
//           registrationNumber: ['', Validators.required],
//           loadingCapacity: ['', Validators.required]
//         });
//         this.vehicles.push(vehicleGroup);
//       }
//     }
//   });
// }



// get authorities(): FormArray {
//   return this.authorityForm.get('authorities') as FormArray;
// }  

// createAuthoritiesFields() {
//   this.authorityForm.get('NoOfAuthority')?.valueChanges.subscribe((count: any) => {
//     const authorityCount = Number(count);
//     this.authorities.clear();
//     if (authorityCount > 0) {
//       for (let i = 0; i < authorityCount; i++) {
//         const authorityGroup = this.fb.group({
//           // department: ['', Validators.required],
//           // level: ['', Validators.required],
//           designation: ['', Validators.required],
//           name: ['', Validators.required],
//           mobile: ['', Validators.required],
//           email: [''], 
//         });
//         this.authorities.push(authorityGroup);
//       }
//     }
//   });
// }

 // Optional events if you want to handle select change
onStateChange(event: any) {
  // logic if needed (optional)
}

onDistrictChange(event: any) {
  // logic if needed (optional)
}


  // getPincodeLocation(event:any){
  //     const pincode = String(event.target.value)
  //   // const payload = {
  //   //   pincode:String(event.target.value)
  //   // }
  // console.log("Pincode Data>>>>>>>>>>>");
  //   this.allServices.getLoctionPincode(pincode).subscribe({
  //     next: (res: any) => {
  //       if (res.status === '00') {
  //           console.log("Pincode Data>>>>>>>>>>>", res.data);
  //           this.registerForm.patchValue({
  //             state: res.data.state,
  //             district:  res.data.district
  //           })
  //       } else {
  //         this.sharedService.error(res.message);
  //       }
  //     },
  //     error: (err) => {
  //       console.error(err);
  //       this.sharedService.error(err);
  //     }
  //   });
  // } 

  getPincodeLocation(event: any): void {
    const pincode = String(event.target.value).trim();
    if (pincode.length !== 6) {
      return;
    }
    this.allServices.getLoctionPincode(pincode).subscribe({
      next: (res: any) => {
        if (res.status !== '00') {
          this.sharedService.error(res.message);
          return;
        }
        const state = res.data.state?.trim();
        const district = res.data.district?.trim();
        this.allServices.getStates().subscribe({
          next: (stateRes: any) => {
            if (stateRes.status !== '00') {
              return;
            }
            this.stateList = stateRes.data;
            const matchedState = this.stateList.find((item: any) =>item.state?.trim().toLowerCase() === state?.toLowerCase());
            if (!matchedState) {
              console.log('State not found:', state);
              return;
            }
            this.registerForm.patchValue({
              state: matchedState.state
            });
            this.allServices.getDistricts(matchedState.state).subscribe({
              next: (districtRes: any) => {
                if (districtRes.status !== '00') {
                  return;
                }
                this.cityList = districtRes.data;
                const matchedDistrict = this.cityList.find((item: any) =>(typeof item === 'string' ? item : item.district) ?.trim().toLowerCase() === district?.toLowerCase());
                this.registerForm.patchValue({
                  district: matchedDistrict ? (typeof matchedDistrict === 'string' ? matchedDistrict : matchedDistrict.district) : ''
                });
              },
              error: (err: any) => console.error(err)
            });
          },
          error: (err: any) => console.error(err)
        });
      },
      error: (err: any) => {
        console.error(err);
        this.sharedService.error('Unable to fetch pincode details');
      }
    });
  }


  getStateData() {
    if (this.stateList && this.stateList.length > 0) {
      console.log(" Using cached state list");
      return;
    }
    // const payload = { state: "" };
    // this.getLocation(payload, "state");
    this.allServices.getStates().subscribe({
      next: (res: any) => {
        if (res.status === '00') {
            this.stateList = res.data;
            console.log("States2>>>>>>>>>>>", this.stateList);
        } else {
          this.sharedService.error(res.message);
        }
      },
      error: (err) => {
        console.error(err);
        this.sharedService.error(err);
      }
    });
  }

  getCityData() {
    const currentState = this.registerForm.get('state')?.value;
    // // No state selected → skip
    if (!currentState) {
      console.log("⚠ Select state first");
      this.sharedService.error("⚠ Select state first");
      return;
    }
    // If data already exists for selected state, do not call
    if (this.lastSelectedState === currentState && this.cityList?.length > 0) {
      console.log(" Using cached city list");
      return;
    }
    // // Update state
    this.lastSelectedState = currentState;

    // const payload = { state: currentState };
    // this.getLocation(payload, "city");
    this.allServices.getDistricts(currentState).subscribe({
      next: (res: any) => {
        if (res.status === '00') {
            this.cityList = res.data;
            console.log("States2>>>>>>>>>>>", this.cityList);
        } else {
          this.sharedService.error(res.message);
        }
      },
      error: (err) => {
        console.error(err);
        this.sharedService.error(err);
      }
    });
  }


  getLocation(payload: any, type: string) {
    this.allServices.getLocations(payload).subscribe({
      next: (res: any) => {
        if (res.status === '00') {
          if (type === 'state') {
            this.stateList = res.data;
            console.log("States2>>>>>>>>>>>", this.stateList);
          } else if (type === 'city') {
            this.cityList = res.data;
          } 
        } else {
          this.sharedService.error(res.message);
        }
      },
      error: (err) => {
        console.error(err);
        this.sharedService.error(err);
      }
    });
  }


  trackByIndex(index: number): number {
    return index;
  }

  goToVendorRegisterForm(){
     this.isLegalDocumentsForm = false
      this.isAuthoritiesForm = false;
       // refresh floating label states
      setTimeout(() => {
        this.stateHasValue = !!this.stateControl?.value;
        this.districtHasValue = !!this.districtControl?.value;
        this.companyHasValue = !!this.companyControl?.value;
        this.googleAddressHasValue = !!this.googleAddressControl?.value;
      });
  }

  // goToAuthorityForm(){
  //   this.isAuthoritiesForm = true;
  //   this.isLegalDocumentsForm = false;
  //   this.backToAuthority = true
  // }

submitVendor(){
    console.log("Clicked!!")
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
     }
      // this.isAuthoritiesForm = true;
     this.isLegalDocumentsForm = true
     this.registerValue = this.registerForm.value;
     console.log(">>>>Register Value >>", this.registerValue)
}


// submitAthority(){
//     if (this.authorityForm.invalid) {

//     this.authorityForm.markAllAsTouched();
//     // Mark FormArray controls
//     this.authorities.controls.forEach((authority: any) => {
//       authority.markAllAsTouched();
//     });
//     console.log(">>>>Error>>", this.authorityForm);
//     return;
//   }
//   this.isLegalDocumentsForm = true;
//   this.isAuthoritiesForm = false;
//   this.authoritiesData = this.authorityForm.value;
 
// }

submitDocuments() {

  if (this.documentsForm.invalid) {
    this.documentsForm.markAllAsTouched();
    this.vehicles.controls.forEach((vehicle: any) => {
      vehicle.markAllAsTouched();
    });
    console.log(">>>>Error>>", this.documentsForm);
    return;
  }
  this.docomentsData = this.documentsForm.value;
  console.log(">>>>this.docomentsData>>", this.docomentsData);
    // this.isLegalDocumentsForm = true;
    // this.isAuthoritiesForm = false;
   this.submit();
}


  // skip(){

  //   // get form array
  //   const authoritiesArray = this.authorities;
  //   // loop through all rows
  //   authoritiesArray.controls.forEach((group: any) => {
  //     Object.keys(group.controls).forEach(field => {
  //       const control = group.get(field);
  //       // remove validators
  //       control.clearValidators();
  //       // reset errors
  //       control.setErrors(null);
  //       // update state
  //       control.updateValueAndValidity();
  //     });
  //   });
   
  //   this.isAuthoritiesForm = false;
  //   this.isLegalDocumentsForm = true;
  //   // this.submit();
  // }



// submit() {

//   const payload = {
//     VendorDetails: {
//       companyType: this.registerValue.companyType,
//       companyName: this.registerValue.companyName,
//       owner_name: this.registerValue.owenerName,
//       Building: this.registerValue.address1,   
//       Area: this.registerValue.address2,      
//       mobileNo: this.registerValue.mobileno,
//       pincode: String(this.registerValue.pincode),
//       district: this.registerValue.district,   
//       Tahsil: this.registerValue.town,
//       state: this.registerValue.state
//     },

//     VehicleDetails: this.vehicles.value
//       .filter((v: any) =>
//         v.registrationNumber?.trim() &&
//         v.loadingCapacity?.toString().trim())
//       .map((v: any) => ({
//         vehicle_number: v.registrationNumber,
//         vehicle_weight: v.loadingCapacity  
//       })),

//     kycDetails: {
//       gstNo: this.docomentsData.gst || '',
//       cinNo: '',
//       panNo: this.docomentsData.pan,
//       aadharNo: this.docomentsData.aadhaar || ''
//     }
// };

//   this.allServices.postVendor(payload).subscribe({
//     next: (res: any) =>{
//         if(res.status === '00'){
//           this.sharedService.success(res.message)
//           // this.router.navigate(['/dashboard']);
//               localStorage.setItem('user',res.userDetails);
//               localStorage.setItem('vendorid', res.userDetails.vendorid);
//               localStorage.setItem('status', res.userDetails.status);
//               localStorage.setItem('role', res.userDetails.role);
//               localStorage.setItem('ownerName', res.userDetails.owner_name);
//               localStorage.setItem('companyName', res.userDetails.companyName);
//               localStorage.setItem('ContactNo', res.userDetails.mobileNo);
//               localStorage.setItem('companyType', res.userDetails.companyType);
//               localStorage.setItem('flag', res.userDetails.flag);
//               localStorage.setItem('kycVerify', res.userDetails.kyc_verify);
//               localStorage.setItem('landMark', res.userDetails.landMark);
//               localStorage.setItem('Address1', res.userDetails.address1);
//               localStorage.setItem('Address2', res.userDetails.address2);
//               localStorage.setItem('City', res.userDetails.City);
//               localStorage.setItem('Pincode', res.userDetails.pincode);
//               localStorage.setItem('State', res.userDetails.state);
//               localStorage.setItem('Tahsil', res.userDetails.Tahsil);
//           this.router.navigate(['/newRegisterDashboard']);
//         }else{
//           this.sharedService.error(res.message)
//         }
//       },
//       error: (err) => {
//         console.error('OTP API Error:', err);
//         if (err.status === 500) {
//           this.sharedService.error('Internal server error. Please try again later.');
//         } else if (err.status === 0) {
//           this.sharedService.error('Network error. Please check your internet connection.');
//         } else {
//           this.sharedService.error(err.error?.message || 'Something went wrong.');
//         }
//       }
//     })
//     console.log("Form Submitted", this.registerForm.getRawValue());
//  }

submit() {

  if (this.registerForm.invalid || this.documentsForm.invalid) {
    this.registerForm.markAllAsTouched();
    this.documentsForm.markAllAsTouched();
    return;
  }
  const registerData = this.registerForm.getRawValue();
  const documentData = this.documentsForm.getRawValue();

  const payload = {
    vendorName: registerData.vendorName,
    organizationType: registerData.organizationType,
    authorizedPerson: registerData.authorizesPerson,
    mobileNo: registerData.mobileno,
    building: registerData.address1,
    area: registerData.address2,
    pincode: String(registerData.pincode),
    state: registerData.state,
    district: registerData.district,
    town: registerData.town,
    gstNo: documentData.gst || '',
    panNo: documentData.pan || '',
    organizationName: documentData.organisation || '',
    vehicles: (documentData.vehicles || [])
      .filter((v: any) =>
        v.registrationNumber?.trim() &&
        v.loadingCapacity !== null &&
        v.loadingCapacity !== undefined &&
        v.loadingCapacity !== '')
      .map((v: any) => ({
        VehicleNo: v.registrationNumber.trim(),
        LoadingCapacity: Number(v.loadingCapacity)
      }))
  };

  console.log('Vendor Payload:', payload);
  this.allServices.postVendor(payload).subscribe({
    next: (res: any) => {
      if (res.status === '00') {
         this.sharedService.success(res.message);
         this.router.navigate(['/newRegisterDashboard']);
        //  this.authService.setToken(res.data.accessToken);
         localStorage.setItem('userId',res.data.UserId);
        //  localStorage.setItem('isProfileCompleted',JSON.stringify(res.data.IsProfileCompleted));
        //  localStorage.setItem('isVehicleVerified',JSON.stringify(res.data.IsVehicleVerified));
        //  localStorage.setItem('isKycVerified',JSON.stringify(res.data.IsKycVerified));
         this.sharedService.updateVerificationStatus(res.data);
         localStorage.setItem('mobile',res.data.Mobile);
         localStorage.setItem('vendorId',res.data.VendorId);
         localStorage.setItem('vendorCode',res.data.VendorCode);
         localStorage.setItem('vehiclePrefix',res.data.VehiclePrefix);
      } else {
        this.sharedService.error(res.message);
      }
    },
    error: (err) => {
      console.error('Vendor API Error:', err);
      if (err.status === 500) {
        this.sharedService.error('Internal server error. Please try again later.');
      } else if (err.status === 0) {
        this.sharedService.error('Network error. Please check your internet connection.');
      } else {
        this.sharedService.error(err.error?.message || 'Something went wrong.');
      }
    }
  });
}

  // submit() {
  //   this.router.navigate(['/dashboard']);
  //   this.router.navigate(['/newRegisterDashboard']);
  //   console.log("Form Submitted", this.registerForm.getRawValue());
  // }

  // Shortcut
  f(field: string) {
    return this.registerForm.get(field);
  }

  g(field: string) {
    return this.documentsForm.get(field);
  }

  h(field: string) {
    return this.authorityForm.get(field);
  }

 // Legal Documents
 verify(type: 'aadhaar' | 'pan' | 'gst') {
  
   if(this.documentsForm.get('pan')?.value === '' && this.documentsForm.get('gst')?.value === ''){
      // this.documentsForm.markAllAsTouched();
      this.sharedService.error("PAN is Requierd!")
      return;
    }
    if (this.verifyState[type] !== 'idle') return;
    this.verifyState[type] = 'loading';
  //  27ASVPJ4585G2Z1
    setTimeout(() => {
  
      if (type === 'gst') {
        const payload = {
          gstin:String(this.documentsForm.get('gst')?.value),
        }

         this.allServices.gstVerification(payload).subscribe({
            next: (res: any) =>{
              if(res.status === '00'){
                this.sharedService.success(res.message)
                this.verifyState[type] = 'verified';
                 const gst = this.documentsForm.get('gst')?.value;
                  if (gst && gst.length === 15) {
                    const pan = gst.substring(2, 12);
                    this.documentsForm.get('pan')?.setValue(pan);
                  }
                  this.documentsForm.patchValue({
                    organisation:res.data.data.tradeNam
                  })
                  // this.documentsForm.get('organisation')?.setValue(res.data.tradeNam);
              }else{
                this.verifyState[type] = 'idle'
                this.sharedService.error(res.message)
              }
            },
            error: (err) => {
               this.verifyState[type] = 'idle';
              console.error('OTP API Error:', err);
              if (err.status === 500) {
                this.sharedService.error('Internal server error. Please try again later.');
              } else if (err.status === 0) {
                this.sharedService.error('Network error. Please check your internet connection.');
              } else {
                this.sharedService.error(err.error?.message || 'Something went wrong.');
              }
            }
          }) 
       }
   
      if (type === 'pan') {
        const payload = {
          pan:String(this.documentsForm.get('pan')?.value),
        }

         this.allServices.panVerification(payload).subscribe({
            next: (res: any) =>{
              if(res.status === '00'){
                this.sharedService.success(res.message)
                this.verifyState[type] = 'verified';
                this.documentsForm.patchValue({
                  organisation:res.data.data.full_name
                })
              }else{
                this.verifyState[type] = 'idle'
                this.sharedService.error(res.message)
              }
            },
            error: (err) => {
              this.verifyState[type] = 'idle';
              console.error('OTP API Error:', err);
              if (err.status === 500) {
                this.sharedService.error('Internal server error. Please try again later.');
              } else if (err.status === 0) {
                this.sharedService.error('Network error. Please check your internet connection.');
              } else {
                this.sharedService.error(err.error?.message || 'Something went wrong.');
              }
            }
          }) 
       }

    }, 2000);
 }



}