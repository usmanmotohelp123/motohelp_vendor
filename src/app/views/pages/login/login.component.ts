import { Component } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { ContainerComponent, RowComponent, ColComponent, CardGroupComponent, TextColorDirective, CardComponent, CardBodyComponent, FormDirective, InputGroupComponent, InputGroupTextDirective, FormControlDirective, ButtonDirective, FormModule } from '@coreui/angular';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllServicesService } from '../../all-services.service';
import { __param } from 'tslib';
import { SharedService } from '../../Services/shared.service';
import { AuthService } from '../../Services/auth.service';

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

constructor(private router: Router,private allService:AllServicesService,private sharedService: SharedService,private authService:AuthService) {}

login(userData: any) {
  console.log('Login with username/password:', userData);
  // TODO: Call your backend API to verify username/password
  this.router.navigate(['/dashboard']);
}

onMobileChange(value: number) {
  const mobileStr = value?.toString();
  if (mobileStr && mobileStr.length === 10 && !this.isOtpSent) {
    // this.sendOtp(this.mobileData);
  }
}

sendOtp() {
  const payload = {
    // mobile_number: String(mobileData.mobile)
    mobile: String(this.mobileData.mobile)
  }

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

  // const payload = {
  //   mobile_number: String(mobileData.mobile),
  //   // otp:mobileData.otp
  //   otp:otp
  // }
   const payload = {
      mobile: String(mobileData.mobile),
      otp:otp,
      Role:"VENDOR"
   }
  this.allService.validateOtp(payload).subscribe((res:any)=>{
    if(res.status === '00'){
        this.isRoutedToNext = true; 
        this.authService.setToken(res.data.accessToken);
        // localStorage.setItem('user',JSON.stringify(res.userDetails));
        localStorage.setItem('userId',res.data.userId);
        // localStorage.setItem('isProfileCompleted',res.data.isProfileCompleted);
        localStorage.setItem('mobile',res.data.mobile);
        localStorage.setItem('refreshToken',res.data.refreshToken);
        // localStorage.setItem('isProfileVerified',JSON.stringify(res.data.isProfileVerified));
        // localStorage.setItem('isVehicleVerified',JSON.stringify(res.data.isVehicleVerified));
        // localStorage.setItem('isKycVerified',JSON.stringify(res.data.isKycVerified));
        this.sharedService.updateVerificationStatus(res.data);
        localStorage.setItem('organizationType',res.data.organizationType);
        localStorage.setItem('vendorCode',res.data.vendorCode);
        localStorage.setItem('vendorId',res.data.vendorId);
        localStorage.setItem('vendorName',res.data.vendorName);
        if(res.data.isVehicleVerified === true && res.data.isKycVerified === true){
          this.router.navigate(['/vendorDashboard']);
        }else{
           this.router.navigate(['/newRegisterDashboard']);
        }
       
        this.sharedService.success(res.message)
    }
    else if(res.status === '01'){
        this.isRoutedToNext = true; 
        this.authService.setToken(res.data.accessToken);
        localStorage.setItem('userId',res.data.userId);
        localStorage.setItem('isProfileCompleted',res.data.isProfileCompleted);
        localStorage.setItem('mobile',res.data.mobile);
        localStorage.setItem('refreshToken',res.data.refreshToken);
        // localStorage.setItem('refreshToken',res.data.refreshToken);
        localStorage.setItem('isProfileVerified',JSON.stringify(res.data.isProfileVerified));
        localStorage.setItem('isVehicleVerified',JSON.stringify(res.data.isVehicleVerified));
        localStorage.setItem('isKycVerified',JSON.stringify(res.data.isKycVerified));
        this.router.navigate(['/register'],{ queryParams: { mobileNo: mobileData.mobile } });
        // this.router.navigate(['/vendorDashboard']);
    }  
    else{
      this.authService.setToken(res.data.accessToken);
      localStorage.setItem('userId',res.data.userId);
      this.router.navigate(['/register'],{ queryParams: { mobileNo: mobileData.mobile } });
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
