import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AllServicesService } from '../../all-services.service';
import { SharedService } from '../../Services/shared.service';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-driver-add',
  standalone: true,
  imports: [
    // CommonModule,FormsModule,
    // MatDialogModule,MatFormFieldModule,
    // MatInputModule,MatButtonModule,
    // MatProgressSpinnerModule,MatIconModule,
    // MatDatepickerModule,MatNativeDateModule
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgSelectModule
  ],
  templateUrl: './driver-add.component.html',
  styleUrl: './driver-add.component.scss'
})
export class DriverAddComponent implements OnInit{
  
  driverForm!: FormGroup
  isValidating = false;
  isValidated = false;
  stateList:[] = [];
  cityList:[] = [];
  lastSelectedState:any

  stateControl: any;
  districtControl: any;

  constructor(public dialogRef: MatDialogRef<DriverAddComponent>,private allServices:AllServicesService,
    private fb:FormBuilder, private sharedService:SharedService, @Inject(MAT_DIALOG_DATA) public data: any) 
  {
   

  }

  ngOnInit(): void {
      this.createForm();
      this.stateControl = this.driverForm.get('state');
      this.districtControl = this.driverForm.get('district');
  }

 createForm() {
    this.driverForm = this.fb.group({
      licenceNumber: ['', Validators.required],
      dob: [null, Validators.required],
      licenceExpiry: [null, Validators.required],
      age: [null,[Validators.required, Validators.min(18), Validators.max(70)]],
      address: [''],
      fullName: ['', Validators.required],
      phone: ['', Validators.required],
      familyContact: [''],
      email: ['', [Validators.email]],
      building: [''],
      street: [''],
      pincode: [''],
      tahsil: [''],
      state: ['', Validators.required],
      district: ['', Validators.required]
    });
  }

validateLicence() {
  this.isValidating = true;

  // simulate API call
  setTimeout(() => {
    this.isValidating = false;
    this.isValidated = true;
  }, 2000);
}

onStateChange(event: any) {
  // logic if needed (optional)
}

onDistrictChange(event: any) {
   // logic if needed (optional)
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
  const currentState = this.driverForm.get('state')?.value;

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

  submit(){

  }

  close() {
      this.dialogRef.close();
  }

}
