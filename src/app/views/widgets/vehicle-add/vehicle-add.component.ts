import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-vehicle-add',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,MatDialogModule,MatFormFieldModule,MatInputModule,MatButtonModule],
  templateUrl: './vehicle-add.component.html',
  styleUrl: './vehicle-add.component.scss'
})
export class VehicleAddComponent {

  vehicleForm!:FormGroup

  constructor(public dialogRef: MatDialogRef<VehicleAddComponent>,private fb:FormBuilder, 
    @Inject(MAT_DIALOG_DATA) public data: any) 
  {
    if(data?.v)
     {
      this.vehicleForm.patchValue({
        vehicleNo: data?.v?.vehicleNo,
        vehicleType: data?.v?.type,
        vehicleModel: data?.v?.model,
        vehicleCapacity: data?.v?.capacity,
      });
     }

  }

  ngOnInit(): void {
    this.vehicleForm = this.fb.group({
      vehicleNo: ['', [Validators.required,Validators.pattern(/^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/)]],
      vehicleType: ['', [Validators.required]],
      vehicleModel: ['', [Validators.required]],
      vehicleCapacity: ['', [Validators.required,Validators.pattern(/^\d+$/)]]
    });
        
      
  }

  submit() {
    if (this.vehicleForm.invalid) {
      this.vehicleForm.markAllAsTouched();
      return;
    }

    console.log(this.vehicleForm.value);
  }

  close() {
    this.dialogRef.close();
  }



}
