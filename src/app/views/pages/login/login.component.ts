import { Component } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective, FormModule } from '@coreui/angular';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllServicesService } from '../../all-services.service';
import { __param } from 'tslib';
import { SharedService } from '../../Services/shared.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [CommonModule,FormsModule, ReactiveFormsModule, RouterModule, ContainerComponent, RowComponent, ColComponent,
       CardGroupComponent, TextColorDirective,CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, 
       IconDirective, FormControlDirective, ButtonDirective, NgStyle,]
})
export class LoginComponent {

userData = { email: '', password: '' };
mobileData = { mobile: '', otp: '' };
loginType: 'username' | 'otp' = 'otp';
isOtpSent:boolean = false;
isRoutedToNext:boolean = false;

otp1 = '';
otp2 = '';
otp3 = '';
otp4 = '';

counter = 120;
interval: any;
otpmessage: any;

constructor(private router: Router,private allService:AllServicesService,private sharedService: SharedService,) {}

login(userData: any) {
  console.log('Login with username/password:', userData);
  // TODO: Call your backend API to verify username/password
  this.router.navigate(['/dashboard']);
}

onMobileChange(value: number) {
  const mobileStr = value?.toString();
  if (mobileStr && mobileStr.length === 10 && !this.isOtpSent) {
    this.sendOtp(this.mobileData);
  }
}

sendOtp(mobileData: any) {
  console.log('Send OTP to mobile:', mobileData.mobile);
  const payload = {
    mobile_number: String(mobileData.mobile)
  }

  // this.allService.sendOtp(payload).subscribe((res:any)=>{
  //   if(res.status === '00'){
  //      this.isOtpSent = true;
  //      this.sharedService.success(res.message)
  //      this.startCounter();
  //   }else{
  //     this.sharedService.error(res.message)
  //     this.isOtpSent = false;
  //   }
  // })

    this.allService.sendOtp(payload).subscribe({
    next: (res: any) => {
      if (res.status === '00') {
        this.isOtpSent = true; 
        this.sharedService.success(res.message);
        this.startCounter();
      } else {
        this.isOtpSent = false;
        this.sharedService.error(res.message);
      }
    },
    error: (err) => {
      console.error('OTP API Error:', err);
      this.isOtpSent = false;
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


startCounter(){
  this.interval = setInterval(()=>{
    this.counter--;
    if(this.counter === 0){
      this.interval = clearInterval(this.interval);
      this.isOtpSent = false;
      if(!this.isRoutedToNext){
         this.resendOtp();
      } 
    }
    this.otpmessage = 'Your OTP will Expire in ' + this.counter + 's';
  }, 1000);
}

// moveNext(event: any, nextInput: any) {
//   const value = event.target.value;

//   if (value && nextInput) {
//     nextInput.focus();
//   }
// }
moveNext(event: any, nextInput: any) {
  const input = event.target;

  // allow only numbers
  input.value = input.value.replace(/[^0-9]/g, '');

  if (input.value && nextInput) {
    nextInput.focus();
  }
}

movePrev(event: any, prevInput: any) {
  if (!event.target.value && prevInput) {
    prevInput.focus();
  }
}

verifyOtp(mobileData: any) {
  console.log('Verify OTP for mobile:', mobileData.mobile, mobileData.otp);
  console.log('Send OTP to mobile:', mobileData.mobile);
 const otp = String(this.otp1+this.otp2+this.otp3+this.otp4);

  const payload = {
    mobile_number: String(mobileData.mobile),
    // otp:mobileData.otp
    otp:otp
  }
  this.allService.validateOtp(payload).subscribe((res:any)=>{
    if(res.status === '00' && !(res.userDetails.status === '01')){
        this.isRoutedToNext = true; 
        localStorage.setItem('user',res.userDetails);
        localStorage.setItem('vendorid', res.userDetails.vendorid);
        localStorage.setItem('status', res.userDetails.status);
        localStorage.setItem('role', res.userDetails.role);
        localStorage.setItem('ownerName', res.userDetails.owner_name);
        localStorage.setItem('companyName', res.userDetails.companyName);
        localStorage.setItem('ContactNo', res.userDetails.mobileNo);
        localStorage.setItem('companyType', res.userDetails.companyType);
        localStorage.setItem('flag', res.userDetails.flag);
        localStorage.setItem('kycVerify', res.userDetails.kyc_verify);
        localStorage.setItem('landMark', res.userDetails.landMark);
        localStorage.setItem('Address1', res.userDetails.address1);
        localStorage.setItem('Address2', res.userDetails.address2);
        localStorage.setItem('City', res.userDetails.City);
        localStorage.setItem('Pincode', res.userDetails.pincode);
        localStorage.setItem('State', res.userDetails.state);
        localStorage.setItem('Tahsil', res.userDetails.Tahsil);
        // this.router.navigate(['/dashboard']);
        this.router.navigate(['/vendorDashboard']);
        this.sharedService.success(res.message)
    }
    else if(res.userDetails.status === '01' && (res.userDetails || Object.keys(res.userDetails).length === 0)){
        this.isRoutedToNext = true; 
      this.router.navigate(
          ['/register'],
          { queryParams: { mobileNo: mobileData.mobile } }
        );
       
    }  
    else{
      this.sharedService.error(res.message)
      this.isOtpSent = false;
    }
  })
}

resendOtp(){
  console.log('Send OTP to mobile:', this.mobileData.mobile);
  if(this.counter === 0){
    this.counter = 120;
    const payload = {
       mobile_number: String(this.mobileData.mobile)
    }
    this.allService.sendOtp(payload).subscribe((res:any)=>{
      if(res.status === '00'){
        this.isOtpSent = true;  // Show OTP input field
        this.sharedService.success(res.message)
        this.startCounter();
      }else{
        this.sharedService.error(res.message)
        // this.isOtpSent = false;
      }
    })
  }
}


}
