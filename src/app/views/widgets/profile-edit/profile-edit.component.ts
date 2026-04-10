import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective, CardBodyComponent, CardComponent, ColComponent, ContainerComponent, FormControlDirective, FormDirective, InputGroupComponent, InputGroupTextDirective, RowComponent, TextColorDirective } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { AllServicesService } from '../../all-services.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedService } from '../../Services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
declare var google: any;

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [ContainerComponent, RowComponent, ColComponent, TextColorDirective, CardComponent, CardBodyComponent,
         FormDirective, InputGroupComponent,InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective,
          CommonModule,FormsModule,ReactiveFormsModule,HttpClientModule,NgSelectModule],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.scss'
})
export class ProfileEditComponent {

  private apiKey = 'AIzaSyBam0VcHF4WsWfiDVxjaW82Xt7xhhvlXvk';
  registerForm!: FormGroup;
  documentsForm!: FormGroup;
  mobileNo: any;
  stateList: any;
  cityList: any;
  locations:any
  lastSelectedState: string | null = null;
  isMobileReadonly = false;

  registrationType:   'organization' | 'individual' = 'individual';
  isLegalDocumentsForm:boolean = false

  stateControl: any;
  districtControl: any;
  googleAddressControl:any;

  stateHasValue = false;
  districtHasValue = false;
  googleAddressHasValue = false;
  selectedAddressComponents: any;

  verifyState = {
    aadhaar: 'idle',   
    pan: 'idle',
    gst: 'idle'
  };

constructor(private fb: FormBuilder,private route: ActivatedRoute,private allServices: AllServicesService,
  private sharedService: SharedService,private router: Router) 
  {

}

  ngOnInit(): void {

    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      companyName: [''],
      mobileno: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      addressType: this.fb.array([]),
      address1: ['', Validators.required],
      address2: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      town: [''],
      state: ['', Validators.required],
      district: ['', Validators.required],
      googleAddress: ['', Validators.required],

      latitude: [''],
      longitude: [''],
      place_id: ['']
    });
  
    this.documentsForm = this.fb.group({
        aadhaar: ['', [Validators.required,Validators.pattern(/^[2-9]{1}[0-9]{11}$/)]],     
        pan: ['', [Validators.required,Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],  
        gst: ['', [Validators.required,Validators.pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)]]  
      });

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
      this.googleAddressControl = this.registerForm.get('googleAddress');

      //  Keep track of value changes for label animation
      this.stateControl.valueChanges.subscribe((val: string) => {
          this.stateHasValue = !!val;
      });

      this.districtControl.valueChanges.subscribe((val: string) => {
          this.districtHasValue = !!val;
      });

      this.googleAddressControl.valueChanges.subscribe((val: string) => {
          this.googleAddressHasValue = !!val;
      });
      this.setValidatorsByType(this.registrationType);
  }


  setValidatorsByType(type: 'individual' | 'organization') {
      const companyName = this.registerForm.get('companyName');
      const addressType = this.registerForm.get('addressType');
      if (type === 'organization') {
        companyName?.setValidators([Validators.required]);
        addressType?.setValidators([Validators.required]);
      } else {
        companyName?.clearValidators();
        addressType?.clearValidators();
        companyName?.setValue('');
        (addressType as FormArray).clear();
      }
      companyName?.updateValueAndValidity();
      addressType?.updateValueAndValidity();
  }

onRegistrationTypeChange(type: 'individual' | 'organization') {
    this.registrationType = type;
    this.setValidatorsByType(type);
    this.registerForm.markAsPristine();
    this.registerForm.markAsUntouched();
  }


  get addressTypeArray(): FormArray {
    return this.registerForm.get('addressType') as FormArray;
  }

  onAddressTypeChange(event: any) {
      const value = event.target.value;
      const checked = event.target.checked;
      if (checked) {
          this.addressTypeArray.push(this.fb.control(value));
        } else {
      const index = this.addressTypeArray.controls.findIndex(x => x.value === value);
          if (index >= 0) {
            this.addressTypeArray.removeAt(index);
          }
        }
        console.log('Selected Address Types:', this.addressTypeArray.value);
    }


    //  Optional events if you want to handle select change
  onStateChange(event: any) {
          // logic if needed (optional)
    }

   onDistrictChange(event: any) {
          // logic if needed (optional)
    }

getPincodeLocation(event:any){

  const payload = {
    pincode:event.target.value
  }

  this.allServices.getLoctionPincode(payload).subscribe({
    next: (res: any) => {
      if (res.status === '00') {
          console.log("Pincode Data>>>>>>>>>>>", res.data);
          this.registerForm.patchValue({
            state: res.data.State,
            district:  res.data.District
          })
      } else {
        // alert(res.message);
         this.sharedService.error(res.message);
      }
    },
    error: (err) => {
      console.error(err);
      // alert(err);
       this.sharedService.error(err);
    }
  });
} 

