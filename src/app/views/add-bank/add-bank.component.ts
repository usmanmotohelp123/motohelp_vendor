import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AllServicesService } from '../all-services.service';
import { SharedService } from '../Services/shared.service';

@Component({
  selector: 'app-add-bank',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './add-bank.component.html',
  styleUrl: './add-bank.component.scss'
})
export class AddBankComponent  implements OnInit{

  bankKycForm!:FormGroup
  vendorId: string = '';

constructor(private router: Router,private allServices:AllServicesService,private sharedService: SharedService,private fb: FormBuilder){

}

ngOnInit(): void {

   this.vendorId = String(localStorage.getItem('vendorid'));

   this.bankKycForm = this.fb.group({
      ifsc: ['',Validators.required],//[Validators.required, Validators.pattern('^[A-Z]{4}0[A-Z0-9]{6}$')]
      bankName: ['', Validators.required],
      accountNumber: ['', [Validators.required, Validators.minLength(9)]],
      confirmAccountNumber: ['', Validators.required],
      accountHolderName: ['', Validators.required],
      accountType: ['', Validators.required],
      document: [null,]
    }, {
      validators: this.accountMatchValidator
    });
   
}


 // Custom validator for account number match
  accountMatchValidator(form: FormGroup) {
    const acc = form.get('accountNumber')?.value;
    const confirmAcc = form.get('confirmAccountNumber')?.value;

    return acc === confirmAcc ? null : { mismatch: true };
  }

  // onFileChange(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.bankKycForm.patchValue({
  //       document: file
  //     });
  //   }
  // }

  onFileChange(event: any) {
  const file = event.target.files[0];

  if (!file) return;

  // Optional validation
  if (!file.type.startsWith('image/')) {
    alert('Only image files allowed');
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    const base64 = reader.result as string;

    this.bankKycForm.patchValue({
      document: base64   
    });
  };

  reader.onerror = (error) => {
    console.error('File reading error:', error);
  };

  reader.readAsDataURL(file); 
}

  onSubmit() {
    if (this.bankKycForm.invalid) {
      this.bankKycForm.markAllAsTouched();
      return;
    }

    console.log(this.bankKycForm.value);

    const payload = {
    vendorid: this.vendorId,
    bank_ac_holder_name: this.bankKycForm.value?.accountHolderName,
    bank_ac_number: this.bankKycForm.value?.accountNumber,
    bank_ac_number_verify: this.bankKycForm.value?.confirmAccountNumber,
    ifsc_code: this.bankKycForm.value?.ifsc,
    bank_name: this.bankKycForm.value?.bankName,
    branch_name: this.bankKycForm.value.branch_name,
    account_type: this.bankKycForm.value?.accountType,
    cheque_img: this.bankKycForm.value?.document
  };

  console.log("KYC Payload:", payload);

   this.allServices.addBankKyc(payload).subscribe({
    next: (res: any) => {
      if (res.status === '00') {
        this.sharedService.success("Bank KYC saved successfully");
        this.bankKycForm.reset();
        console.log("Response:", res);
      } else {
        this.sharedService.error(res.message);
      }
    },
    error: (err) => {
      // console.error(err);
      // this.sharedService.error("Something went wrong");
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
