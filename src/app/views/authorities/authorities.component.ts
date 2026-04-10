import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormModule } from '@coreui/angular';

@Component({
  selector: 'app-authorities',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './authorities.component.html',
  styleUrl: './authorities.component.scss'
})
export class AuthoritiesComponent implements OnInit {

  // Max limit
  maxAuthorities = 1;

  // Saved authorities (table data)
  authorities: any[] = [];

  // Modal control
  showAddModal = false;

  editingIndex: number | null = null;
  isEditMode = false;

  // Reactive form
  authorityForm!: FormGroup;

  constructor(private fb: FormBuilder) {
     
  }

  ngOnInit(): void {
   
  }

 trackByIndex(index: number): number {
  return index;
}

  // ===== DERIVED VALUES =====
  get usedAuthorities(): number {
    return this.authorities.length;
  }

  get remainingAuthorities(): number {
    return this.maxAuthorities - this.usedAuthorities;
  }

  get isLimitReached(): boolean {
    return this.remainingAuthorities <= 0;
  }

  // ===== FORM ARRAY =====
  get authorityArray(): FormArray {
    return this.authorityForm.get('authorities') as FormArray;
  }

  // ===== EVENTS =====
  onMaxChange() {
    if (this.maxAuthorities < this.usedAuthorities) {
      this.maxAuthorities = this.usedAuthorities;
    }
  }

  // OPEN MODAL
  startAddAuthority() {
    if (this.isLimitReached) return;

    this.authorityForm = this.fb.group({
      authorities: this.fb.array([])
    });

   // Create cards based on remaining count
    for (let i = 0; i < this.remainingAuthorities; i++) {
      this.addAuthorityCard();
    }
    this.showAddModal = true;
  }

  // ADD SINGLE CARD
  addAuthorityCard() {
    this.authorityArray.push(
      this.fb.group({
        name: ['', Validators.required],
        department: ['', Validators.required],
        designation: ['', Validators.required],
        mobile: ['', [Validators.required, ]],//Validators.pattern(/^[0-9]{10}$/)
        email: ['', [Validators.required,]],// Validators.email
        level: ['', Validators.required],
      })
    );
  }

  // saveAuthorities() {
  //   console.log("Submit")
  //   if (this.authorityForm.invalid) {
  //     this.authorityForm.markAllAsTouched();
  //     return;
  //   }

  //   this.authorities.push(...this.authorityArray.value);
  //   this.closeModal();
  // }

saveAuthorities() {
  if (this.authorityForm.invalid) {
    this.authorityForm.markAllAsTouched();
    return;
  }

  const values = this.authorityArray.value;

  if (this.isEditMode && this.editingIndex !== null) {
    // UPDATE existing authority
    this.authorities[this.editingIndex] = values[0];
  } else {
    // ADD new authorities
    this.authorities.push(...values);
  }

  this.resetModal();
}


closeModal() {
    this.showAddModal = false;
}

edit(auth: any, index: number) {
  this.isEditMode = true;
  this.editingIndex = index;

  // Create form with ONE authority (edit mode)
  this.authorityForm = this.fb.group({
    authorities: this.fb.array([
      this.fb.group({
        name: [auth.name, Validators.required],
        department: [auth.department, Validators.required],
        designation: [auth.designation, Validators.required],
        mobile: [auth.mobile, Validators.required],
        email: [auth.email, [Validators.required]],
        level: [auth.level, Validators.required],
      })
    ])
  });

  this.showAddModal = true;
}

 deleteAuthority(index: number) {
    this.authorities.splice(index, 1);
  }

resetModal() {
  this.showAddModal = false;
  this.isEditMode = false;
  this.editingIndex = null;
}


}