getStateData() {
  if (this.stateList && this.stateList.length > 0) {
    console.log(" Using cached state list");
    return;
  }

  const payload = { state: "" };
  this.getLocation(payload, "state");
}

getCityData() {
  const currentState = this.registerForm.get('state')?.value;

  // No state selected → skip
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

  // Update state
  this.lastSelectedState = currentState;

  const payload = { state: currentState };
  this.getLocation(payload, "city");
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


getGoogleLocation(input: string) {
  if (!input || input.length < 3) return;

  const service = new google.maps.places.AutocompleteService();

  service.getPlacePredictions(
    { input, componentRestrictions: { country: 'in' } },
    (predictions: any[], status: any) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        this.locations = predictions.map((p) => ({
          description: p.description,
          place_id: p.place_id,
        }));
      } else {
        this.locations = [];
        console.warn('Google API Error:', status);
      }
    }
  );
}


onLocationSelected(selected: any) {
  if (!selected) return;

  if (selected.place_id) {
    this.selectGoogleLocation(selected.place_id, selected.description);
  }
}

selectGoogleLocation(place_id: string, description: string) {
  const service = new google.maps.places.PlacesService(document.createElement('div'));

  service.getDetails({ placeId: place_id }, (place: any, status: any) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      const components: any = {};
      place.address_components.forEach((cmp: any) => {
        if (cmp.types.includes("locality")) components.city = cmp.long_name;
        if (cmp.types.includes("administrative_area_level_2")) components.dist = cmp.long_name;
        if (cmp.types.includes("administrative_area_level_3")) components.tal = cmp.long_name;
        if (cmp.types.includes("administrative_area_level_1")) components.state = cmp.long_name;
        if (cmp.types.includes("postal_code")) components.pincode = cmp.long_name;
      });

      this.registerForm.patchValue({
        googleAddress: description,
        latitude: lat,
        longitude: lng,
        place_id: place.place_id,
        state: components.state,
        district: components.dist,
        town: components.tal,
        pincode: components.pincode
      });

      this.selectedAddressComponents = components; // save for payload
    }
  });
}


submit() {

    console.log("Clicked!!")
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
     }

       const payload = {
        CompanyType: "",
        CompanyName: this.registerForm.get('companyName')?.value,
        ContactPerson: this.registerForm.get('fullName')?.value,
        ContactNo: this.registerForm.get('mobileno')?.value,
        EmailID: this.registerForm.get('email')?.value,
        Address1: this.registerForm.get('address1')?.value,
        Address2: this.registerForm.get('address2')?.value,
        Pincode: String(this.registerForm.get('pincode')?.value),
        State: this.registerForm.get('state')?.value,
        City: this.registerForm.get('district')?.value,
        Tahsil: this.registerForm.get('town')?.value,

        RegisteredAddress: {
          id: this.registerForm.get('place_id')?.value,
          fullAddress: this.registerForm.get('googleAddress')?.value,
          latitude: this.registerForm.get('latitude')?.value,
          longitude: this.registerForm.get('longitude')?.value,
          addressComponents: {
            place: this.selectedAddressComponents?.city || "",
            dist: this.selectedAddressComponents?.dist || "",
            tal: this.selectedAddressComponents?.tal || "",
            state: this.selectedAddressComponents?.state || "",
            pincode: this.selectedAddressComponents?.pincode || ""
          }
        },

     Insert_Date: new Date().toISOString(),
     Update_Date: new Date().toISOString()
};

    this.allServices.postVendor(payload).subscribe((res:any)=>{
      if(res.status === '00'){
        this.sharedService.success(res.message)
        this.router.navigate(['/login']);
      }else{
        this.sharedService.error(res.message)
        // this.router.navigate(['/register']);
      }
    })

    console.log("Form Submitted", this.registerForm.getRawValue());
  }

  // Shortcut
  f(field: string) {
    return this.registerForm.get(field);
  }


// Legal Documents
verify(type: 'aadhaar' | 'pan' | 'gst') {
    if (this.verifyState[type] !== 'idle') return;
    this.verifyState[type] = 'loading';

    // Simulate API call
    setTimeout(() => {
      this.verifyState[type] = 'verified';
    }, 2000);
}

g(field: string) {
    return this.documentsForm.get(field);
}

submitDocuments() {
  if (this.documentsForm.invalid) {
      this.documentsForm.markAllAsTouched();
      return;
    }
    console.log('Submitted Data:', this.documentsForm.value);
  }




}
