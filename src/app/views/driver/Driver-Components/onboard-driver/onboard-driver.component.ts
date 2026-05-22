import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AllServicesService } from '../../../all-services.service';
import { SharedService } from '../../../Services/shared.service';

@Component({
  selector: 'app-onboard-driver',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterLink,ReactiveFormsModule],
  templateUrl: './onboard-driver.component.html',
  styleUrl: './onboard-driver.component.scss'
})
export class OnboardDriverComponent implements OnInit{

  driverFormPersonalInformation!: FormGroup;
  driverFormAddressKyc!: FormGroup;

  qrEnable:boolean=true;
  informationEnable:boolean=true
  kycEnable:boolean = false
  driverDetailsEnable:boolean = false

  isVerified:boolean = false

   drivers = [
    { licenseNo: 'MH463839300393', driverName: 'Upendra ', mobileNo:'8765498768', licenseExpiry:'26-02-2030'},
    { licenseNo: 'MH463839300393', driverName: 'Atul Kumar',mobileNo:'8765498768',licenseExpiry:'26-02-2030'},
    { licenseNo: 'MH463839300393', driverName: 'Anubhav Kumar' ,mobileNo:'8765498768',licenseExpiry:'26-02-2030'},
    { licenseNo: 'MH463839300393', driverName: 'Deepak Kumar',mobileNo:'8765498768',licenseExpiry:'26-02-2030'},
  ];

  userId:any

  vendorId: string = '';
  driverDetails: any;

  frontFileName: string = '';
  backFileName: string = '';

  frontAdhaarImg: string = '';
  backAdhaarImg: string = ''
  stateList: any;
  cityList: any;
  lastSelectedState: any;

  drivingLicense:any
  driverDob:any

  driversDetailsByLicense: any;

  drivingLicenseName:any
  drivingLicenseAddress:any
  
  constructor(private router: Router,private allServices:AllServicesService,private sharedService: SharedService,private fb: FormBuilder){
  
  }
  
  ngOnInit(): void {
     this.vendorId = String(localStorage.getItem('vendorid'));
    //  this.getDrivers();
    console.log("VendoeId",this.vendorId)

   this.driverFormPersonalInformation = this.fb.group({
      license_no: ['', Validators.required],
      dob: ['', Validators.required],
      dl_front_img: [null, Validators.required],
      dl_back_img: [null, Validators.required],
      phone_number: ['', [Validators.required,Validators.pattern('^[0-9]{10}$')]],
      full_name: ['', Validators.required],
      nick_name: [''],
      email: ['', [Validators.required, Validators.email]]
    });

    this.driverFormAddressKyc = this.fb.group({
      building: [''],
      street: [''],
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
      tahsil: [''],
      state: ['', Validators.required],
      district: ['', Validators.required],

      adhaar: ['', [Validators.required, Validators.pattern('^[0-9]{12}$')]],
      adhaar_front_img: [null],
      adhaar_back_img: [null],

      familyMemberApp: [''],
      phoneNumber: ['', [Validators.pattern('^[0-9]{10}$')]],
      relation: ['']
    });

  }


  toggleQrButton(){
    this.qrEnable = !this.qrEnable
  }

