import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AllServicesService } from '../../../all-services.service';
import { SharedService } from '../../../Services/shared.service';
import { SocketService } from 'src/app/views/Services/socket.service';
// import { SOCKET_EVENTS } from '../../Socket/socket-events';
import { SOCKET_EVENTS } from '../../../Socket/socket-events';
import * as bootstrap from 'bootstrap';



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

  qrEnable:boolean=false;
  informationEnable:boolean=true
  kycEnable:boolean = false
  driverDetailsEnable:boolean = false

  isVerified:boolean = false

  baseUrl:string = 'https://stag.motohelpindia.com'

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
  vendorUserId:any;
  
  constructor(private router: Router,private route: ActivatedRoute,private allServices:AllServicesService,private sharedService: SharedService,private fb: FormBuilder,private socketService:SocketService){
  
  }
  
  ngOnInit(): void {
     this.vendorId = String(localStorage.getItem('vendorId'));
     this.vendorUserId = String(localStorage.getItem('userId'));
     this.socketService.connect(this.vendorUserId!);
    //  this.getDrivers();
    console.log("VendoeId",this.vendorId)
    this.initializeForms()

  //  this.driverFormPersonalInformation = this.fb.group({
  //     license_no: ['', Validators.required],
  //     dob: ['', Validators.required],
  //     dl_front_img: [null, Validators.required],
  //     dl_back_img: [null, Validators.required],
  //     phone_number: ['', [Validators.required,Validators.pattern('^[0-9]{10}$')]],
  //     full_name: ['', Validators.required],
  //     nick_name: [''],
  //     email: ['', [Validators.required, Validators.email]]
  //   });

  //   this.driverFormAddressKyc = this.fb.group({
  //     building: [''],
  //     street: [''],
  //     pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
  //     tahsil: [''],
  //     state: ['', Validators.required],
  //     district: ['', Validators.required],

  //     adhaar: ['', [Validators.required, Validators.pattern('^[0-9]{12}$')]],
  //     adhaar_front_img: [null],
  //     adhaar_back_img: [null],

  //     familyMemberApp: [''],
  //     phoneNumber: ['', [Validators.pattern('^[0-9]{10}$')]],
  //     relation: ['']
  //   });

      const data = this.sharedService.driverDetails();
      if (data) {
        this.driverDetails = data;
        this.patchDriverDetails(data);
      } else {
        console.warn('No driver details found in shared service.');
      }

    this.getStateData();
  }


  initializeForms(): void {
    this.driverFormPersonalInformation = this.fb.group({
      license_no: ['', Validators.required],
      dob: ['', Validators.required],
      dl_front_img: [null, Validators.required],
      dl_back_img: [null, Validators.required],
      phone_number: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{10}$')
      ]],
      full_name: ['', Validators.required],
      nick_name: [''],
      email: ['', [Validators.required, Validators.email]]
    });

    this.driverFormAddressKyc = this.fb.group({
      building: [''],
      street: [''],
      pincode: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{6}$')
      ]],
      tahsil: [''],
      state: ['', Validators.required],
      district: ['', Validators.required],
      adhaar: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{12}$')
      ]],
      adhaar_front_img: [null],
      adhaar_back_img: [null],
      familyMemberApp: [''],
      phoneNumber: ['', Validators.pattern('^[0-9]{10}$')],
      relation: ['']
    });
  }


  patchDriverDetails(d: any): void {
    // this.driverFormPersonalInformation.patchValue({
    //   license_no: d.DrivingLicenseNo ?? '',
    //   // dob: d.DOB ? this.formatDate(d.DOB) : '',
    //   dob: d.DOB ?? '',
    //   phone_number: d.Mobile ?? '',
    //   full_name: d.FullName ?? '',
    //   nick_name: d.NickName ?? '',
    //   email: d.EmailId ?? ''
    // });
    // this.driverFormAddressKyc.patchValue({
    //   building: d.Building ?? '',
    //   street: d.Area ?? '',
    //   pincode: d.Pincode ?? '',
    //   tahsil: d.Tahsil ?? '',
    //   state: d.State ?? '',
    //   district: d.District ?? '',
    //   adhaar: d.AadharNo ?? '',
    //   familyMemberApp: d.ReferredPersonName ?? '',
    //   phoneNumber: d.ReferredPersonContactNo ?? '',
    //   relation: d.Relation ?? ''
    // });
    // this.frontFileName = d.LicenseFrontImage ? 'Front Image Uploaded' : '';
    // this.backFileName = d.LicenseBackImage ? 'Back Image Uploaded' : '';
    // this.frontAdhaarImg = d.AadharFrontImage ? 'Front Image Uploaded' : '';
    // this.backAdhaarImg = d.AadharBackImage ? 'Back Image Uploaded' : '';
    // console.log('Personal form:', this.driverFormPersonalInformation.value);
    // console.log('Address form:', this.driverFormAddressKyc.value);

        this.driverFormPersonalInformation.patchValue({
          license_no: this.driverDetails.DrivingLicenseNo || '',
          dob: this.driverDetails.DOB ? this.formatDate(this.driverDetails.DOB) : '',
          phone_number: this.driverDetails.Mobile || '',
          full_name: this.driverDetails.FullName || '',
          nick_name: this.driverDetails.NickName || '',
          email: this.driverDetails.EmailId || ''
        });
          // License Images
        this.driverFormPersonalInformation.patchValue({
           dl_front_img: this.driverDetails.LicenseFrontImage || '',
           dl_back_img: this.driverDetails.LicenseBackImage || ''
        });
        this.frontFileName = this.driverDetails.LicenseFrontImage ? 'Front Image Uploaded' : '';
        this.backFileName = this.driverDetails.LicenseBackImage ? 'Back Image Uploaded' : '';
          // Address / KYC
        this.driverFormAddressKyc.patchValue({
          building: this.driverDetails.Building || '',
          street: this.driverDetails.Area || '',
          pincode: this.driverDetails.Pincode || '',
          tahsil: this.driverDetails.Tahsil || '',
          state: this.driverDetails.State || '',
          // district: this.driverDetails.District || '',
          adhaar: this.driverDetails.AadharNo || '',
          familyMemberApp: this.driverDetails.ReferredPersonName || '',
          phoneNumber: this.driverDetails.ReferredPersonContactNo || '',
          relation: this.driverDetails.Relation || ''
         });
          //  this.driverFormAddressKyc.patchValue({
          //   state: this.driverDetails.State || '',
          // });
        this.driverFormAddressKyc.patchValue({
           district: this.driverDetails.District || '',
        });
        // Aadhaar Images
        this.driverFormAddressKyc.patchValue({
          adhaar_front_img: this.driverDetails.AadharFrontImage || '',
          adhaar_back_img: this.driverDetails.AadharBackImage || ''
        });
        this.frontAdhaarImg = this.driverDetails.AadharFrontImage ? 'Front Image Uploaded' : '';
        this.backAdhaarImg = this.driverDetails.AadharBackImage ? 'Back Image Uploaded' : '';
  }


  toggleQrButton(){
    this.qrEnable = !this.qrEnable
  }

  toggleInformationButton(){
    this.informationEnable = !this.informationEnable
  }



  getPincodeLocation(event:any){
      const pincode = String(event.target.value)
    // const payload = {
    //   pincode:String(event.target.value)
    // }
    console.log("Pincode Data>>>>>>>>>>>");
    this.allServices.getLoctionPincode(pincode).subscribe({
      next: (res: any) => {
        if (res.status === '00') {
            console.log("Pincode Data>>>>>>>>>>>", res.data);
            this.driverFormAddressKyc.patchValue({
              state: res.data.state,
              district:  res.data.district
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
    const currentState = this.driverFormAddressKyc.get('state')?.value;
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


  verifyDriver() {
    const payload = {
        "onboard_id": this.userId
    }
    this.isVerified = true; // tempraray
     this.allServices.driverDetailsByScannerUID(this.vendorUserId,this.userId).subscribe({
      next: (res: any) => {
        if (res.status === '00') {

          // this.driverDetails = res.data[0];
          // this.isVerified = true;
          // this.driverFormPersonalInformation.patchValue({
          //   license_no: this.driverDetails.driving_license_no || '',
          //   dob: this.formatDate(this.driverDetails.DOB),
          //   phone_number: this.driverDetails.contact_no || '',
          //   full_name: this.driverDetails.full_name || '',
          //   nick_name: this.driverDetails.nick_name || '',
          //   email: this.driverDetails.email_id || ''
          // });
          // const docs = this.driverDetails.documents || [];

          // console.log("Docs....",docs)
          // const front = docs.find((d: any) => d.photo_type === 'license_front');
          // const back = docs.find((d: any) => d.photo_type === 'license_back');
          // console.log("front photo ====>",front?.photo_url)
          // console.log("back photo====>",back?.photo_url)
          // this.driverFormPersonalInformation.patchValue({
          //   dl_front_img: front?.photo_url || '',
          //   dl_back_img: back?.photo_url || ''
          // });

          // this.frontFileName = front?.photo_url ? 'Front Image Uploaded' : '';
          // this.backFileName = back?.photo_url ? 'Back Image Uploaded' : '';


          // this.driverFormAddressKyc.patchValue({
          //   building: this.driverDetails.building || '',
          //   street: this.driverDetails.area || '',          // API uses "area"
          //   pincode: this.driverDetails.pincode || '',
          //   tahsil: this.driverDetails.tahsil || '',
          //   state: this.driverDetails.state || '',
          //   district: this.driverDetails.district || '',
          //   adhaar: this.driverDetails.aadhar_no || '',
          //   familyMemberApp: this.driverDetails.referred_person_name || '',
          //   phoneNumber: this.driverDetails.referred_person_no || '',
          //   relation: this.driverDetails.relation || ''
          // });

          // const aadharFront = docs.find((d: any) => d.photo_type === 'aadhar_front');
          // const aadharBack = docs.find((d: any) => d.photo_type === 'aadhar_back');

          // this.frontAdhaarImg = aadharFront?.photo_url ? 'Front Image Uploaded' : '';
          // this.backAdhaarImg = aadharBack?.photo_url ? 'Back Image Uploaded' : '';

          // this.driverFormAddressKyc.patchValue({
          //   adhaar_front_img: aadharFront?.photo_url || '',
          //   adhaar_back_img: aadharBack?.photo_url || ''
          // });
          this.driverDetails = res.data;
          this.isVerified = true;
          this.driverFormPersonalInformation.patchValue({
            license_no: this.driverDetails.DrivingLicenseNo || '',
            dob: this.driverDetails.DOB ? this.formatDate(this.driverDetails.DOB) : '',
            phone_number: this.driverDetails.Mobile || '',
            full_name: this.driverDetails.FullName || '',
            nick_name: this.driverDetails.NickName || '',
            email: this.driverDetails.EmailId || ''
          });
          // License Images
          this.driverFormPersonalInformation.patchValue({
            dl_front_img: this.driverDetails.LicenseFrontImage || '',
            dl_back_img: this.driverDetails.LicenseBackImage || ''
          });
          this.frontFileName = this.driverDetails.LicenseFrontImage ? 'Front Image Uploaded' : '';
          this.backFileName = this.driverDetails.LicenseBackImage ? 'Back Image Uploaded' : '';
          // Address / KYC
          this.driverFormAddressKyc.patchValue({
            building: this.driverDetails.Building || '',
            street: this.driverDetails.Area || '',
            pincode: this.driverDetails.Pincode || '',
            tahsil: this.driverDetails.Tahsil || '',
            state: this.driverDetails.State || '',
            // district: this.driverDetails.District || '',
            adhaar: this.driverDetails.AadharNo || '',
            familyMemberApp: this.driverDetails.ReferredPersonName || '',
            phoneNumber: this.driverDetails.ReferredPersonContactNo || '',
            relation: this.driverDetails.Relation || ''
          });
          //  this.driverFormAddressKyc.patchValue({
          //   state: this.driverDetails.State || '',
          // });
          this.driverFormAddressKyc.patchValue({
            district: this.driverDetails.District || '',
          });

        // Aadhaar Images
        this.driverFormAddressKyc.patchValue({
          adhaar_front_img: this.driverDetails.AadharFrontImage || '',
          adhaar_back_img: this.driverDetails.AadharBackImage || ''
        });
        this.frontAdhaarImg = this.driverDetails.AadharFrontImage ? 'Front Image Uploaded' : '';
        this.backAdhaarImg = this.driverDetails.AadharBackImage ? 'Back Image Uploaded' : '';

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
  // if (this.driverFormPersonalInformation.invalid) {
  //   this.driverFormPersonalInformation.markAllAsTouched();
  //   this.sharedService.error('All Feilds Are Required !.');
  //   return;
  // }
  console.log("Form Data:", this.driverFormPersonalInformation.value);
  // move to next step
  this.informationEnable = false;
  this.kycEnable = true;
  // this.getStateData()
  if(this.driverFormPersonalInformation.get('state')?.value !== null){
    this.getCityData()
  }
}



toggleDriverDetailsButton(){
    this.driverDetailsEnable = true;
    // this.drivingLicense = this.driverDetails.driving_license_no;
    // this.driverDob = this.formatDate(this.driverDetails.DOB);
      this.drivingLicense = this.driverDetails.DrivingLicenseNo || '',
      this.driverDob =  this.driverDetails.DOB ? this.formatDate(this.driverDetails.DOB) : ''
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
          this.drivingLicenseName = res.data.fullName
          this.drivingLicenseAddress = res.data.address
          this.sharedService.success(res.message);
      }
       else {
        this.sharedService.error(res.message);
        this.isVerifying = false;
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


getExpiryDate(driverClass: string): string {
  const validity = this.driversDetailsByLicense?.validity;
  if (!validity) {
    return '';
  }
  if (driverClass === 'TRANS') {
    return validity.transport?.to || '';
  }
  if (driverClass === 'MCWG' || driverClass === 'LMV' || driverClass === 'NON-TRANS') {
    return validity.nonTransport?.to || '';
  }
  return '';
}


submitDriverData(){
    // this.router.navigate(['/driverList'])
    // const payload = {
    //    driver_id: this.driverDetails.driver_id || '',
    //   // driver_id: this.driversDetailsByLicense?.driver_id || '',
    //   vendorid: this.vendorId,
    //   driving_license_no: this.driversDetailsByLicense.id_number,
    //   DOB: this.driversDetailsByLicense.dob,
    //   full_name: this.driversDetailsByLicense.name,
    //   relatives_name: this.driversDetailsByLicense.relatives_name,
    //   address: this.driversDetailsByLicense.address,
    //   issuing_rto_name: this.driversDetailsByLicense.issuing_rto_name,
    //   date_of_issue: this.driversDetailsByLicense.date_of_issue,
    //   nt_validity_from: this.driversDetailsByLicense.nt_validity_from,
    //   nt_validity_to: this.driversDetailsByLicense.nt_validity_to,
    //   t_validity_from: this.driversDetailsByLicense.t_validity_from,
    //   t_validity_to: this.driversDetailsByLicense.t_validity_to,
    //   status: this.driversDetailsByLicense.status,
    //   source: this.driversDetailsByLicense.source,
    //   onboarded_by: 'vendor'
    // };

    const licenseData = this.driversDetailsByLicense;
    const payload = {
      DriverCode: this.driverDetails?.DriverCode || '',
      LicenseNumber: licenseData?.licenseNumber || '',
      DOB: licenseData?.dateOfBirth || '',
      FullName: licenseData?.fullName || '',
      RelativeName:licenseData?.relativeName || licenseData?.holder?.relativeName || '',
      Address: licenseData?.address || '',
      IssuingRTO: licenseData?.issuingRTO || '',
      IssueDate: licenseData?.issueDate || '',
      NTValidityFrom:licenseData?.validity?.nonTransport?.from || '',
      NTValidityTo:licenseData?.validity?.nonTransport?.to || '',
      TValidityFrom:licenseData?.validity?.transport?.from || '',
      TValidityTo:licenseData?.validity?.transport?.to || '',
      VehicleClassCodes:(licenseData?.vehicleClasses || []).map((item: any) => item.class),
      VehicleClassIssueDates:(licenseData?.vehicleClasses || []).map((item: any) => item.issueDate),
      VehicleClassExpiryDates:(licenseData?.vehicleClasses || []).map((item: any) => item.expiryDate || '')
    };

    const socketPayload = {
      driverId:this.driverDetails?.UserId
    }

    this.allServices.postDriverData(payload).subscribe({
    next: (res: any) => {
      if (res.status === '00') {
          // this.sharedService.success(res.message);
          // this.socketService.emitWhenConnected(SOCKET_EVENTS.DRIVER_ONBOARDED_BY_VENDOR,socketPayload);
           this.socketService.emitWhenConnected(SOCKET_EVENTS.DRIVER_ONBOARDED_BY_VENDOR,socketPayload, (response: any) => {
            if(response.status === "00"){
               this.sharedService.success(res.message);
                console.log('Driver Onboarded... >>>>>>', response);
            }else{
              this.sharedService.error(res.message);
              console.log('Driver Not Onboarded >>>>>>', response);
            }
          });
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


 
previewImageUrl: string | null = null;
previewImageTitle = '';

openImagePreview(imageUrl: string | null | undefined, title: string): void {
  this.previewImageTitle = title;
  this.previewImageUrl = imageUrl || null;

  const modalElement = document.getElementById('imagePreviewModal');

  if (modalElement) {
    bootstrap.Modal.getOrCreateInstance(modalElement).show();
  }
}


}