  toggleInformationButton(){
    this.informationEnable = !this.informationEnable
  }


getPincodeLocation(event:any){

  const payload = {
    pincode:event.target.value
  }

  this.allServices.getLoctionPincode(payload).subscribe({
    next: (res: any) => {
      if (res.status === '00') {
          console.log("Pincode Data>>>>>>>>>>>", res.data);
          this.driverFormAddressKyc.patchValue({
            state: res.data.State,
            district:  res.data.District
          })
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

getStateData() {
  if (this.stateList && this.stateList.length > 0) {
    console.log(" Using cached state list");
    return;
  }
  const payload = { state: "" };
  this.getLocation(payload, "state");
}

getCityData() {
  const currentState = this.driverFormAddressKyc.get('state')?.value;
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


verifyDriver() {

  const payload = {
    //  "driver_id": "ABH-9289"
      // "onboard_id": "ONB202604302411"
      "onboard_id": this.userId
  }

   this.allServices.driverDetailsByScannerUID(payload).subscribe({
    next: (res: any) => {
      if (res.status === '00') {

        this.driverDetails = res.data[0];
        this.isVerified = true;
        this.driverFormPersonalInformation.patchValue({
          license_no: this.driverDetails.driving_license_no || '',
          dob: this.formatDate(this.driverDetails.DOB),
          phone_number: this.driverDetails.contact_no || '',
          full_name: this.driverDetails.full_name || '',
          nick_name: this.driverDetails.nick_name || '',
          email: this.driverDetails.email_id || ''
        });
        const docs = this.driverDetails.documents || [];

        console.log("Docs....",docs)
        const front = docs.find((d: any) => d.photo_type === 'license_front');
        const back = docs.find((d: any) => d.photo_type === 'license_back');
        console.log("front photo ====>",front?.photo_url)
        console.log("back photo====>",back?.photo_url)
        this.driverFormPersonalInformation.patchValue({
          dl_front_img: front?.photo_url || '',
          dl_back_img: back?.photo_url || ''
        });

        this.frontFileName = front?.photo_url ? 'Front Image Uploaded' : '';
        this.backFileName = back?.photo_url ? 'Back Image Uploaded' : '';


        this.driverFormAddressKyc.patchValue({
          building: this.driverDetails.building || '',
          street: this.driverDetails.area || '',          // API uses "area"
          pincode: this.driverDetails.pincode || '',
          tahsil: this.driverDetails.tahsil || '',
          state: this.driverDetails.state || '',
          district: this.driverDetails.district || '',
          adhaar: this.driverDetails.aadhar_no || '',
          familyMemberApp: this.driverDetails.referred_person_name || '',
          phoneNumber: this.driverDetails.referred_person_no || '',
          relation: this.driverDetails.relation || ''
        });

        const aadharFront = docs.find((d: any) => d.photo_type === 'aadhar_front');
        const aadharBack = docs.find((d: any) => d.photo_type === 'aadhar_back');

        this.frontAdhaarImg = aadharFront?.photo_url ? 'Front Image Uploaded' : '';
        this.backAdhaarImg = aadharBack?.photo_url ? 'Back Image Uploaded' : '';

        this.driverFormAddressKyc.patchValue({
          adhaar_front_img: aadharFront?.photo_url || '',
          adhaar_back_img: aadharBack?.photo_url || ''
        });


      } else {
        this.sharedService.error(res.message);
        this.isVerified = false;
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
      this.isVerified = false;
    }
   });

}

formatDate(date: string): string {
  if (!date) return '';
  return date.split('T')[0];
}

  // verifyDriver(){
  //   this.getDriversDetails()
  //   this.isVerified = true
  // }


// onFileChange(event: any, field: string) {
//   const file = event.target.files[0];

//   if (!file) return;

//   const reader = new FileReader();

//   reader.onload = () => {
//     this.driverFormPersonalInformation.patchValue({
//       [field]: reader.result
//     });
//   };

//   reader.readAsDataURL(file);
// }


onFileChange(event: any, field: string) {
  const file = event.target.files[0];
  if (!file) return;

  if (field === 'dl_front_img') {
    this.frontFileName = file.name;
  } else if (field === 'dl_back_img') {
    this.backFileName = file.name;
  }

  this.driverFormPersonalInformation.patchValue({
    [field]: file
  });
}

onFileChangeAdd(event: any, field: string) {
  const file = event.target.files[0];
  if (!file) return;

  if (field === 'adhaar_front_img') {
    this.frontAdhaarImg = file.name;
  } else if (field === 'adhaar_back_img') {
    this.backAdhaarImg = file.name;
  }

  this.driverFormAddressKyc.patchValue({
    [field]: file
  });
}


// onFileChange(event: any, field: string) {
//   const file = event.target.files[0];
//   if (!file) return;

//   // Set file name
//   if (field === 'dl_front_img') {
//     this.frontFileName = file.name;
//   } else if (field === 'dl_back_img') {
//     this.backFileName = file.name;
//   }

//   // Convert to base64
//   const reader = new FileReader();
//   reader.onload = () => {
//     this.driverFormPersonalInformation.patchValue({
//       [field]: reader.result
//     });
//   };

//   reader.readAsDataURL(file);
// }


onNext() {
  if (this.driverFormPersonalInformation.invalid) {
    this.driverFormPersonalInformation.markAllAsTouched();
    this.sharedService.error('All Feilds Are Required !.');
    return;
  }

  console.log("Form Data:", this.driverFormPersonalInformation.value);
  // move to next step
  this.informationEnable = false;
  this.kycEnable = true;

  this.getStateData()
  if(this.driverFormPersonalInformation.get('state')?.value !== null){
    this.getCityData()
  }

}



toggleDriverDetailsButton(){
    this.drivingLicense = this.driverDetails.driving_license_no;
    this.driverDob = this.formatDate(this.driverDetails.DOB);
    this.driverDetailsEnable = true;
}


isVerifying: boolean = false;
isLicenseVerified: boolean = false;

verifyLicense(){

  const payload = {
    "dl_number": this.drivingLicense,
    "dob": this.driverDob
  }

  this.isVerifying = true;      
  this.isLicenseVerified = false;

  this.allServices.driverDetailsByLicense(payload).subscribe({
    next: (res: any) => {
      if (res.status === '00') {
          this.driversDetailsByLicense = res.data;
          this.isLicenseVerified = true;
          this.isVerifying = false; 
          console.log("Test.....",res.data)
          this.drivingLicenseName = res.data.name
          this.drivingLicenseAddress = res.data.address
          this.sharedService.success(res.message);
      } else {
        this.sharedService.error(res.message);
      }
    },
    error: (err) => {
      this.isVerifying = false;
      this.isLicenseVerified = false;
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

submitDriverData(){

    const payload = {
       driver_id: this.driverDetails.driver_id || '',
      // driver_id: this.driversDetailsByLicense?.driver_id || '',
      vendorid: this.vendorId,
      driving_license_no: this.driversDetailsByLicense.id_number,
      DOB: this.driversDetailsByLicense.dob,
      full_name: this.driversDetailsByLicense.name,
      relatives_name: this.driversDetailsByLicense.relatives_name,
      address: this.driversDetailsByLicense.address,
      issuing_rto_name: this.driversDetailsByLicense.issuing_rto_name,
      date_of_issue: this.driversDetailsByLicense.date_of_issue,
      nt_validity_from: this.driversDetailsByLicense.nt_validity_from,
      nt_validity_to: this.driversDetailsByLicense.nt_validity_to,
      t_validity_from: this.driversDetailsByLicense.t_validity_from,
      t_validity_to: this.driversDetailsByLicense.t_validity_to,
      status: this.driversDetailsByLicense.status,
      source: this.driversDetailsByLicense.source,
      onboarded_by: 'vendor'
    };

    this.allServices.postDriverData(payload).subscribe({
    next: (res: any) => {
      if (res.status === '00') {
          this.sharedService.success(res.message);
          this.router.navigate(['/driverList'])
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
